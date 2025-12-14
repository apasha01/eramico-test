"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { axiosInstance } from "@/Helpers/axiosInstance";

interface SubmitNewInquiryProps {
  productTitle?: string;
  productId?: number;
  onSuccess?: () => void; // ✅ اضافه شد
}

import {
  ADVERTISE_MODE_LOOKUP,
  PRODUCT_GRADE_LOOKUP,
  PRODUCT_TYPE_LOOKUP,
  PROPERTY_LOOKUP_COUNTRY,
  PROPERTY_LOOKUP_DEAL_TYPE,
  PROPERTY_LOOKUP_MONEY_UNIT,
  PROPERTY_LOOKUP_UNIT,
  SUBMIT_INQUIRY_COMPANIES,
} from "@/lib/urls";
import NewInquiryForm from "./new-inquiry-form";
import { useAuthCheck } from "@/Hooks/useAuthCheck";

export const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minHeight: 388,
  bgcolor: "#FDFDFD",
  border: "1px solid #E0E0E0",
  p: 3,
  maxHeight: "80vh",
  overflowY: "scroll",
};

const SubmitNewInquiry = ({
  productId,
  productTitle,
  onSuccess, // ✅ اضافه شد
}: SubmitNewInquiryProps) => {
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState({
    ProductTypeId: [],
    ProducerCountryPropertyId: [],
    DealTypePropertyId: [],
    PackingTypePropertyId: [],
    DeliveryLocationPropertyId: [],
    PriceBasePropertyId: [],
    ProductGradeId: [],
    AmountUnitPropertyId: [],
    PriceUnitPropertyId: [],
    AdvertiseModeId: [],
    CompanyId: [],
  });
  const { checkAuth } = useAuthCheck();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const results = await Promise.allSettled([
          axiosInstance.get(PRODUCT_TYPE_LOOKUP),
          axiosInstance.get(PROPERTY_LOOKUP_COUNTRY),
          axiosInstance.get(PROPERTY_LOOKUP_DEAL_TYPE),
          axiosInstance.get(PRODUCT_GRADE_LOOKUP),
          axiosInstance.get(PROPERTY_LOOKUP_UNIT),
          axiosInstance.get(PROPERTY_LOOKUP_MONEY_UNIT),
          axiosInstance.get(ADVERTISE_MODE_LOOKUP),
          axiosInstance.get(SUBMIT_INQUIRY_COMPANIES),
        ]);

        results.forEach((result, index) => {
          const optionKeys = [
            "ProductTypeId",
            "ProducerCountryPropertyId",
            "DealTypePropertyId",
            "ProductGradeId",
            "AmountUnitPropertyId",
            "PriceUnitPropertyId",
            "AdvertiseModeId",
            "CompanyId",
          ];

          const optionKey = optionKeys[index];

          if (result.status === "fulfilled") {
            setOptions((prev) => ({
              ...prev,
              [optionKey]: result.value.data.success
                ? result.value.data.data
                : [],
            }));
          } else {
            setOptions((prev) => ({
              ...prev,
              [optionKey]: [],
            }));
          }
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleShowModal = () => {
    if (!checkAuth("برای ثبت استعلام باید وارد شوید")) {
      return;
    }

    setShowModal(true);
  };

  return (
    <div>
      <Button
        variant="contained"
        size="small"
        id="submit-new-inquiry"
        style={{ height: "36px", borderRadius: "100px", color: "#fff" }}
        onClick={handleShowModal}
      >
        ثبت استعلام
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
            style={{ color: "#757575", cursor: "pointer", float: "right" }}
            onClick={() => setShowModal(false)}
          />
          <div className="d-flex justify-content-center">
            <div className="fs-18 fw-bolder px-2">ثبت استعلام</div>
          </div>
          <NewInquiryForm
            onModalClose={() => setShowModal(false)}
            options={options}
            productId={productId}
            productTitle={productTitle}
            onSuccess={() => { // ✅ اینجا اضافه شد
              if (typeof onSuccess === "function") onSuccess();
              setShowModal(false);
            }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default SubmitNewInquiry;
