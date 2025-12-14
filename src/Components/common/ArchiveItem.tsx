"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>; // فرض بر اینه که onSubmit async هست
  title: string;
  text: string;
  submitText: string;
  submitColor?: string;
}

const ConfirmDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  text,
  submitText,
  submitColor,
}: ConfirmDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(); // منتظر انجام عملیات
    } finally {
      setLoading(false);
      onClose(); // بعد از اتمام عملیات دیالوگ بسته میشه
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      fullWidth
      maxWidth="sm"
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2,
        },
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ p: 2 }}>
        <Typography fontSize={18} fontWeight={700}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        <Typography fontSize={16} fontWeight={500} dangerouslySetInnerHTML={{ __html: text }} />
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor: submitColor || "#D32F2F",
            px: 3,
            "&:hover": { backgroundColor: submitColor || "#b71c1c" },
          }}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {submitText}
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{ border: "none", color: "#424242" }}
        >
          لغو
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
