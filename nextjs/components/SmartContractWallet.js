import { useState, useCallback, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import SocialLogin from "@biconomy/web3-auth";

export default function SmartContractWallet() {
    const [provider, setProvider] = useState(undefined);
    const [account, setAccount] = useState("");
    const [socialLoginSDK, setSocialLoginSDK] = useState(null);

    const connectWeb3 = useCallback(async () => {
        console.log("here");
        if (typeof window === "undefined") return;
        console.log(`socialLoginSDK: ${socialLoginSDK}`);

        // use biconomy detected provider if it exists
        if (socialLoginSDK?.provider) {
            const web3Provider = new ethers.providers.Web3Provider(
                socialLoginSDK.provider
            );
            setProvider(web3Provider);
            const accounts = await web3Provider.listAccounts();
            setAccount(accounts[0]);
            return;
        }

        // no providers chosen, show wallet selection
        if (socialLoginSDK) {
            socialLoginSDK.showWallet();
            return socialLoginSDK;
        }

        // no biconomy SDK, initialize it
        const sdk = new SocialLogin();
        const chainId = 80001; // mumbai
        await sdk.init({
            chainId: ethers.utils.hexValue(chainId),
        });
        setSocialLoginSDK(sdk);
        sdk.showWallet();
        return socialLoginSDK;

    }, [socialLoginSDK]);

    // if wallet is connected, close the widget
    useEffect(() => {
        console.log("connected, hide the wallet");
        if (socialLoginSDK && socialLoginSDK.provider) {
            socialLoginSDK.hideWallet();
        }
    }, [account, socialLoginSDK]); // I feel account is not needed?

    // after metamask login -> get provider event *not sure why this is metamask specific
    // maybe sometimes metamask is slow in providing account?
    useEffect(() => {
        const interval = setInterval(async () => {
            if (account) {
                clearInterval(interval);
            }
            if (socialLoginSDK?.provider && !account) {
                connectWeb3();
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [account, connectWeb3, socialLoginSDK]);

    const diconnectWeb3 = async () => {
        if (!socialLoginSDK || !socialLoginSDK.web3auth) {
            console.error("Biconomy SDK not initialized");
            return;
        }

        await socialLoginSDK.logout();
        socialLoginSDK.hideWallet();
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1>Biconomy Login</h1>
            </main>
        </div>
    );
}