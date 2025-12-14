"use client";

import React from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toast } from "react-toastify";
import { resetUser } from "@/lib/features/user/userSlice";
import { useRouter } from "next/navigation";
import DeleteModal from "@/Components/common/delete-modal";
import { DISABLE_ACCOUNT } from "@/lib/urls";

export const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width:
    typeof window !== "undefined" && window.innerWidth <= 460 ? "100%" : 600,
  height:
    typeof window !== "undefined" && window.innerWidth <= 460
      ? "100%"
      : "unset",
  bgcolor: "#FDFDFD",
  border: "1px solid #E0E0E0",
  p: 4,
};

interface DeleteAccountProps {
  show: boolean;
  onClose: () => void;
}

const DeleteAccount = ({ show, onClose }: DeleteAccountProps) => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.post(DISABLE_ACCOUNT);
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(resetUser());
        onClose();
        router.push("/");
      } else {
        toast.warning(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting user account:", error);
      toast.warning("متاسفانه خطایی رخ داده است");
    }
  };

  return (
    <div style={{ width: "100%", height: "60vh" }}>
      <DeleteModal
        show={show}
        text="با این کار حساب شما غیر فعال شده و اطلاعات شما تا زمان درخواست
              بازگردانی توسط شما، نگهداری می‌شوند"
        title="آیا از غیر فعال ‌سازی حساب کاربری خود اطمینان دارید؟"
        onSubmit={handleSaveChanges}
        onClose={onClose}
        submitText="غیرفعالسازی"
      />
    </div>
  );
};

export default DeleteAccount;
