import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import SocialLogin from "@biconomy/web3-auth";
import SmartAccount from "@biconomy/smart-account";
import { ChainId } from "@biconomy/core-types";

import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";




export default function BiconomyNavbar() {
    const router = useRouter();
    const [account, setAccount] = useContext(BiconomyAccountContext);
    const [socialLoginSDK, setSocialLoginSDK] = useState(null);
    const [provider, setProvider] = useState(undefined);

    const connectWallet = useCallback(async () => {
        console.log("connectWallet()");
        if (typeof window === "undefined") return;
        console.log(`socialLoginSDK: ${socialLoginSDK}`);

        if (socialLoginSDK?.provider) {
            const web3Provider = new ethers.providers.Web3Provider(
                socialLoginSDK.provider
            );
            setProvider(web3Provider);
            const accounts = await web3Provider.listAccounts();
            setAccount(accounts[0]);
            return;
        }

        if (socialLoginSDK) {
            socialLoginSDK.showWallet();
            return socialLoginSDK;
        }

        const sdk = new SocialLogin();
        const chainId = 80001;
        const signature = await sdk.whitelistUrl("https://saba-future.vercel.app");
        await sdk.init({
            chainId: ethers.utils.hexValue(chainId),
            whitelistUrls: {
                "https://saba-future.vercel.app": signature,
            },
        });
        setSocialLoginSDK(sdk);
        sdk.showWallet();
        return socialLoginSDK;
        
    }, [socialLoginSDK]);

    const disconnectWallet = async () => {
        if (!socialLoginSDK || !socialLoginSDK.web3auth) {
            console.error("Binconomy SDK not initialized");
            return;
        }

        await socialLoginSDK.logout();
        socialLoginSDK.hideWallet();
        setProvider(undefined);
        setAccount(undefined);
        // setSmartContractWalletAddress("");
    };

    useEffect(() => {
        if (socialLoginSDK && socialLoginSDK.provider) {
            socialLoginSDK.hideWallet();
        }
    }, [account, socialLoginSDK]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (account) {
                clearInterval(interval);
            }
            if (socialLoginSDK?.provider && !account) {
                connectWallet();
            }

            return () => {
                clearInterval(interval);
            };
        }, 1000);

    }, [account, connectWallet, socialLoginSDK]);

    useEffect(() => {
        async function setupSmartAccount() {
            const smartAccount = new SmartAccount(provider, {
                activeNetworkId: ChainId.POLYGON_MUMBAI,
                supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
            });
            await smartAccount.init();
        }
    }, [account, provider]);

    return (
        <>
            <nav className="w-full h-16 mt-auto max-w-5xl">
                <div className="flex flex-row justify-between items-center h-full">
                    <Link href="/" passHref>
                        <span className="font-semibold text-xl cursor-pointer">
                            Prediction World
                        </span>
                    </Link>
                    {!router.asPath.includes("/market") &&
                        !router.asPath.includes("/admin") && (
                            <div className="flex flex-row items-center justify-center h-full">
                                <TabButton
                                    title="Market"
                                    isActive={router.asPath === "/"}
                                    url={"/"}
                                />
                                <TabButton
                                    title="Portfolio"
                                    isActive={router.asPath === "/portfolio"}
                                    url={"/portfolio"}
                                />
                            </div>
                    )}

                    {account ? (
                        <></>

                    ) : (
                        <></>
                        /*
                        <div
                            className="bg-green-500 px-6 py-2 rounded-md cursor-pointer"
                            onClick={connectWallet} // original code is load all data
                        >
                            <span className="text-lg text-white">Connect</span>
                        </div>
                        */
                    )}
                </div>
            </nav>
        </>
    );
}

const TabButton = ({ title, isActive, url }) => {
    return (
      <Link href={url} passHref>
        <div
          className={`h-full px-4 flex items-center border-b-2 font-semibold hover:border-blue-700 hover:text-blue-700 cursor-pointer ${isActive
            ? "border-blue-700 text-blue-700 text-lg font-semibold"
            : "border-white text-gray-400 text-lg"
            }`}
        >
          <span>{title}</span>
        </div>
      </Link>
    );
  };