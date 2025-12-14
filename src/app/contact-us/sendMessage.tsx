"use client";

import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import styles from "./styles.module.css";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { toast } from "react-toastify";

interface Message_res extends IAPIResult<any> {}

export default function SendMessage() {
  const [formData, setFormData] = useState({
    SenderFullName: "",
    SenderEmail: "",
    SenderCall: "",
    Context: "",
    loading: false,
    error: {
      SenderFullName: false,
      SenderEmail: false,
      SenderCall: false,
      Context: false,
    },
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { SenderFullName, SenderEmail, SenderCall, Context } = formData;

      if (!SenderFullName || !SenderEmail || !Context || !SenderCall) {
        toast.warning("لطفاً تمامی فیلدهای لازم را پر کنید");
        setFormData({
          ...formData,
          error: {
            SenderFullName: !SenderFullName,
            SenderEmail: !SenderEmail,
            Context: !Context,
            SenderCall: !SenderCall,
          },
        });
        return;
      }

      setFormData({ ...formData, loading: true });
      const response = await axiosInstance.post<Message_res>(
        `Message/save-contactus?SenderFullName=${formData.SenderFullName}&SenderEmail=${formData.SenderEmail}&SenderCall=${formData.SenderCall}&Context=${formData.Context}`
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        setFormData({
          SenderFullName: "",
          SenderEmail: "",
          SenderCall: "",
          Context: "",
          loading: false,
          error: {
            SenderFullName: false,
            SenderEmail: false,
            Context: false,
            SenderCall: false,
          },
        });
      } else {
        toast.warning(response?.data?.message || "متاسفانه خطایی رخ داده است");
        setFormData({
          ...formData,
          loading: false,
          error: {
            SenderFullName: false,
            SenderEmail: false,
            Context: false,
            SenderCall: false,
          },
        });
      }
    } catch (e) {
      setFormData({
        SenderFullName: "",
        SenderEmail: "",
        SenderCall: "",
        Context: "",
        loading: false,
        error: {
          SenderFullName: false,
          SenderEmail: false,
          Context: false,
          SenderCall: false,
        },
      });
      toast.warning("متاسفانه خطایی رخ داده است");
    }
  };
  return (
    <div className={styles.informationDiv}>
      <Typography className="fw-500" style={{ fontSize: "32px" }}>
        فرم درخواست مشاوره
      </Typography>
      <div className={styles.col}>
        <TextField
          className={styles.textField}
          variant="outlined"
          placeholder="نام و نام خانوادگی"
          autoComplete="off"
          name="SenderFullName"
          value={formData.SenderFullName}
          onChange={handleChange}
          error={formData.error.SenderFullName}
        />
        <TextField
          className={styles.textField}
          variant="outlined"
          placeholder=" پست الکترونیکی"
          autoComplete="off"
          name="SenderEmail"
          value={formData.SenderEmail}
          onChange={handleChange}
          error={formData.error.SenderEmail}
        />
        <TextField
          className={styles.textField}
          variant="outlined"
          placeholder=" شماره تماس"
          autoComplete="off"
          name="SenderCall"
          value={formData.SenderCall}
          onChange={handleChange}
          error={formData.error.SenderCall}
        />
        <TextField
          className={styles.textField}
          variant="outlined"
          placeholder="برای چه خدمتی به مشاوره نیاز دارید... "
          autoComplete="off"
          multiline
          rows={4}
          name="Context"
          value={formData.Context}
          onChange={handleChange}
          error={formData.error.Context}
        />
      </div>
      <div className={styles.col} style={{ marginTop: "100px" }}>
        <Button
          variant="contained"
          size="small"
          className={styles.buttonSend}
          type="submit"
          onClick={handleSubmit}
          disabled={formData.loading}
        >
          ارسال
        </Button>
      </div>
    </div>
  );
}
