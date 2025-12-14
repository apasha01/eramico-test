"use client";

import { axiosInstance } from "@/Helpers/axiosInstance";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { ADD_COMMENT } from "@/lib/urls";
import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

interface ReplyToContentProps {
  entityId: number;
  commentCount: number;
  entityTypeId?: number;
  reloadComments: () => void;
}

const ReplyToContent = ({
  commentCount,
  entityId,
  entityTypeId,
  reloadComments,
}: ReplyToContentProps) => {
  const [comment, setComment] = useState("");
  const { checkAuth } = useAuthCheck();

  const handleSubmit = async () => {
    if (!checkAuth("برای پاسخ دادن باید وارد شوید")) {
      return;
    }

    const formData = new FormData();
    formData.append("entityId", entityId.toString());
    formData.append("EntityTypeId", entityTypeId?.toString() || "");
    formData.append("Body", comment);

    if (!comment.trim()) return;
    try {
      const response = await axiosInstance.post(ADD_COMMENT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setComment("");
        reloadComments();
      } else {
        toast.error(
          response?.data?.message || "خطایی رخ داده است. لطفا دوباره تلاش کنید"
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="commentsLayoutStyle" dir="rtl">
      <Typography variant="body2" className="commentTextStyle">
        نظرات ({commentCount})
      </Typography>
      <TextField
        className="commentTextFiled"
        variant="outlined"
        required
        placeholder=" متن نظر "
        autoComplete="off"
        multiline
        rows={5}
        name="Body"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
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
        onClick={handleSubmit}
      >
        ارسال
      </Button>
    </div>
  );
};

export default ReplyToContent;
