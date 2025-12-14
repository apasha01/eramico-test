"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box,
  Grid,
  Stack,
  LinearProgress,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { toast } from "react-toastify";
import { COMPANY_UPLOAD_MEDIA } from "@/lib/urls";
import Image from "next/image";

type MediaUploaderDialogProps = {
  open: boolean;
  onClose: () => void;
  Id: number;
  onRefresh?: () => void;
};

const MAX_FILES = 6;
const MAX_FILE_SIZE_MB = 8;

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024,
    sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function MediaUploader({
  open,
  onClose,
  Id,
  onRefresh,
}: MediaUploaderDialogProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const remaining = useMemo(() => MAX_FILES - files.length, [files.length]);

  const revokePreviews = () => previews.forEach((u) => URL.revokeObjectURL(u));
  const resetAll = () => {
    revokePreviews();
    setFiles([]);
    setPreviews([]);
    setErrors([]);
    setDescription("");
    setProgress(0);
    setUploading(false);
  };

  const addFiles = (incoming: File[]) => {
    const errs: string[] = [];
    const acc: File[] = [];
    for (const f of incoming) {
      if (!f.type.startsWith("image/")) {
        errs.push(`فایل «${f.name}» تصویر نیست.`);
        continue;
      }
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errs.push(
          `حجم «${f.name}» بیش از ${MAX_FILE_SIZE_MB}MB است (${formatBytes(
            f.size
          )}).`
        );
        continue;
      }
      acc.push(f);
    }

    if (acc.length > remaining) {
      errs.push(
        `حداکثر ${MAX_FILES} تصویر مجاز است. (می‌توانید ${remaining} عدد دیگر اضافه کنید)`
      );
      acc.splice(remaining);
    }

    if (acc.length) {
      setFiles((p) => [...p, ...acc]);
      setPreviews((p) => [...p, ...acc.map((f) => URL.createObjectURL(f))]);
    }
    if (errs.length) setErrors((p) => [...p, ...errs]);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    addFiles(Array.from(list));
    e.currentTarget.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const list = e.dataTransfer.files;
    if (!list) return;
    addFiles(Array.from(list));
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeAt = (idx: number) => {
    const cp = [...files];
    const pp = [...previews];
    const removed = pp.splice(idx, 1)[0];
    if (removed) URL.revokeObjectURL(removed);
    cp.splice(idx, 1);
    setFiles(cp);
    setPreviews(pp);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleUpload = async () => {
    if (!files.length) {
      setErrors((p) => [...p, "لطفاً حداقل یک تصویر انتخاب کنید."]);
      return;
    }

    try {
      setUploading(true);
      setProgress(10);

      const fd = new FormData();
      files.forEach((f) => fd.append("file", f, f.name));

      const res = await axiosInstance.post(`${COMPANY_UPLOAD_MEDIA}${Id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });

      setProgress(100);
      toast.success(res?.data?.message || "تصاویر با موفقیت ارسال شد.");

      handleClose();

      if (onRefresh) onRefresh(); // 🔹 Refresh Media list
    } catch (err: any) {
      console.error(err);
      setUploading(false);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detailedMessage ||
        err?.message ||
        "خطا در ارسال تصویر.";
      setErrors((p) => [...p, msg]);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 6, direction: "ltr" }}>
        <span style={{ marginRight: 20 }}>آپلود رسانه</span>
        <IconButton
          onClick={handleClose}
          aria-label="close"
          sx={{ position: "absolute", left: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField
            placeholder="... توضیحی برای رسانه وارد کنید"
            fullWidth
            multiline
            rows={3}
            dir="rtl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputProps={{ sx: { textAlign: "center" } }}
          />

          <Box
            onDrop={onDrop}
            onDragOver={onDragOver}
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: "background.default",
              "&:hover": { bgcolor: "action.hover" },
              direction: "rtl",
            }}
            onClick={() => inputRef.current?.click()}
          >
            <AddPhotoAlternateIcon fontSize="large" />
            <Typography className="mt-2">
              تصاویر رسانه را بکشید و رها کنید یا کلیک کنید برای انتخاب
            </Typography>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={onInputChange}
            />
          </Box>

          {!!files.length && (
            <Grid container spacing={2}>
              {files.map((file, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Image
                     loading="lazy"
                      src={previews[idx]}
                      alt={file.name}
                      style={{
                        display: "block",
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                      }}
                    />
                    <Box sx={{ p: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={file.name}
                      >
                        {file.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {formatBytes(file.size)}
                      </Typography>
                    </Box>
                    <IconButton
                      aria-label="delete"
                      onClick={() => removeAt(idx)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: "background.paper",
                        "&:hover": { bgcolor: "background.default" },
                        boxShadow: 1,
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          {!!errors.length && (
            <Box
              sx={{
                bgcolor: "error.lighter",
                p: 2,
                borderRadius: 2,
                direction: "rtl",
              }}
            >
              {errors.map((er, i) => (
                <Typography key={i} variant="body2" color="error">
                  • {er}
                </Typography>
              ))}
            </Box>
          )}

          {uploading && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mt: 0.5, textAlign: "center" }}
              >
                {progress}%
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, direction: "rtl" }}>
        <Button onClick={handleClose} disabled={uploading}>
          بستن
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
        >
          آپلود رسانه
        </Button>
      </DialogActions>
    </Dialog>
  );
}
