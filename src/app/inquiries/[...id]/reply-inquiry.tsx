"use client";

import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import Link from "next/link";
import VerifiedIcon from "@mui/icons-material/Verified";
import { axiosInstance } from "@/Helpers/axiosInstance";
import {
  PROPERTY_LOOKUP_MONEY_UNIT,
  REPLY_INQUIRY,
  REPLY_INQUIRY_COMPANIES,
} from "@/lib/urls";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import SelectInput from "@/Components/common/select-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ReplyInquiryForm,
  replyInquiryFormSchema,
} from "@/Helpers/schemas/reply-advertise";
import TextInput from "@/Components/common/text-input";
import SwitchInput from "@/Components/common/switch-input";
import TextWithSelect from "@/Components/common/text-with-select";
import { useAppSelector } from "@/lib/hooks";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";

export const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 576,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface ReplyInquiryProps {
  show: boolean;
  name: string;
  subscriptionAvatar: string;
  verified: boolean;
  link: string;
  onClose: () => void;
  id: number;
  productTitle: string;
  productEngTitle: string;
  productLink: string;
  productId?: number;
}

type OptionItem = {
  id: number;
  title: string;
  isDefault?: boolean;
  isOwner?: boolean;
};

const ReplyInquiry = ({
  show,
  name,
  subscriptionAvatar,
  verified,
  onClose,
  link,
  id,
  productTitle,
  productEngTitle,
  productLink,
  productId,
}: ReplyInquiryProps) => {
  const user = useAppSelector((state) => state.user);
  const { checkAuth } = useAuthCheck();

  // ✅ ساختار options مثل نمونه‌ی دوم
  const [options, setOptions] = useState<{
    PriceUnitPropertyId: { options: OptionItem[]; defaultValue: number | null };
    CompanyId: { options: OptionItem[]; defaultValue: number | null };
  }>({
    PriceUnitPropertyId: { options: [], defaultValue: null },
    CompanyId: { options: [], defaultValue: null },
  });

  const defaultValues: ReplyInquiryForm = {
    days: null as any,
    companyId: 0 as any,
    price: null as any,
    isAgreemental: false,
    unitPropertyId: 0 as any,
  };

  const form = useForm<ReplyInquiryForm>({
    resolver: zodResolver(replyInquiryFormSchema),
    defaultValues,
  });

  const isAgreemental = form.watch("isAgreemental");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const results = await Promise.allSettled([
          axiosInstance.get(PROPERTY_LOOKUP_MONEY_UNIT),
          axiosInstance.get(REPLY_INQUIRY_COMPANIES),
        ]);

        const optionKeys = ["PriceUnitPropertyId", "CompanyId"] as const;

        results.forEach((result, index) => {
          const optionKey = optionKeys[index];

          if (result.status === "fulfilled") {
            const resData = result.value.data;
            const raw: any[] = resData?.success ? resData?.data || [] : [];

            // 🔁 نرمالایز دیتا برای هر کدوم از منابع
            let data: OptionItem[] = [];
            if (optionKey === "CompanyId") {
              // API این یکی ممکنه {companyId, companyTitle, isOwner} بده
              data = raw.map((x: any) => ({
                id: x.id ?? x.companyId,
                title: x.title ?? x.companyTitle,
                isOwner: x.isOwner,
              }));
            } else {
              // واحد پول، معمولاً {id, title, isDefault}
              data = raw.map((x: any) => ({
                id: x.id,
                title: x.title,
                isDefault: x.isDefault,
              }));
            }

            // 🟩 تعیین مقدار پیش‌فرض
            const defaultValue =
              optionKey === "CompanyId"
                ? data.find((i) => i.isOwner)?.id ?? data[0]?.id ?? null
                : data.find((i) => i.isDefault)?.id ?? data[0]?.id ?? null;

            setOptions((prev) => ({
              ...prev,
              [optionKey]: { options: data, defaultValue },
            }));
          } else {
            setOptions((prev) => ({
              ...prev,
              [optionKey]: { options: [], defaultValue: null },
            }));
          }
        });
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions({
          PriceUnitPropertyId: { options: [], defaultValue: null },
          CompanyId: { options: [], defaultValue: null },
        });
      }
    };

    fetchOptions();
  }, []);

  // ✅ ست‌کردن پیش‌فرض‌های async توی فرم
  const unitDefault = options.PriceUnitPropertyId.defaultValue;
  const companyDefault = options.CompanyId.defaultValue;

  useEffect(() => {
    if (unitDefault !== null && unitDefault !== undefined) {
      form.setValue("unitPropertyId", unitDefault as any, { shouldValidate: true });
    }
    if (companyDefault !== null && companyDefault !== undefined) {
      form.setValue("companyId", companyDefault as any, { shouldValidate: true });
    }
  }, [unitDefault, companyDefault, form]);

  const saveReply = async (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value);
    });

    try {
      const response = await axiosInstance.post(REPLY_INQUIRY, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        onClose();
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const onSubmit = (values: any) => {
    // ❌ قبلاً falsyها حذف می‌شدن و 0 هم می‌پرید
    // ✅ الان فقط null/undefined/"" حذف می‌شن
    const cleanObject = Object.fromEntries(
      Object.entries(values).filter(
        ([_, v]) => v !== null && v !== undefined && v !== ""
      )
    );
    saveReply({ ...cleanObject, AdvertiseId: id });
  };

  useEffect(() => {
    checkAuth();
  }, [show, checkAuth]);

  return (
    <Modal open={show} onClose={onClose} aria-labelledby="delete-modal-name" dir="rtl" className="modal-box">
      <Box className="rounded-4" sx={modalStyle} dir="rtl">
        <CloseIcon style={{ color: "#757575", cursor: "pointer", float: "right" }} onClick={onClose} />
        <div className="d-flex justify-content-center">
          <h3 className="fs-18 fw-bolder px-2">پاسخ به استعلام</h3>
        </div>

        <div className="d-flex mt-4 radius-12 p-3 py-4 flex-column" style={{ backgroundColor: "#F5F5F5" }}>
          <Link
            href={productLink}
            onClick={async () => await saveEntityClick(productId, EntityTypeEnum.Product)}
          >
            <div className="d-flex justify-content-start rtl mb-2">
              <Typography className="fw-500 fs-18 p-0 m-0">{productTitle}</Typography>
              {productEngTitle && (
                <Typography variant="body2" className="fw-500 fs-18 p-0 me-2">
                  ({productEngTitle})
                </Typography>
              )}
            </div>
          </Link>
          <div className="d-flex align-items-center gap-1" dir="rtl">
            {subscriptionAvatar && <Image alt="" src={subscriptionAvatar}  loading="lazy" width={20} height={20} />}
            {verified && <VerifiedIcon fontSize="inherit" color="inherit" />}
            <Typography variant="body2" style={{ color: "#757575" }} className="fs-16 fw-500 text-end ms-2">
              خریدار:
            </Typography>
            <Typography variant="body2" className="fs-16 fw-500 text-end ">
              <Link href={link}>{name}</Link>
            </Typography>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
          <Grid container spacing={2}>
            {options.CompanyId.options.length > 0 && (
              <SelectInput
                id="companyId"
                control={form.control}
                options={options.CompanyId.options}
                label="حساب کاربری"
                placeholder="حساب کاربری را انتخاب کنید"
                sm={12}
              />
            )}

            <TextWithSelect
              name="price"
              id="unitPropertyId"
              control={form.control}
              label="قیمت پیشنهادی"
              placeholder="واحد قیمت"
              sm={12}
              disabled={isAgreemental}
              hasError={!!form.formState.errors.price}
              options={options.PriceUnitPropertyId.options}
              // در صورت نیاز، پیش‌فرض کامبو
              defaultSelectValue={options.PriceUnitPropertyId.defaultValue}
            />

            <TextInput
              name="days"
              control={form.control}
              label="مدت اعتبار قیمت پیشنهادی"
              hasError={!!form.formState.errors.days}
              sm={12}
            >
              <span className="position-absolute" style={{ left: "8%", marginTop: "11px" }}>
                روز
              </span>
            </TextInput>

            <SwitchInput name="isAgreemental" control={form.control} label="قیمت توافقی" />

            <Button variant="contained" className="mt-5 w-100" type="submit">
              ثبت پاسخ
            </Button>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ReplyInquiry;
