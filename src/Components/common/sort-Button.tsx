"use client";

import React, { useState } from "react";
import { Typography, Modal, Box, Button } from "@mui/material";
import { PiSortAscending } from "react-icons/pi";
import { useRouter } from "next/navigation";
import SortProps from "@/Helpers/Interfaces/SortProps";
import { getSortOptionLabel } from "@/Helpers/Utilities";

export default function SortButton(props: SortProps) {
  const items = getSortOptionLabel(props);
  const {
    url,
    searchParams,
    defaultSelected = "eranico",
    queryStringName = "sort",
  } = props;
  const router = useRouter();

  const [selectedItem, setSelectedItem] = useState(defaultSelected);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    setOpen(false);
    const current = new URLSearchParams();
    if (searchParams) {
      // Convert searchParams to URLSearchParams
      if (searchParams instanceof URLSearchParams) {
        Array.from(searchParams.entries()).forEach(([key, value]) => {
          current.set(key, value);
        });
      } else {
        Object.entries(searchParams).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            current.set(key, value[0]);
          } else {
            current.set(key, value);
          }
        });
      }
    }

    if (item && item.length > 0) current.set(queryStringName, item);
    else current.delete(queryStringName);
    router.replace(`${url}?${current.toString()}`);
  };

  return (
    <>
      <Typography className="fs-14 fw-500 pointerCursor" onClick={handleOpen}>
        {items.find((opt) => opt.value === selectedItem)?.label || "مرتب‌سازی"}
        <PiSortAscending size={24} style={{ marginInline: "4px" }} />
      </Typography>

      <Modal open={open} onClose={handleClose} aria-labelledby="sort-modal">
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            bgcolor: "white",
            boxShadow: 24,
            p: 2,
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          <Typography variant="h6" className="text-center pb-2">
            مرتب‌سازی بر اساس
          </Typography>

          {items.map((option) => (
            <Button
              key={option.value}
              fullWidth
              className={`sortOptionBtn ${
                selectedItem === option.value ? "selected" : ""
              }`}
              onClick={() => handleItemClick(option.value)}
              sx={{
                p: 2,
                color: selectedItem === option.value ? "#FB8C00" : "#333",
                fontWeight: selectedItem === option.value ? "bold" : "normal",
              }}
            >
              {option.label}
            </Button>
          ))}
        </Box>
      </Modal>
    </>
  );
}
