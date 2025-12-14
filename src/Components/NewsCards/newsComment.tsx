"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { Button, TextField, Typography } from "@mui/material";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { toast } from "react-toastify";
import { useAuthCheck } from "@/Hooks/useAuthCheck";

interface Comment_res extends IAPIResult<any> {}

interface NewsCommentProps {
  entityId?: string;
  commentCount: number | string;
}

export default function NewsComment(props: NewsCommentProps) {
  const [formData, setFormData] = useState({
    SenderFullName: "",
    SenderEmail: "",
    SenderURL: "",
    Body: "",
    loading: false,
    error: {
      SenderFullName: false,
      SenderEmail: false,
      Body: false,
    },
  });
  const { checkAuth } = useAuthCheck();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!checkAuth("برای ارسال نظر باید وارد شوید")) {
        return;
      }

      const { SenderFullName, SenderEmail, Body } = formData;

      if (!Body) {
        toast.warning("لطفاً تمامی فیلدهای لازم را پر کنید");
        setFormData({
          ...formData,
          error: {
            SenderFullName: !SenderFullName,
            SenderEmail: !SenderEmail,
            Body: !Body,
          },
        });
        return;
      }
      setFormData({ ...formData, loading: true });
      const response = await axiosInstance.post<Comment_res>(
        `Comment/add-content?entityId=${props.entityId}&Body=${formData.Body}`
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        window.location.reload();
        setFormData({
          SenderFullName: "",
          SenderEmail: "",
          SenderURL: "",
          Body: "",
          loading: false,
          error: {
            SenderFullName: false,
            SenderEmail: false,
            Body: false,
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
            Body: false,
          },
        });
      }
    } catch (e) {
      setFormData({
        SenderFullName: "",
        SenderEmail: "",
        SenderURL: "",
        Body: "",
        loading: false,
        error: {
          SenderFullName: false,
          SenderEmail: false,
          Body: false,
        },
      });
      toast.warning("متاسفانه خطایی رخ داده است");
    }
  };

  return (
    <div className={styles.commentsLayoutStyle} dir="rtl">
      <Typography variant="body2" className={styles.commentTextStyle}>
        نظرات ({props.commentCount})
      </Typography>
      <TextField
        className="commentTextFiled"
        variant="outlined"
        required
        error={formData.error.Body}
        placeholder=" متن نظر "
        autoComplete="off"
        multiline
        rows={5}
        name="Body"
        value={formData.Body}
        onChange={handleChange}
      />
      <Button
        variant="contained"
        size="small"
        style={{
          height: " 52px",
          borderRadius: "12px",
          width: "160px",
          marginBottom: "32px",
          marginTop: "136px",
          display: "flex",
        }}
        type="submit"
        onClick={() => handleSubmit()}
        disabled={formData.loading}
      >
        ارسال
      </Button>
    </div>
  );
}
