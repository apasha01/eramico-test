"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Description, Delete, UploadFile } from "@mui/icons-material";
import { toast } from "react-toastify";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { COMPANY_DOCUMENT_LIST, COMPANY_REMOVE_DOCUMENT } from "@/lib/urls";
import { getCleanFileName } from "@/Helpers/getCleanFileName";

interface CompanyDocumentProps {
  id: number;
  isMine?: boolean;
}

const LABELS: Record<string, string> = {
  articles: "اساس‌نامه شرکت",
  vat: "گواهی ارزش افزوده",
  newspaper: "روزنامه رسمی",
};

export default function CompanyDocument({
  id,
  isMine = true,
}: CompanyDocumentProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<
    Record<string, File | null>
  >({
    articles: null,
    vat: null,
    newspaper: null,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const normalizeDocsFromResponse = (resData: any) => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData.data)) return resData.data;
    if (resData.data && Array.isArray(resData.data.data))
      return resData.data.data;
    return [];
  };

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`${COMPANY_DOCUMENT_LIST}/${id}`);
      const payload = res?.data ?? res;
      const docs = normalizeDocsFromResponse(payload);
      setDocuments(docs);
    } catch (err) {
      console.error("fetchDocuments err", err);
      toast.error("خطا در دریافت مدارک");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchDocuments();
  }, [id, fetchDocuments]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleRemove = async (docId: number, key: string) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `${COMPANY_REMOVE_DOCUMENT}/${docId}`
      );
      toast.success(res.data.message || "فایل حذف شد.");
      setDocuments((prev) => prev.filter((file) => file.id !== docId));
      setSelectedFiles((prev) => ({ ...prev, [key]: null }));
    } catch (err) {
      console.error(err);
      toast.error("خطا در حذف فایل");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const documentKeys = ["articles", "vat", "newspaper"] as const;
    let totalFilesToUpload = 0;
    let successfulUploads = 0;
    let hasError = false;

    for (const key of documentKeys) {
      const newFile = selectedFiles[key];

      if (newFile) {
        totalFilesToUpload++;
        const formData = new FormData();
        formData.append(key, newFile);
        const url = `Company/upload-document-type/${id}?documentType=${key}`;
        try {
          const res = await axiosInstance.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const respData = res?.data ?? res;
          if (respData?.success) {
            successfulUploads++;
          } else {
            const msg = String(
              respData?.message ?? `خطا در آپلود ${LABELS[key]}`
            ).replace(/<br\s*\/?>/gi, "\n");
            toast.error(msg);
            hasError = true;
          }
        } catch (err: any) {
          console.error(`Upload error for ${key}`, err);
          const serverMsg =
            err?.response?.data?.message ??
            err?.message ??
            `خطایی در ارسال ${LABELS[key]} رخ داد`;
          toast.error(String(serverMsg).replace(/<br\s*\/?>/gi, "\n"));
          hasError = true;
        }
      }
    }

    if (totalFilesToUpload === 0) {
      toast.info("فایل جدیدی برای آپلود انتخاب نشده است.");
    } else if (successfulUploads > 0) {
      toast.success(
        `عملیات ذخیره ${successfulUploads} مدرک با موفقیت انجام شد.`
      );
      await fetchDocuments();
      setSelectedFiles({ articles: null, vat: null, newspaper: null });
    }

    setSaving(false);
  };

  const canUpload = useMemo(() => {
    return Object.values(selectedFiles).some((file) => file !== null);
  }, [selectedFiles]);

  return (
    <Box display="flex" flexDirection="column" gap={6} margin={10}>
      {loading ? (
        <CircularProgress sx={{ alignSelf: "center" }} />
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {(["articles", "vat", "newspaper"] as const).map((key) => {
            const existingDoc = Array.isArray(documents)
              ? documents.find((doc) =>
                  (doc.mediaTitle ?? doc.media_title)?.startsWith(key)
                )
              : undefined;
            const selectedFile = selectedFiles[key];

            return (
              <Card
                key={key}
                sx={{ width: 260, borderRadius: 2, position: "relative" }}
              >
                {existingDoc && isMine && (
                  <Tooltip title="حذف فایل">
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
                      onClick={() => handleRemove(existingDoc.id, key)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  {existingDoc ? (
                    <>
                      <Description sx={{ fontSize: 40, color: "#1976d2" }} />
                      <Typography fontWeight={600} marginY={1}>
                        {LABELS[key]}
                      </Typography>
                      <Typography
                        fontSize={13}
                        color="text.secondary"
                        marginY={1}
                        noWrap
                      >
                        {getCleanFileName(existingDoc.mediaSourceFileName)}
                      </Typography>
                      <Button
                        href={existingDoc.mediaSourceFileName}
                        target="_blank"
                        size="small"
                        variant="outlined"
                        sx={{ mt: 1 }}
                      >
                        مشاهده فایل
                      </Button>
                    </>
                  ) : selectedFile ? (
                    <>
                      <UploadFile sx={{ fontSize: 40, color: "#ffa000" }} />
                      <Typography fontWeight={600}>{LABELS[key]}</Typography>
                      <Typography fontSize={13} color="text.secondary" noWrap>
                        {selectedFile.name}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Description sx={{ fontSize: 40, color: "#9e9e9e" }} />
                      <Typography fontWeight={600}>{LABELS[key]}</Typography>
                      <Typography fontSize={13} color="text.disabled">
                        فایلی انتخاب نشده است
                      </Typography>
                    </>
                  )}
                </CardContent>

                {isMine && !existingDoc && (
                  <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadFile />}
                    >
                      انتخاب فایل
                      <input
                        hidden
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, key)}
                      />
                    </Button>
                  </CardActions>
                )}
              </Card>
            );
          })}
        </Box>
      )}

      {isMine && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!canUpload || saving}
          >
            {saving ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "ذخیره مدارک"
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
}
