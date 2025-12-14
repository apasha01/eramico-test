"use client";

import { axiosInstance } from "@/Helpers/axiosInstance";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { ADD_COMMENT } from "@/lib/urls";
import { Button, InputLabel, TextField } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

interface ReplyToPostProps {
  name?: string;
  entityId: number;
  entityTypeId?: number;
  reloadComments: () => void;
  username?: string;
}

const ReplyToPost = ({
  name,
  username,
  entityId,
  entityTypeId,
  reloadComments,
}: ReplyToPostProps) => {
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
    <div>
      <InputLabel
        className="fs-16 mb-1 fw-400 d-flex justify-content-start rtl"
        style={{ color: "#9E9E9E99", paddingRight: "14px" }}
      >
        پاسخ به
        <span className="me-2 d-flex">
          <span className="ms-2" style={{ color: "#0068FF" }}>
            {name}
          </span>
          {username && <span style={{ color: "#0068FF" }}>{username}@ </span>}
        </span>
      </InputLabel>
      <TextField
        fullWidth
        className="border-0 reply-comment"
        value={comment}
        placeholder="پاسخ خود را ارسال کنید"
        variant="outlined"
        onChange={(e) => setComment(e.target.value)}
      />
      <Button variant="contained" className="mt-3" onClick={handleSubmit}>
        ارسال
      </Button>
    </div>
  );
};

export default ReplyToPost;
