import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { PageContext } from "@/contexts/PageContext";
import { UserInfoContext } from "@/contexts/UserInfoContext";
import useGetMarkets from "@/hooks/useGetMarkets";
import useGetUserBalance from "@/hooks/useGetUserBalance";
import useGetUserStatement from "@/hooks/useGetUserStatement";
import useLogout from "@/hooks/useLogout";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { styled } from "@mui/system";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Suspense, useContext } from "react";
import styles from "./Header.module.scss";

const CustomPersonIcon = styled(PersonIcon)({
    fontSize: 16
});

const CustomAccountBalanceWalletIcon = styled(AccountBalanceWalletIcon)({
    fontSize: 16
});

const BiconomyWallet = dynamic(() => import("@/components/BiconomyWallet").then((res) => res.default), {
    ssr: false
});

const ProfileItem = ({ type, text }) => {
    return (
        <div className={styles.profileItem}>
            {type === "person" && <CustomPersonIcon />}

            {type === "wallet" && <CustomAccountBalanceWalletIcon />}
            <span> {text}</span>
        </div>
    );
};

export const AdminHeader = () => {
    const router = useRouter();
    const { account, email } = useContext(BiconomyAccountContext);
    const { currentMenu, setCurrentMarketID } = useContext(PageContext);
    const { updateMarkets } = useGetMarkets();
    const { updateStatements } = useGetUserStatement();
    const { updateBalance } = useGetUserBalance();
    const { balance } = useContext(UserInfoContext);
    const { disconnectWallet } = useLogout();

    const refreshMarkets = () => {
        updateMarkets();
        updateStatements();
        updateBalance();
    };

    const handleReturnBack = () => {
        router.push({
            pathname: `/`,
            query: { menu: currentMenu }
        });
        refreshMarkets();
        setCurrentMarketID(null);
    };

    const handleLogout = () => {
        if (account) {
            disconnectWallet();
        }
    };

    return (
        <>
            <Suspense>
                <BiconomyWallet />
            </Suspense>
            <div className={styles.root}>
                <div className={styles.header}>
                    <div onClick={handleReturnBack}>
                        <HomeOutlinedIcon />
                    </div>
                    <div> {account ? "Saba Orb" : "Wallet Connecting..."} </div>
                    <div className="cursor-pointer" onClick={handleLogout}>
                        {account ? <LogoutIcon /> : <LoginIcon />}
                    </div>
                </div>
                {account && (
                    <div className={styles.headerInfo}>
                        <div className={styles.profile}>
                            <ProfileItem type="person" text={account ? email || `${account.substr(0, 10)}...` : ""} />
                            <ProfileItem type="wallet" text={balance ? `${balance} SURE` : ""} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
