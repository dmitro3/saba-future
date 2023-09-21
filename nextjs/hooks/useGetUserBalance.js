import syncGetBalance from "@/service/wallet/getBalance";
import { useAccountStore } from "@/store/useAccountStore";
import { useEffect } from "react";

const useGetUserBalance = () => {
    const { nickName, setBalance, token } = useAccountStore();

    const updateBalance = async () => {
        try {
            const response = await syncGetBalance(token);
            if (!!response && response.ErrorCode === 0) {
                setBalance(response.Result.Balance);
            }
        } catch (error) {
            console.error(`Error getting balance, ${error}`);
        }
    };

    useEffect(() => {
        if (!!account && !!token) updateBalance();
    }, [account, token]);

    return { updateBalance };
};

export default useGetUserBalance;
