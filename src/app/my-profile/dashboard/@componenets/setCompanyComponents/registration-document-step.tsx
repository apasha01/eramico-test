"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { COMPANY_UPLOAD_DOCUMENT } from "@/lib/urls";
import CompanyDocumentCard from "../company-document-card";

interface RegistrationDocumentStepProps {
  companyId: number | null;
  onDocumentsSubmit?: () => void;
}

export default function RegistrationDocumentStep({
  companyId,
  onDocumentsSubmit,
}: RegistrationDocumentStepProps) {
  const [articles, setArticles] = useState<File | null>(null);
  const [vat, setVat] = useState<File | null>(null);
  const [newspaper, setNewspaper] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const DOCS = [
    {
      label: "اساسنامه شرکت",
      state: articles,
      set: setArticles,
      key: "articles",
    },
    { label: "گواهی ارزش افزوده", state: vat, set: setVat, key: "vat" },
    {
      label: "روزنامه رسمی",
      state: newspaper,
      set: setNewspaper,
      key: "newspaper",
    },
  ];

  const handleSubmitDocuments = async () => {
    if (!companyId) return toast.error("شناسه شرکت یافت نشد.");

    if (!articles || !vat || !newspaper)
      return toast.error("لطفاً هر سه فایل را انتخاب کنید.");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("articles", articles);
      formData.append("vat", vat);
      formData.append("newspaper", newspaper);

      formData.append("articles_fileName", articles.name);
      formData.append("vat_fileName", vat.name);
      formData.append("newspaper_fileName", newspaper.name);

      const response = await axiosInstance.post(
        `${COMPANY_UPLOAD_DOCUMENT}/${companyId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const resp = response?.data;

      const success = resp?.success === true;

      const message =
        resp?.data?.message ||
        "فایل‌ها با موفقیت ارسال شدند.";

      if (success) {
        toast.success(String(message));

        setArticles(null);
        setVat(null);
        setNewspaper(null);

        onDocumentsSubmit?.();
      } else {
        toast.error(String(message));
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "خطا در ارسال مدارک";

      toast.error(String(msg).replace(/<br\s*\/?>/g, "\n"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" mb={2}>
        مدارک هویتی شرکت
      </Typography>

      <Box
        display="flex"
        gap={2}
        flexDirection={{ xs: "column", md: "row" }}
        mb={2}
      >
        {DOCS.map((doc) => (
          <CompanyDocumentCard
            key={doc.key}
            label={doc.label}
            file={doc.state}
            onChange={doc.set}
          />
        ))}
      </Box>

      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          disabled={loading}
          onClick={handleSubmitDocuments}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "ارسال مدارک"
          )}
        </Button>
      </Box>
    </Paper>
  );
}
