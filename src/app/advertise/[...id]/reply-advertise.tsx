"use client";

import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import VerifiedIcon from "@mui/icons-material/Verified";
import Link from "next/link";
import { axiosInstance } from "@/Helpers/axiosInstance";
import {
  PROPERTY_LOOKUP_UNIT,
  REPLY_ADVERTISE,
  REPLY_ADVERTISE_COMPANIES,
} from "@/lib/urls";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import SelectInput from "@/Components/common/select-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ReplyAdvertiseForm,
  replyAdvertiseFormSchema,
} from "@/Helpers/schemas/reply-advertise";
import TextInput from "@/Components/common/text-input";
import TextWithSelect from "@/Components/common/text-with-select";
import { useAppSelector } from "@/lib/hooks";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { useUserState } from "@/Hooks/useUserState";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { LookupInterface } from "@/Helpers/LookupInterface";
import CompanyStatus from "@/Components/common/company-status";

export const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: 576 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface ReplyAdvertiseProps {
  show: boolean;
  name: string;
  subscriptionAvatar: string;
  isVerified: boolean;
  link: string;
  onClose: () => void;
  id: number;
  productTitle: string;
  productEngTitle: string;
  productLink: string;
  isSafe: boolean;
}

interface MyCompanyLookupInterface {
  id: number;
  userId: number;
  isOwner: boolean;
  title: string;
  code: string;
}

const ReplyAdvertise = ({
  show,
  name,
  subscriptionAvatar,
  isVerified,
  onClose,
  link,
  id,
  productTitle,
  productEngTitle,
  productLink,
  isSafe,
}: ReplyAdvertiseProps) => {
  const { user: currentUser, isUserLoaded, isAuthenticated } = useUserState();
  const { checkAuth } = useAuthCheck();
  const hasShownToast = useRef(false);

  const [options, setOptions] = useState({
    AmountUnitPropertyId: { options: [], defaultValue: null },
    CompanyId: { options: [], defaultValue: null },
  });

  const defaultValues = {
    amount: 0,
    companyId: 0,
    description: "",
    isAgreemental: false,
    unitPropertyId: 0,
  };

  const form = useForm<ReplyAdvertiseForm>({
    resolver: zodResolver(replyAdvertiseFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const results = await Promise.allSettled([
          axiosInstance.get<IAPIResult<MyCompanyLookupInterface[]>>(
            PROPERTY_LOOKUP_UNIT
          ),
          axiosInstance.get<IAPIResult<LookupInterface[]>>(
            REPLY_ADVERTISE_COMPANIES
          ),
        ]);

        const optionKeys = ["AmountUnitPropertyId", "CompanyId"];
        results.forEach((result, index) => {
          const optionKey = optionKeys[index];

          if (result.status === "fulfilled") {
            const data = result.value.data.success
              ? result.value.data.data || []
              : [];
            const defaultValue =
              optionKey == "CompanyId"
                ? data.find((item: any) => item.isOwner)?.id || data[0]?.id
                : data.find((item: any) => item.isDefault)?.id;
            setOptions((prev) => ({
              ...prev,
              [optionKey]: {
                options: data,
                defaultValue: defaultValue,
              },
            }));
          } else {
            setOptions((prev) => ({
              ...prev,
              [optionKey]: {
                options: [],
                defaultValue: null,
              },
            }));
          }
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);
  // Apply async defaults to the form when options' defaults are ready
  const unitDefault = options["AmountUnitPropertyId"]?.defaultValue;
  const companyDefault = options["CompanyId"]?.defaultValue;

  useEffect(() => {
    if (unitDefault !== null && unitDefault !== undefined) {
      form.setValue("unitPropertyId", unitDefault as any, {
        shouldValidate: true,
      });
    }
    if (companyDefault !== null && companyDefault !== undefined) {
      form.setValue("companyId", companyDefault as any, {
        shouldValidate: true,
      });
    }
  }, [unitDefault, companyDefault, form]);

  const saveReply = async (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value);
    });

    try {
      const response = await axiosInstance.post(REPLY_ADVERTISE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        onClose();
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const onSubmit = (values: any) => {
    const cleanObject = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value)
    );
    saveReply({ ...cleanObject, AdvertiseId: id });
  };

  useEffect(() => {
    checkAuth();
  }, [show, checkAuth]);

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="delete-modal-name "
      dir="rtl"
      className="modal-box"
    >
      <Box className="rounded-4" sx={modalStyle} dir="rtl">
        <CloseIcon
          style={{ color: "#757575", cursor: "pointer", float: "right" }}
          onClick={onClose}
        />
        <div className="d-flex justify-content-center">
          <h3 className="fs-18 fw-bolder px-2">درخواست خرید</h3>
        </div>

        <div
          className="d-flex mt-4 radius-12 p-3 py-4 flex-column"
          style={{ backgroundColor: "#F5F5F5" }}
        >
          <Link href={productLink}>
            <div className="d-flex justify-content-start rtl mb-2">
              <Typography
                sx={{ fontSize: { md: "18px", xs: "16px" } }}
                className="fw-500 p-0 m-0"
              >
                {productTitle}
              </Typography>
              {productEngTitle && (
                <Typography
                  sx={{ fontSize: { md: "18px", xs: "16px" } }}
                  variant="body2"
                  className="fw-500 p-0 me-2"
                >
                  ({productEngTitle})
                </Typography>
              )}
            </div>
          </Link>
          <div className="d-flex">
            <div className="d-flex align-items-center gap-1" dir="rtl">
              <Typography
                sx={{ fontSize: { md: "16px", xs: "14px" }, color: "#757575" }}
                variant="body2"
                className=" fw-500 text-end ms-2"
              >
                فروشنده:
              </Typography>
              <Typography
                sx={{ fontSize: { md: "16px", xs: "14px" } }}
                variant="body2"
                className="fw-500 text-end "
              >
                <Link href={link}>{name}</Link>
              </Typography>

              <CompanyStatus
                verified={isVerified}
                isSafe={isSafe}
                subscriptionAvatar={subscriptionAvatar}
              />
            </div>
          </div>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
          <Grid container spacing={2}>
            {options["CompanyId"] &&
              options["CompanyId"].options &&
              options["CompanyId"].options.length > 0 && (
                <SelectInput
                  id="companyId"
                  control={form.control}
                  options={options["CompanyId"]?.options || []}
                  placeholder="شرکت را انتخاب کنید"
                  label="حساب کاربری"
                  sm={12}
                />
              )}
            <TextWithSelect
              name="amount"
              id="unitPropertyId"
              control={form.control}
              options={options["AmountUnitPropertyId"].options || []}
              defaultSelectValue={
                options["AmountUnitPropertyId"]?.defaultValue || null
              }
              label="مقدار"
              placeholder="واحد مقدار"
              sm={12}
              hasError={!!form.formState.errors.amount}
            />
            <TextInput
              name="description"
              control={form.control}
              placeholder="توضیحات را وارد کنید"
              label="توضیحات"
              type="text"
              sm={12}
            />
            <Button
              variant="contained"
              className="mt-5 w-100"
              type="submit"
              style={{ backgroundColor: "#0D47A1" }}
            >
              ثبت پاسخ
            </Button>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ReplyAdvertise;
