"use client";

import React, { useState } from "react";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { BiUser } from "react-icons/bi";
import { useAppSelector } from "@/lib/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordForm,
  changePasswordFormSchema,
} from "@/Helpers/schemas/change-password";
import { toast } from "react-toastify";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { CHANGE_PASSWORD } from "@/lib/urls";
import TextInput from "@/Components/common/text-input";

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

const ChangePassword = () => {
  const user = useAppSelector((state) => state.user);

  const defaultValues = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: any) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value);
    });

    try {
      const response = await axiosInstance.post(CHANGE_PASSWORD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.warning(response.data.message);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const { data } = error.response;

        if (data?.data?.length) {
          data.data.forEach((errorObj: { key: string; error: string }) => {
            toast.warning(errorObj.error);
          });
        } else {
          toast.error(data?.message || "خطای ناشناخته.");
        }
      } else {
        toast.error("خطای سرور. لطفاً دوباره تلاش کنید.");
      }
    }
  };

  return (
    <div dir="rtl">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 change-password row"
      >
        <div className="col-12">
          <TextInput
            name="oldPassword"
            control={form.control}
            placeholder="کلمه عبور قدیم"
            type="password"
            hasError={!!form.formState.errors.oldPassword}
          />
        </div>
        <div className="col-12 col-lg-6">
          <TextInput
            name="newPassword"
            control={form.control}
            placeholder="کلمه عبور جدید"
            type="password"
            hasError={!!form.formState.errors.newPassword}
          />
        </div>
        <div className="col-12 col-lg-6">
          <TextInput
            name="confirmNewPassword"
            control={form.control}
            placeholder="تکرار کلمه عبور جدید"
            type="password"
            hasError={!!form.formState.errors.confirmNewPassword}
          />
        </div>
        <div className="col-12 mt-4">
          <Button
            variant="contained"
            className="col-12 mt-3"
            size="large"
            type="submit"
          >
            تغییر رمز عبور
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
