import { BET_TYPE } from "@/constants/Constant";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

export const AdminConfirmPage = (props) => {
    const { title, onClose, open, onConfirm, selectedResolve } = props;

    const handleConfirm = () => {
        onConfirm();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog sx={{ textAlign: "center" }} onClose={handleClose} open={open}>
            <DialogTitle sx={{ color: "#1A84F2" }}>{title}</DialogTitle>
            <CardContent>
                <Typography sx={{ fontSize: 14, textAlign: "center" }} color="text.secondary" gutterBottom>
                    Your setting :
                </Typography>
                <Typography sx={{ fontSize: 18, textAlign: "center" }} color={selectedResolve === BET_TYPE.YES ? "#3FB06B" : "#E84D4D"} gutterBottom>
                    {selectedResolve}
                </Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={handleConfirm}> CONFIRM </Button>
                <Button onClick={handleClose} color="error">
                    CANCEL
                </Button>
            </CardActions>
        </Dialog>
    );
};
