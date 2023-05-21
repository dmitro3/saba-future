import Head from "next/head";
import Img from "next/image";
import { useState, useEffect, useCallback, useContext } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import moment from "moment";
import { Suspense } from "react";
import dynamic from "next/dynamic";

import Loading from "@/components/Loading";
import ChartContainer from "@/components/ChartContainer";
import { predictionWorld3Address, sureToken3Address } from "@/config";
import PredictionWorld from "@/utils/abis/PredictionWorld3.json";
import SureToken from "@/utils/abis/SureToken3.json";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";



const BiconomyNavbar = dynamic(
  () => import("../../components/BiconomyNavbar").then((res) => res.default),
  {
    ssr: false,
  }
);

export default function Detail() {
  const router = useRouter();
  const { id } = router.query;
  const {
    provider,
    account,
    smartAccount,
    predictionWorldContract,
    predictionWorldInterface,
    sureTokenInterface,
  } = useContext(BiconomyAccountContext);
  const [loading, setLoading] = useState(false);

  const [market, setMarket] = useState({
    title: "title of market",
    endTimestamp: "1681681545",
    totalAmount: 0,
    totalYesAmount: 0,
    totalNoAmount: 0
  });
  const [selected, setSelected] = useState("YES");
  const [input, setInput] = useState("");
  const [button, setButton] = useState("Trade");
  const [buttonTest, setButtonTest] = useState("Test");

  const getMarket = useCallback(async () => {
    try {
      const market = await predictionWorldContract.markets(id);
      //console.log(market);
      // handle millisecond time stamp
      // console.log(market.info.endTimestamp);
      const date = moment.unix(market.info.endTimestamp / 1000).format("MMMM D, YYYY");
      setMarket({
        title: market.info.question,
        endTimestamp: date,
        totalAmount: market.totalAmount,
        totalYesAmount: market.totalYesAmount,
        totalNoAmount: market.totalNoAmount,
        description: market.info.description,
        resolverUrl: market.info.resolverUrl,
      });

    } catch (error) {
      console.log(`Error getting market detail, ${error}`);
    }
  }, [id]);

  const handleTrade = async () => {
    try {
      setLoading(true);

      const { ethereum } = window;
      //const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const sureTokenContract = new ethers.Contract(
        sureToken3Address,
        SureToken.abi,
        signer
      );
      const predictionWorldContract = new ethers.Contract(
        predictionWorld3Address,
        PredictionWorld.abi,
        signer
      );
      //const accounts = await ethereum.request({ method: "eth_accounts" });
      //const account = accounts[0];
      let balance = await sureTokenContract.balanceOf(account);
      console.log(`balance of account: ${balance}`);
      console.log(`input: ${input}`);
      setButton("Please wait");

      if (input && selected === "YES") {
        // if (parseInt(input) < balance) {
        try {
          await sureTokenContract.approve(predictionWorld3Address, input, { gasLimit: 500000 });
          console.log("we got here");
          const betTx = await predictionWorldContract.addYesBet(id, input);
          await betTx.wait();
        } catch (error) {
          console.log(`Error: ${error}`);
        }
        // }
      } else if (input && selected === "NO") {
        // if (parseInt(input) < balance) {
        await sureTokenContract.approve(predictionWorld3Address, input, { gasLimit: 500000 });
        const betTx = await predictionWorldContract.addNoBet(id, input);
        await betTx.wait();
        // }
      }
      await getMarket();
      setButton("Trade");

    } catch (error) {
      console.log(`Error trading: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGasless = async () => {
    try {
      setLoading(true);

      let betFunction = null;
      if (input && selected === "YES") {
        betFunction = "addYesBet";
      } else if (input && selected === "NO") {
        betFunction = "addNoBet";
      }

      if (betFunction) {
        let transactions = [];
        try {
          const approveEncodedData = sureTokenInterface.encodeFunctionData(
            'approve', [predictionWorld3Address, input]
          );
          const addYesBetEncodedData = predictionWorldInterface.encodeFunctionData(
            betFunction, [id, input]
          );
          transactions = [{
            to: sureToken3Address,
            data: approveEncodedData,
            gasLimit: 500000,
          }, {
            to: predictionWorld3Address,
            data: addYesBetEncodedData,
          }];

          const txResponse = await smartAccount.sendTransactionBatch({ transactions });
          console.log('UserOp hash', txResponse.hash);
          await txResponse.wait();

        } catch (error) {
          console.log(`Error: ${error}`);
        }

        await getMarket();
        setButton("Trade");
      }

    } catch (error) {
      console.log(`Error trading: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMarket();
  }, [router.isReady, account, provider, getMarket]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Loading loading={loading}></Loading>
      <Head>
        <title>Prediction World</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <BiconomyNavbar />
      </Suspense>

      <main className="w-full flex flex-col sm:flex-row py-4 max-w-5xl">
        <div className="w-full flex flex-col pt-1">
          <div className="p-6 rounded-lg flex flex-row justify-start border border-gray-300">
            <div className="flex flex-row">
              <div className="h-w-15 pr-4">
                <Img
                  src="/placeholder.jpg"
                  alt="placeholder"
                  className="rounded-full"
                  width={55}
                  height={55}
                />
              </div>
              <div className="flex flex-col justify-start w-1/2 space-y-1">
                <span className="text-xs font-light text-gray-500 whitespace-nowrap">
                  Some placeholder - should be tags or something
                </span>
                <span className="text-lg font-semibold whitespace-nowrap">
                  {market?.title}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-4 ml-3">
              <div className="flex flex-col justify-start bg-gray-100 p-3">
                <span className="text-xs font-light text-gray-500 whitespace-nowrap">
                  Market Ends on
                </span>
                <span className="text-base font-semibold text-black whitespace-nowrap">
                  {market?.endTimestamp
                    ? market.endTimestamp.toLocaleString()
                    : "N/A"
                  }
                </span>
              </div>
              <div className="flex flex-col justify-start bg-gray-100 p-3">
                <span className="text-xs font-light text-gray-500 whitespace-nowrap">
                  Total Volume
                </span>
                <span className="text-base font-semibold text-black whitespace-nowrap">
                  {`${market?.totalAmount} SURE`}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="w-full flex flex-row mt-5">
              <div className="w-2/3 border rounded-lg p-1 pb-4 border-gray-300 mr-2">
                <ChartContainer questionId={id} />
              </div>
              <div className="w-1/3 rounded-lg border border-gray-300 ml-2">
                <div className="flex flex-col items-start p-6">
                  <span className="text-lg font-bold m-auto pb-2">Buy</span>
                  <hr className="text-black w-full py-2" />
                  <span className="text-base">Pick Outcome</span>
                  <div
                    className={`w-full py-2 px-2 ${selected == "YES"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100"
                      } mt-2 cursor-pointer`}
                    onClick={() => setSelected("YES")}
                  >
                    <span className="font-bold">YES</span>{" "}

                    {!market?.totalAmount
                      ? `0`
                      : (
                        (market?.totalYesAmount * 100) /
                        market?.totalAmount
                      ).toFixed(2)}
                    %
                  </div>
                  <div
                    className={`w-full py-2 px-2 ${selected == "NO"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100"
                      } mt-2 cursor-pointer`}
                    onClick={() => setSelected("NO")}
                  >
                    <span className="font-bold">No</span>{" "}
                    {!market?.totalAmount
                      ? `0`
                      : (
                        (market?.totalNoAmount * 100) /
                        market?.totalAmount
                      ).toFixed(2)}
                    %
                  </div>
                  <span className="text-sm mt-5 mb-4">How much?</span>
                  <div className="w-full border border-gray-300 flex flex-row items-center">
                    <input
                      type="search"
                      name="q"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full py-2 px-2 text-base text-gray-700 border-gray-300 rounded-md focus:outline-none"
                      placeholder="0"
                      autoComplete="off"
                    />
                    <span className="whitespace-nowrap text-sm font-semibold">
                      SURE{"| "}
                    </span>
                    <span className="text-sm font-semibold text-blue-700 mx-2 underline cursor-pointer">
                      Max
                    </span>
                  </div>
                  <button
                    className="mt-5 rounded-lg py-3 text-center w-full bg-blue-700 text-white"
                    onClick={handleGasless}
                    disabled={button !== "Trade"}
                  >
                    {buttonTest}
                  </button>
                  <button
                    className="mt-5 rounded-lg py-3 text-center w-full bg-blue-700 text-white"
                    onClick={handleTrade}
                    disabled={button !== "Trade"}
                  >
                    {button}
                  </button>
                </div>
              </div>
            </div>
            <div className="w-2/3 flex flex-col">
              <span className="text-base font-semibold py-3">
                Description
              </span>
              <span>{market?.description}</span>
              <span className="text-base my-3 py-2 bg-gray-100 rounded-xl px-3">
                Resolution Source : {" "}
                <a className="text-blue-700" href={market?.resolverUrl}>
                  {market?.resolverUrl}
                </a>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}