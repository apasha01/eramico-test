"use client";

import React, { useState } from "react";
import { Button, Modal, Box, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CompanyEditInfo from "./company-info";

const CompanyEditModal = ({ props }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* دکمه ویرایش */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<EditIcon style={{color:"white"}}  />}
        onClick={handleOpen}
        style={{
            color:"white",
            marginRight:16
        }}
      >
        ویرایش
      </Button>

      {/* مدال */}
      <Modal open={open} onClose={handleClose}>
        <Box
        
          sx={{
            position: "absolute" as const,
            direction:"ltr",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", md: 800 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">ویرایش اطلاعات شرکت</Typography>
            <IconButton onClick={handleClose}>
              ✕
            </IconButton>
          </Box>

          {/* فرم ویرایش */}
          <CompanyEditInfo props={props} />
        </Box>
      </Modal>
    </>
  );
};

export default CompanyEditModal;
