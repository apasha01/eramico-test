"use client";

import {
  Box,
  Button,
  InputAdornment,
  Modal,
  Radio,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { POSITION_LOOKUP } from "@/lib/urls";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import styles from "./styles.module.css";
import LoaderComponent from "@/Components/LoaderComponent";
import { ImRadioUnchecked } from "react-icons/im";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";

export const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 576,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface EditPositionModalProps {
  id: number; // شناسه‌ی رکورد درخواست/عضویت
  positionId: number | null; // مقدار فعلی سمت انتخاب‌شده
  show: boolean;
  onClose: () => void;
  onUpdated?: (payload: { positionId: number; title: string }) => void; // ✅ callback به والد
  onlySelector?: boolean; // فقط سلکتور نمایش داده شود و ذخیره در سمت پرنت اتفاق بیفتد
}

const EditPositionModal = ({
  id,
  positionId,
  show,
  onClose,
  onUpdated,
  onlySelector = false,
}: EditPositionModalProps) => {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // مقدار انتخاب‌شده: پیش‌فرض از props
  const [selectedValue, setSelectedValue] = useState<number | null>(positionId);
  // عنوان انتخاب‌شده (برای برگرداندن به والد)
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  // هر بار مودال باز/بسته شد یا positionId تغییر کرد، انتخاب را ریست کنیم
  useEffect(() => {
    if (show) {
      setSelectedValue(positionId);
    }
  }, [show, positionId]);

  useEffect(() => {
    if (show) fetchData();
  }, [show]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<any>(POSITION_LOOKUP);
      const list = response?.data?.data || [];
      setData(list);

      // اگر positionId فعلی در لیست هست، عنوانش را ست کن تا بدون کلیک هم مقدار داشته باشیم
      const current = list.find((x: any) => x.id === positionId);
      if (current) setSelectedTitle(current.title || "");
    } catch (error) {
      console.error("Error fetching positions:", error);
      toast.error("خطا در دریافت لیست سمت‌ها");
    } finally {
      setLoading(false);
    }
  };

  // فیلتر لیست با سرچ (بدون حساسیت به حروف)
  const filteredData = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();
    if (!term) return data;
    return data.filter((item: any) =>
      String(item?.title || "")
        .toLowerCase()
        .includes(term)
    );
  }, [data, searchTerm]);

  const onSubmit = async () => {
    if (!selectedValue) {
      toast.warn("لطفاً یک سمت را انتخاب کنید.");
      return;
    }
    if (selectedValue === positionId) {
      toast.info("تغییری ایجاد نشده است.");
      return;
    }

    try {
      setSubmitting(true);
      if (onlySelector) {
        onUpdated?.({
          positionId: selectedValue,
          title: selectedTitle,
        });
        onClose();
        return;
      }
      const formData = new FormData();
      formData.append("id", String(id));
      formData.append("positionId", String(selectedValue));

      const res = await axiosInstance.post(
        `CompanyUserDemand/edit/${id}`,
        formData
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message || "با موفقیت ذخیره شد.");
        onUpdated?.({
          positionId: selectedValue,
          title: selectedTitle,
        });
        onClose();
      } else {
        toast.error(res?.data?.message || "خطا در ثبت تغییرات");
      }
    } catch (error: any) {
      console.error("Error updating position:", error);
      toast.error(
        error?.response?.data?.message ||
          "خطا در ثبت تغییرات. دوباره تلاش کنید."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="edit-position-modal-title"
      dir="rtl"
      className="modal-box"
    >
      <Box className="rounded-4" sx={modalStyle} dir="rtl">
        <CloseIcon
          style={{ color: "#757575", cursor: "pointer", float: "right" }}
          onClick={onClose}
        />
        <div className="d-flex justify-content-center">
          <h3 className="fs-18 fw-bolder px-2">ویرایش سمت</h3>
        </div>
        <span className="text-center w-100 d-block">
          سمت مورد نظر را انتخاب کنید
        </span>

        <div className="w-100 pt-3">
          <TextField
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-12 w-full fs-16 fw-500 mt-2 border rounded-4 customStyleTextField"
            placeholder="سمت مورد نظر را جستجو کنید"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CiSearch size={22} />
                </InputAdornment>
              ),
              style: { textAlignLast: "right" },
            }}
            fullWidth
          />
        </div>

        {loading ? (
          <LoaderComponent />
        ) : filteredData.length !== 0 ? (
          <>
            <div
              className="pt-5 grid gap-2"
              style={{
                gridTemplateColumns: "repeat(2, 1fr)",
                height: "200px",
                overflowY: "auto",
              }}
            >
              {filteredData.map((val: any) => (
                <div key={val.id}>
                  <Button
                    variant="outlined"
                    className={`border-0 ${
                      selectedValue === val.id
                        ? styles.followActivityButtonActive
                        : styles.followActivityButton
                    }`}
                    sx={{
                      transition: "background 200ms",
                      marginInline: "0px",
                      padding: "0px",
                      position: "relative",
                      textAlign: "right",
                      justifyContent: "right",
                      gap: "5px",
                      color: "#212121",
                    }}
                    onClick={() => {
                      setSelectedValue(val.id);
                      setSelectedTitle(val.title); // ✅ عنوان را از val.title ست می‌کنیم
                    }}
                    startIcon={
                      <Radio
                        checked={selectedValue === val.id}
                        checkedIcon={
                          <RadioButtonCheckedIcon
                            style={{ color: "#FB8C00" }}
                          />
                        }
                        style={{ color: "#E0E0E0" }}
                        icon={
                          <ImRadioUnchecked
                            size={24}
                            style={{ border: "1px solid #E0E0E0" }}
                            className="text-white rounded-5"
                          />
                        }
                      />
                    }
                  >
                    {val.title}
                  </Button>
                </div>
              ))}
            </div>
            <span className="w-100 text-center d-block pt-3 fw-bold fs-20">
              ...
            </span>
          </>
        ) : (
          <span className="w-100 text-center d-block pt-3">
            موردی یافت نشد.
          </span>
        )}

        <div className="pt-3 d-flex gap-4">
          <Button
            variant="contained"
            style={{ background: "#FB8C00", paddingInline: "24px" }}
            onClick={onSubmit}
            className="w-100"
            disabled={submitting}
          >
            {submitting ? "در حال ثبت..." : "ثبت تغییرات"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default EditPositionModal;
