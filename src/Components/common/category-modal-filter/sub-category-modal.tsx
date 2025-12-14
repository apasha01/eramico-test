"use client";

import React from "react";
import {
  Modal,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";

interface SubCategoryModalProps {
  open: boolean;
  onClose: () => void;
  subCategories: { id: number; title: string }[];
  onSelectSubCategory: (subCategoryId: number) => void;
}

const SubCategoryModal = ({
  open,
  onClose,
  subCategories,
  onSelectSubCategory,
}: SubCategoryModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "flex-end" }}
    >
      <Paper
        sx={{
          width: "100%",
          height: "50vh",
          borderRadius: "16px 16px 0 0",
          p: 2,
          overflowY: "auto",
        }}
      >
        <Typography
          sx={{ fontSize: "18px", fontWeight: 600, textAlign: "center" }}
        >
          انتخاب کالا
        </Typography>
        <List>
          {subCategories.map((subCategory) => (
            <ListItem
              key={subCategory.id}
              sx={{
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "8px",
                mb: 1,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
              onClick={() => onSelectSubCategory(subCategory.id)}
            >
              <ListItemText primary={subCategory.title} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" fullWidth onClick={onClose}>
          بازگشت
        </Button>
      </Paper>
    </Modal>
  );
};

export default SubCategoryModal;
