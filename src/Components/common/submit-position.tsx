import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import styles from "./styles.module.css"
import { FaSpinner } from "react-icons/fa";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { toast } from "react-toastify";
type Position = {
  id: number;
  title: string;
};

export default function PositionSelectorModal({CompanyId}:{CompanyId:number}) {
  const [open, setOpen] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "info" });
    const { checkAuth } = useAuthCheck();
  
  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await axios.get(
          "https://api.eranico.com/api/Position/lookup",
           { withCredentials: true }
        );
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        if (mounted) setPositions(data);
      } catch (err: any) {
        console.error(err);
        if (mounted)
          setFetchError(
            err?.message || "خطا در واکشی لیست سمت‌ها. دوباره تلاش کنید."
          );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open]);

  const handleOpen = () => {
    if(!checkAuth("برای عضویت اول باید وارد شوید",true)) return;
    
    setOpen(true)
  
  };
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (selectedId == null) {
      setSnackbar({ open: true, message: "یک گزینه را انتخاب کنید.", severity: "error" });
      return;
    }
    setSubmitting(true);

    const formData = new FormData()

    formData.append("CompanyId",String(CompanyId))
    formData.append("PositionId",String(selectedId))

    try {
      // const body = { PositionId: selectedId,CompanyId:CompanyId }; 
      const res = await axiosInstance.post(
       "CompanyUserDemand/request",
        formData,
      );
      if(res.data.success){
        toast.success(res.data.message)
      }else{
        toast.error(res.data.message)
      }
      // setSnackbar({ open: true, message: "درخواست با موفقیت ارسال شد.", severity: "success" });
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error( err.data.response.message || "خطا در ارسال درخواست")
      // setSnackbar({ open: true, message: err?.message || "خطا در ارسال درخواست.", severity: "error" });
    } finally {
      setSubmitting(false);

    }
  };

  return (
    <>
      <Button variant="contained"
        onClick={handleOpen}
        size="medium"
        id="submit-new-advertise"
        sx={{fontSize:{xs:'12px' , sm:'14px'}}}
        style={{
          height: "42px",
          borderRadius: "100px",
          color: "#fff",
          background: "#0d47a1",
          width: "auto",
        }}
      >
      عضویت در شرکت
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" dir="ltr">
        <DialogTitle>انتخاب سمت</DialogTitle>
        <DialogContent dividers className="ltr">

          {loading ? (
            <Box display="flex" alignItems="center" justifyContent="center" p={3}>
             <FaSpinner className={styles.spinnerIcon} />
            </Box>
          ) : fetchError ? (
            <Box p={2}>
              <Typography color="error">{fetchError}</Typography>
            </Box>
          ) : positions.length === 0 ? (
            <Box p={2}>
              <Typography>هیچ سمت ثبت‌شده‌ای پیدا نشد.</Typography>
            </Box>
          ) : (
            <RadioGroup
              value={selectedId?.toString() ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              dir="rtl"
            >
              {positions.map((p) => (
                <FormControlLabel
                  key={p.id}
                  value={p.id.toString()}
                  control={<Radio />}
                  label={p.title}
                />
              ))}
            </RadioGroup>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>
            انصراف
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || loading || positions.length === 0}
          >
            {submitting ? <FaSpinner /> : "ارسال"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
