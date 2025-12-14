"use client";

import React, { useState } from "react";
import { Button, Modal, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { modalStyle } from "../inquiries/submit-new-inqiry";
import NewAdvertiseForm from "./new-advertise-form";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { useAdvertiseLookups } from "@/Hooks/useAdvertiseLookups";

interface SubmitNewAdvertiseProps {
  productTitle?: string;
  productId?: number;
}

const SubmitNewAdvertise = ({ productTitle, productId }: SubmitNewAdvertiseProps) => {
  const [showModal, setShowModal] = useState(false);
  const { checkAuth } = useAuthCheck();
  const { options, loading } = useAdvertiseLookups();

  const handleShowModal = () => {
    if (!checkAuth("برای ثبت آگهی باید وارد شوید")) return;
    setShowModal(true);
  };

  return (
    <div>
      <Button
        variant="contained"
        size="small"
        id="submit-new-advertise"
        style={{
          height: "36px",
          borderRadius: "100px",
          color: "#fff",
          background: "#0d47a1",
          width: "100px",
        }}
        onClick={handleShowModal}
        disabled={loading}
      >
        ثبت آگهی
      </Button>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: "scroll" }}
        className="modal-box"
      >
        <Box
          className="rounded-4"
          sx={{ ...modalStyle, width: { xs: "90%", sm: "80%", md: 700 } }}
          dir="rtl"
        >
          <CloseIcon
            style={{ color: "#757575", cursor: "pointer", float: "left" }}
            onClick={() => setShowModal(false)}
          />
          <div className="d-flex justify-content-center">
            <div className="fs-18 fw-bolder px-2">ثبت آگهی</div>
          </div>
          <NewAdvertiseForm
            onModalClose={() => setShowModal(false)}
            options={options}
            productTitle={productTitle}
            productId={productId}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default SubmitNewAdvertise;
