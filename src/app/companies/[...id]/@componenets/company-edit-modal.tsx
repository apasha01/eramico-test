"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal, Box, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CompanyEditInfo from "./company-info";

const CompanyEditModal = ({ props }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Button
        sx={{ fontSize: { xs: "12px", md: "14px" },marginRight:{xs:'0' , md:'16px'} }}
        variant="text"
        color="primary"
        startIcon={<EditIcon style={{ color: "orange" , fontSize:'18px'}} />}
        onClick={handleOpen}
        style={{
        color: "orange",
        }}
      >
        ویرایش
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute" as const,
            direction: "ltr",
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">ویرایش اطلاعات شرکت</Typography>
            <IconButton onClick={handleClose}>✕</IconButton>
          </Box>
          <CompanyEditInfo props={props} />
        </Box>
      </Modal>
    </>
  );
};

export default CompanyEditModal;
