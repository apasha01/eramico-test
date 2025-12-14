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

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  categories: { id: number; title: string }[];
  onSelectCategory: (categoryId: number) => void;
}

const CategoryModal = ({
  open,
  onClose,
  categories,
  onSelectCategory,
}: CategoryModalProps) => {
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
          انتخاب گروه
        </Typography>
        <List>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              sx={{
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "8px",
                mb: 1,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
              onClick={() => onSelectCategory(category.id)}
            >
              <ListItemText primary={category.title} />
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

export default CategoryModal;
