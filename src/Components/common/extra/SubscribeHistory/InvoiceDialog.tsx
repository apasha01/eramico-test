"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";

interface Props {
  open: boolean;
  onClose: () => void;
  subscriptionId: number | null;
}

interface DocumentItem {
  id: number;
  mediaTitle: string;
  note: string | null;
  mediaSourceFileName: string;
  createdDatePersian: string;
}

export default function InvoiceDialog({ open, onClose, subscriptionId }: Props) {
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!open || !subscriptionId) return;

    setLoading(true);
    setDocs([]);
    axiosInstance
      .get(`/Subscription/subscription-documents/${subscriptionId}`)
      .then((res) => {
        setDocs(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Error fetching docs", err);
      })
      .finally(() => setLoading(false));
  }, [open, subscriptionId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth dir="rtl">
      <DialogTitle className="d-flex justify-content-between align-items-center">
        <Typography className="fs-18 fw-500">مشاهده فاکتور</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 2 }).map((_, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={200}
                  sx={{ borderRadius: 2, mt: 1 }}
                />
                <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
              </Grid>
            ))}
          </Grid>
        ) : docs.length === 0 ? (
          <Typography>هیچ مدرکی ثبت نشده است.</Typography>
        ) : (
          <Grid container spacing={2}>
            {docs.map((doc) => (
              <Grid item xs={12} md={6} key={doc.id}>
                <Typography className="fs-14 fw-500 mb-1">{doc.mediaTitle}</Typography>

                <div style={{ position: "relative", width: "100%", height: "200px" }}>
                  {!imageLoaded[doc.id] && (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                      sx={{ borderRadius: 2, position: "absolute", top: 0, left: 0 }}
                    />
                  )}
                  <Image
                    src={doc.mediaSourceFileName}
                    alt={doc.mediaTitle}

                    fill
                    style={{
                      objectFit: "contain",
                      borderRadius: "8px",
                      backgroundColor: "#f8f8f8",
                    }}
                    onLoad={() =>
                      setImageLoaded((prev) => ({ ...prev, [doc.id]: true }))
                    }
                  />
                </div>

                {doc.note && (
                  <Typography className="fs-12 mt-1 text-muted">{doc.note}</Typography>
                )}
                <Typography className="fs-12 mt-1 labelColor">
                  تاریخ: {doc.createdDatePersian}
                </Typography>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}
