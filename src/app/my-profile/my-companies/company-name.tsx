"use client";

import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
} from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import styles from "./styles.module.css";
import BackButton from "@/Components/common/back-button";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { toast } from "react-toastify";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { axiosInstance } from "@/Helpers/axiosInstance";
import LoaderComponent from "@/Components/LoaderComponent";
import { RxDotFilled } from "react-icons/rx";
import {
  FOLLOW_COMPANY,
  UNFOLLOW_COMPANY,
  COMPANY_DETAILS,
  SAVE_COMPANY,
} from "@/lib/urls";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import Link from "next/link";
import ActivityContext from "@/app/my-profile/dashboard/@componenets/setCompanyComponents/activity-context";
import CompanyEditModal from "./company-edit-modal";
import TheAvatar from "@/Components/common/the-avatar";

interface Follow_res extends IAPIResult<any> {}

interface CompanyNameProps {
  id: string;
  title: string;
  isFollowed: boolean;
  isVerified: boolean;
  membershipPeriod: string;
  followerCount: number;
  avatar: string | null;
  code: string | null;
  setSelectedView: (view: number) => void;
  isMine?: boolean;
  company?: any;
  isSafe?: boolean;
  subscriptionAvatar?: string | null;
}

type BaseInfo = {
  title?: string;
  code?: string | null;
  address?: string | null;
  telephone?: string | null;
  fax?: string | null;
  ceoName?: string | null;
  ceoPhone?: string | null;
  webpage?: string | null;
  shortIntroduction?: string | null;
  zipCode?: string | null;
  city?: string | null;
  province?: string | null;
  economyCode?: string | null;
  registrationCode?: string | null;
  nationalCode?: string | null;
};

