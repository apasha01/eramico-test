"use client";

import { Box, Button, Modal, Typography } from "@mui/material";

export const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 576,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface DeleteModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  text: string;
  submitText: string;
  onSubmit: () => void;
}

const DeleteModal = ({
  show,
  title,
  text,
  onClose,
  onSubmit,
  submitText,
}: DeleteModalProps) => {
  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="delete-modal-title"
      dir="rtl"
      className="modal-box"
    >
      <Box className="rounded-4" sx={modalStyle} dir="rtl">
        <div className="d-flex justify-content-center align-items-center mb-4">
          <div className="d-flex flex-column justify-content-start align-items-start ">
            <Typography className="fs-18 fw-700">{title} </Typography>
            <Typography className="fs-16 fw-500 mt-4">{text}</Typography>
          </div>
        </div>
        <div className="pt-2 d-flex gap-4">
          <Button
            variant="contained"
            style={{ background: "#D32F2F", paddingInline: "24px" }}
            onClick={onSubmit}
          >
            {submitText}
          </Button>
          <Button
            variant="outlined"
            className="noBorder"
            onClick={onClose}
            style={{ color: "#424242", border: "none" }}
          >
            لغو
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
