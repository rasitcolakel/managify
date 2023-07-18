import React, { useContext } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useTranslate } from "@refinedev/core";
import Link from "@components/common/Link";
import { ColorModeContext } from "@contexts/index";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CompleteProfileNotification() {
  const { open, setOpen } = useContext(ColorModeContext);
  const t = useTranslate();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{t("profiles.notCompletedDialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {t("profiles.notCompletedDialog.message")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Link itemType="button" href="/profile/settings">
          <Button onClick={handleClose}>
            {t("profiles.notCompletedDialog.buttons.complete")}
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
}
