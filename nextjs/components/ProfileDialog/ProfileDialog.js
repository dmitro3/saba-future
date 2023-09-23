import { useAccountStore } from "@/store/useAccountStore";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function ProfileDialog({ onClose }) {
    const { email, balance } = useAccountStore();
    const { t } = useTranslation();

    return (
        <Dialog onClose={() => onClose()} open>
            <DialogTitle>{t("profile")}</DialogTitle>
            <List sx={{ width: 332 }}>
                <ListItem>
                    <Grid container>
                        <Grid item xs={10}>
                            <Typography color="primary" variant="h3" align="center">
                                {balance}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} display="flex" alignItems="end">
                            <Typography variant="overline">{t("stake_unit")}</Typography>
                        </Grid>
                    </Grid>
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                            <PersonIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={email} />
                </ListItem>
            </List>
        </Dialog>
    );
}

ProfileDialog.propTypes = {
    onClose: PropTypes.func.isRequired
};
