import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React, { useState, ReactNode } from "react";
import { useTranslate } from "@refinedev/core";
import { styled } from "@mui/material/styles";

type ConfirmCallback = () => void;

const StyledDialogActions = styled(DialogActions)(({}) => ({
  justifyContent: "space-between",
}));

interface ConfirmationModalProps {
  openModal: (
    // eslint-disable-next-line no-unused-vars
    confirmCallback: ConfirmCallback,
    // eslint-disable-next-line no-unused-vars
    modalContent: ReactNode
  ) => void;
  closeModal: () => void;
  ConfirmationModal: JSX.Element;
}

const useConfirmationModal = (initialOpen = false): ConfirmationModalProps => {
  const t = useTranslate();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [callback, setCallback] = useState<ConfirmCallback | null>(null);
  const [content, setContent] = useState<ReactNode>("");

  const openModal = (
    confirmCallback: ConfirmCallback,
    modalContent: ReactNode
  ) => {
    setIsOpen(true);
    setCallback(() => confirmCallback);
    setContent(modalContent);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCallback(null);
    setContent("");
  };

  const handleConfirm = () => {
    if (callback) {
      callback();
    }
    closeModal();
  };

  return {
    openModal,
    closeModal,
    ConfirmationModal: (
      <Dialog open={isOpen} onClose={closeModal}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          {typeof content === "string" ? (
            <DialogContentText>{content}</DialogContentText>
          ) : (
            content
          )}
        </DialogContent>
        <StyledDialogActions>
          <Button onClick={closeModal} color="error">
            {t("buttons.cancel")}
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            {t("buttons.confirm")}
          </Button>
        </StyledDialogActions>
      </Dialog>
    ),
  };
};

export default useConfirmationModal;
