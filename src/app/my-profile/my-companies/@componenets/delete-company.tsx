"use client";

import React from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { toast } from "react-toastify";
import DeleteModal from "@/Components/common/delete-modal";
import {DISABLE_COMPANY } from "@/lib/urls";

interface DeleteAccountProps {
  show: boolean;
  onClose: () => void;
  companyId: number;
  onReload?: (() => Promise<void>) | null | undefined;
}

const DeleteCompany = ({ show, onClose, companyId, onReload }: DeleteAccountProps) => {

  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.post(`${DISABLE_COMPANY}${companyId}`);
      if (response.data.success) {
        toast.success(response.data.message);
         onReload?.()
        onClose();
      } else {
        toast.warning(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting user account:", error);
      toast.warning("متاسفانه خطایی رخ داده است");
    }
  };

  return (
      <DeleteModal
        show={show}
        text="با این کار شرکت شما غیر فعال شده و این عملیات غیر قابل بازگشت است."
            
        title="آیا از غیر فعال‌سازی حساب شرکت خود اطمینان دارید؟"
        onSubmit={handleSaveChanges}
        onClose={onClose}
        submitText="حذف شرکت"
      />
  );
};

export default DeleteCompany;
