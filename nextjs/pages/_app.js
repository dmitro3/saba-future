import { MENU_TYPE } from "@/constants/Constant";
import { useMenuStore } from "@/store/useMenuStore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "./i18n.js";

export default function App({ Component, pageProps }) {
    const router = useRouter();
    const { menu, marketid } = router.query;
    const { setCurrentMenu, setCurrentMarketID } = useMenuStore();
    const defaultMenu = menu && menu != "" ? menu : MENU_TYPE.MARKET;
    const defaultMarketID = marketid ? marketid : null;
    const { t } = useTranslation();

    useEffect(() => {
        setCurrentMenu(defaultMenu);
        setCurrentMarketID(defaultMarketID);
    }, [menu, marketid]);

    return (
        <>
            <Head>
                <title>{t("saba_orb")}</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/logo.ico" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
