import ProfileDialog from "@/components/ProfileDialog/ProfileDialog";
import { MENU_TYPE, SESSIONSTORAGE } from "@/constants/Constant";
import useGetMarkets from "@/hooks/useGetMarkets";
import useGetUserBalance from "@/hooks/useGetUserBalance";
import useLogin from "@/hooks/useLogin";
import { useAccountStore } from "@/store/useAccountStore";
import { useMenuStore } from "@/store/useMenuStore";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button } from "@mui/material";
import classnames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HowToPlay from "../HowToPlay/HowToPlay";
import styles from "./Header.module.scss";

const ProfileItem = ({ type, text }) => {
    return (
        <div className={styles.profileItem}>
            {type === "person" && <PersonIcon sx={{ fontSize: 16 }} />}

            {type === "wallet" && <AccountBalanceWalletIcon sx={{ fontSize: 16 }} />}
            <span> {text}</span>
        </div>
    );
};

const MenuTab = ({ tab }) => {
    const { currentMenu, setCurrentMenu } = useMenuStore();
    const router = useRouter();
    const { t } = useTranslation();
    return (
        <div
            className={classnames(styles.tabItem, { [styles.active]: tab === currentMenu })}
            onClick={() => {
                setCurrentMenu(tab);
                router.push({
                    pathname: `/`,
                    query: { menu: tab }
                });
            }}
        >
            <span>{t(`${tab.toLowerCase()}`)}</span>
        </div>
    );
};

export const Header = () => {
    const router = useRouter();
    const { account, isAdmin, setCleanSessionStorage, balance } = useAccountStore();
    const { currentMarketID, currentMenu, setCurrentMarketID } = useMenuStore();
    const { updateMarkets } = useGetMarkets();
    const { updateBalance } = useGetUserBalance();
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [openHowToPlayDialog, setOpenHowToPlayDialog] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLanguageExpand, setIsLanguageExpand] = useState(false);
    const { i18n } = useTranslation();
    const [userCode, setUserCode] = useState();
    const { googleLogin, handleFetchLogin, setUserInfo } = useLogin();

    const refreshMarkets = () => {
        // TODO: Market 跟 statement 要分開 refresh
        updateMarkets();
        updateBalance();
    };

    const handleRedirectToAdminMarkets = () => {
        setIsDrawerOpen(false);
        router.push({
            pathname: `/admin/markets`
        });
    };

    const handleLogout = () => {
        setIsDrawerOpen(false);
        sessionStorage.removeItem(SESSIONSTORAGE.LOGIN_INFO);
        setCleanSessionStorage();
        router.push({
            pathname: `/`
        });
    };

    const handleLogin = async () => {
        googleLogin();
    };

    useEffect(() => {
        setUserInfo();
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");
        if (!!code) setUserCode(code);
    }, [router.asPath]);

    useEffect(() => {
        handleFetchLogin(userCode);
    }, [userCode]);

    const handleReturnBack = () => {
        if (currentMarketID) {
            router.push({
                pathname: `/`,
                query: { menu: currentMenu }
            });
            refreshMarkets();
            setCurrentMarketID(null);
        }
    };

    const handleClickProfile = () => {
        setOpenProfileDialog(true);
    };

    const handleCloseProfileDialog = () => {
        setOpenProfileDialog(false);
    };

    const handleSwitchHowToPlay = () => {
        setIsDrawerOpen(false);
        setOpenHowToPlayDialog(!openHowToPlayDialog);
    };

    const handleDrawer = () => {
        setIsLanguageExpand(isDrawerOpen);
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleLanguageArea = () => {
        setIsLanguageExpand(!isLanguageExpand);
    };

    const handleSwitchLanguage = (lan) => {
        setIsDrawerOpen(false);
        setIsLanguageExpand(false);
        i18n.changeLanguage(lan);
    };

    const languages = [
        {
            language: "en",
            languageName: "English"
        },
        {
            language: "ind",
            languageName: "English(India)"
        },
        {
            language: "vn",
            languageName: "Tiếng Việt"
        },
        {
            language: "th",
            languageName: "ภาษาไทย"
        },
        {
            language: "idn",
            languageName: "Indonesian"
        }
    ];

    return (
        <>
            <div className={styles.root}>
                <div className={styles.header}>
                    <div onClick={currentMarketID ? handleReturnBack : refreshMarkets}>{currentMarketID ? <ArrowBackIcon /> : <RefreshIcon />}</div>
                    <div className={styles.logo}>
                        <Image src="/logo-text.svg" alt="placeholder" width={150} height={30} />
                    </div>
                    <div>
                        <Button onClick={handleDrawer}>
                            <MenuIcon sx={{ color: "#ffffff" }} />
                        </Button>
                        {isDrawerOpen && (
                            <div className={classnames(styles.drawerContainer)}>
                                <div className={classnames(styles.closeDrawer)}>
                                    <CloseIcon onClick={handleDrawer} sx={{ color: "#1A84F2" }} />
                                </div>
                                {account && isAdmin ? (
                                    <div className={classnames(styles.list)}>
                                        <div className={classnames(styles.listItem)} onClick={handleRedirectToAdminMarkets}>
                                            <ManageAccountsIcon sx={{ color: "#1A84F2" }} />
                                            <span className={classnames(styles.listItemName)}>Manage markets</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={classnames(styles.list)}>
                                        <div className={classnames(styles.listItem)} onClick={handleSwitchHowToPlay}>
                                            <LightbulbIcon sx={{ color: "#1A84F2" }} />
                                            <span className={classnames(styles.listItemName)}>How To Play</span>
                                        </div>
                                    </div>
                                )}
                                <div className={classnames(styles.list)}>
                                    <div className={classnames(styles.listItem)} onClick={handleLanguageArea}>
                                        <LanguageIcon sx={{ color: "#1A84F2" }} />
                                        <span className={classnames(styles.listItemName)}>Language</span>
                                    </div>
                                    {isLanguageExpand && (
                                        <div className={classnames(styles.languageArea)}>
                                            {languages.map((item) => (
                                                <button
                                                    onClick={() => {
                                                        handleSwitchLanguage(item.language);
                                                    }}
                                                >
                                                    {item.languageName}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {account ? (
                                    <div className={classnames(styles.list)}>
                                        <div className={classnames(styles.listItem)} onClick={handleLogout}>
                                            <LogoutIcon sx={{ color: "#1A84F2" }} />
                                            <span className={classnames(styles.listItemName)}>Logout</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={classnames(styles.list)}>
                                        <div className={classnames(styles.listItem)} onClick={handleLogin}>
                                            <LoginIcon sx={{ color: "#1A84F2" }} />
                                            <span className={classnames(styles.listItemName)}>Login</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {account && (
                    <div className={styles.headerInfo}>
                        <div className={styles.profile} onClick={handleClickProfile}>
                            <ProfileItem type="person" text={account} />
                            <ProfileItem type="wallet" text={`${balance} SURE`} />
                        </div>
                        {!currentMarketID && (
                            <div className={styles.tab}>
                                <MenuTab tab={MENU_TYPE.MARKET} />
                                <MenuTab tab={MENU_TYPE.STATEMENT} />
                            </div>
                        )}
                    </div>
                )}
            </div>
            {openProfileDialog && <ProfileDialog onClose={handleCloseProfileDialog} />}
            {openHowToPlayDialog && <HowToPlay onClose={handleSwitchHowToPlay} />}
        </>
    );
};
