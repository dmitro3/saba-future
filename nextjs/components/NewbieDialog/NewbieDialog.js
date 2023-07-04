import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { UserInfoContext } from "@/contexts/UserInfoContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useState } from "react";
import styles from "./NewbieDialog.module.scss";

/**
 * TODO:
 * 1. 應為統一樣式，不只為新user時使用
 * 2. 新功能: 按鍵領取免費 sure
 * 3. 樣式調整
 */

export const NewbieDialog = () => {
    const { balance, userStatements } = useContext(UserInfoContext);
    const { account } = useContext(BiconomyAccountContext);
    const [isNewbie, setIsNewbie] = useState(false);

    useEffect(() => {
        if (account && balance === 0 && !userStatements) {
            setIsNewbie(true);
        }
    }, [account, balance, userStatements]);

    return (
        <Dialog sx={{ textAlign: "center" }} onClose={() => setIsNewbie(false)} open={isNewbie}>
            <Paper sx={{ backgroundImage: "linear-gradient(145deg, #1A84F2, #ce5eff)" }}>
                <DialogTitle sx={{ fontSize: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ width: "10px", height: "1px", backgroundColor: "#fff", marginRight: "4px" }}></span>
                        <span style={{ color: "#fff" }}>Welcome to SaBa Future</span>
                        <span style={{ width: "10px", height: "1px", backgroundColor: "#fff", marginLeft: "4px" }}></span>
                    </div>
                </DialogTitle>
                <Box
                    sx={{
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <CardContent>
                        <Typography sx={{ fontSize: 20 }} gutterBottom>
                            Make your first bet and get <div style={{ fontWeight: "bold", fontSize: 30 }}>1000</div> free SURE tokens!
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => setIsNewbie(false)} className={styles.btn}>
                            Claim Now
                        </Button>
                    </CardActions>
                </Box>
            </Paper>
        </Dialog>
    );
};