const CompanyName = ({
  id,
  title,
  isFollowed,
  isVerified,
  membershipPeriod = "",
  followerCount = 0,
  avatar,
  code,
  setSelectedView,
  isMine = false,
  company,
  isSafe = false,
  subscriptionAvatar = null,
}: CompanyNameProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { checkAuth } = useAuthCheck();

  // فقط برای ادیت؛ هیچ استایل/لایه‌ای عوض نمی‌شود
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BaseInfo>({});
  const [localTitle, setLocalTitle] = useState<string>(title);
  const [selectedValue, setSelectedValue] = useState<number[]>([]); // زمینه فعالیت

  // props → state
  useEffect(() => setIsSubscribed(isFollowed), [isFollowed]);
  useEffect(() => setLocalTitle(title), [title]);

  const handleSubmit = async () => {
    try {
      if (!checkAuth()) return;
      const url = isSubscribed
        ? `${UNFOLLOW_COMPANY}/${id}`
        : `${FOLLOW_COMPANY}?id=${id}`;
      const response = await axiosInstance.post<Follow_res>(url);
      if (response?.data?.success) {
        toast.success(response.data.message);
        setIsSubscribed(!isSubscribed);
      } else {
        toast.warning(response?.data?.message || "متاسفانه خطایی رخ داده است");
      }
    } catch {
      toast.warning("متاسفانه خطایی رخ داده است");
    }
  };

  const handleEditOpen = async () => {
    try {
      setOpenEdit(true);
      // پرکردن فرم از API تا props جدید لازم نشه
      const url = Number.isInteger(Number(id))
        ? `${COMPANY_DETAILS}/${id}`
        : `Company/get?code=${id}`;
      const res = await axiosInstance.get<IAPIResult<any>>(url);
      if (res?.data?.success) {
        const c = res.data.data;

        // فیلدهای اصلی
        setForm({
          title: c?.title ?? "",
          code: c?.code ?? "",
          address: c?.address ?? "",
          telephone: c?.telephone ?? "",
          fax: c?.fax ?? "",
          ceoName: c?.ceoName ?? "",
          ceoPhone: c?.ceoPhone ?? "",
          webpage: c?.webpage ?? "",
          shortIntroduction: c?.shortIntroduction ?? "",
          zipCode: c?.zipCode ?? "",
          city: c?.city ?? "",
          province: c?.province ?? "",
          economyCode: c?.economyCode ?? "",
          registrationCode: c?.registrationCode ?? "",
          nationalCode: c?.nationalCode ?? "",
        });

        // انتخاب خودکار زمینه‌های فعالیت
        // اولویت با categoryIds؛ در غیر این صورت از categories[].id
        const fromIds: number[] = Array.isArray(c?.categoryIds)
          ? c.categoryIds
          : Array.isArray(c?.categories)
          ? c.categories.map((x: any) => x?.id)
          : [];

        const cleaned = (fromIds || [])
          .map((n: any) => Number(n))
          .filter((n) => Number.isFinite(n));

        setSelectedValue(cleaned);
      } else {
        toast.warning(res?.data?.message || "خطا در دریافت اطلاعات شرکت");
      }
    } catch {
      toast.error("دریافت اطلاعات شرکت ناموفق بود");
    }
  };

  const handleEditClose = () => setOpenEdit(false);

  const handleChange =
    (key: keyof BaseInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSave = async () => {
    if (!form.title || !String(form.title).trim()) {
      toast.warning("عنوان شرکت الزامی است.");
      return;
    }
    try {
      setSaving(true);

      const payload = new FormData();
      payload.append("Id", id?.toString() || "");
      payload.append("Title", form.title || "");
      payload.append("Address", form.address || "");
      payload.append("Telephone", form.telephone || "");
      payload.append("CEOPhone", form.ceoPhone || "");
      payload.append("Code", form.code || "");
      payload.append("ShortIntroduction", form.shortIntroduction || "");

      // زمینه‌های فعالیت
      selectedValue.forEach((cid) => {
        payload.append("CategoryIds[]", String(cid));
      });

      const res = await axiosInstance.post<IAPIResult<any>>(
        SAVE_COMPANY,
        payload
      );

      if (res?.data?.success) {
        toast.success(res.data.message || "اطلاعات با موفقیت ذخیره شد.");
        if (form.title) setLocalTitle(form.title);
        setOpenEdit(false);
      } else {
        toast.warning(res?.data?.message || "ذخیره اطلاعات ناموفق بود.");
      }
    } catch {
      toast.error("در ذخیره اطلاعات خطایی رخ داد.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Suspense fallback={<LoaderComponent />}>
      <div className={styles.headerStyle}>
        <div className="headerBackRowStyle">
          {!isMine && (
            <>
              <Button
                className={
                  isSubscribed ? "followButtonStyle" : "wantToFollowButtonStyle"
                }
                variant="outlined"
                type="button"
                onClick={handleSubmit}
                endIcon={
                  !isSubscribed ? (
                    <FiPlus size={13} color="white" />
                  ) : (
                    <FaCheck
                      size={13}
                      style={{ color: "#616161" }}
                      color="#616161"
                    />
                  )
                }
              >
                {!isSubscribed ? "دنبال کردن" : " دنبال شده"}
              </Button>

              <Button
                className="websiteButtonStyle"
                variant="outlined"
                href={`/my-profile/messages?c=${id}`}
                type="button"
                component={Link}
                onClick={(e) => {
                  if (!checkAuth("برای ارسال پیام ابتدا وارد شوید"))
                    e.preventDefault();
                }}
              >
                ارسال پیام
              </Button>
            </>
          )}
        </div>

        <div className="headerTitleBoxStyle">
          <div className="headerBackRowStyle" dir="rtl">
            <BackButton />
            <TheAvatar
              variant="rounded"
              width={72}
              height={72}
              src={avatar}
              name={localTitle}
              isVerified={isVerified}
              isSafe={isSafe}
              subscriptionAvatar={subscriptionAvatar}
            />
            <div className="mx-2">
              <div className="row mx-0 col-12">
                <div className="px-0 d-flex align-items-center gap-1">
                  <Typography className="fs-26 fw-500">{localTitle}</Typography>
                  {isMine && (
                    <CompanyEditModal props={company} />
                    // <IconButton
                    //   aria-label="ویرایش اطلاعات پایه"
                    //   size="small"
                    //   onClick={handleEditOpen}
                    //   title="ویرایش اطلاعات شرکت"
                    //   sx={{
                    //     mr: 0.5,
                    //     backgroundColor: "orange",
                    //     color: "white",
                    //     "&:hover": { backgroundColor: "#e69500" },
                    //   }}
                    // >
                    //   <EditOutlinedIcon fontSize="small" />
                    // </IconButton>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2 mx-0 col-12 fs-13 mt-1  align-items-center">
                {code && (
                  <>
                    <span className="mt-1"> @{code} </span>
                    <RxDotFilled className="mt-2" />
                  </>
                )}
                {membershipPeriod && (
                  <>
                    <span className="mt-1"> {membershipPeriod} </span>
                    <RxDotFilled className="mt-2" />
                  </>
                )}
                <div className="d-flex" onClick={() => setSelectedView(5)}>
                  <span className="mt-1 ms-1" style={{ color: "#fb8c00" }}>
                    {followerCount}
                  </span>
                  <Typography className="fs-13 fw-500 greyColor2 mt-1">
                    نفر دنبال کننده
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* دیالوگ ویرایش */}
      <Dialog
        open={openEdit}
        onClose={saving ? undefined : handleEditClose}
        fullWidth
        maxWidth="md"
        dir="rtl"
      >
        <DialogTitle>ویرایش اطلاعات پایه شرکت</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={12} md={6}>
              <TextField
                placeholder="عنوان شرکت *"
                value={form.title ?? ""}
                onChange={handleChange("title")}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                placeholder="آدرس"
                value={form.address ?? ""}
                onChange={handleChange("address")}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                placeholder="تلفن"
                value={form.telephone ?? ""}
                onChange={handleChange("telephone")}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                placeholder="تلفن مدیرعامل"
                value={form.ceoPhone ?? ""}
                onChange={handleChange("ceoPhone")}
                fullWidth
                inputProps={{ dir: "rtl", style: { textAlign: "right" } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                placeholder="معرفی کوتاه"
                value={form.shortIntroduction ?? ""}
                onChange={handleChange("shortIntroduction")}
                fullWidth
                multiline
                minRows={3}
              />
            </Grid>
          </Grid>

          <ActivityContext
            selectedValues={selectedValue}
            setSelectedValues={setSelectedValue}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-start" }}>
          <Button onClick={handleEditClose} disabled={saving} variant="text">
            انصراف
          </Button>
          <Button onClick={handleSave} disabled={saving} variant="contained">
            {saving ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </DialogActions>
      </Dialog>
    </Suspense>
  );
};

export default CompanyName;
