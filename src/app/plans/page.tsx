"use client";

import { axiosInstance } from "@/Helpers/axiosInstance";
import React, { useEffect, useState } from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";
import styles from "./styles.module.css";
import { SubscriptionType } from "./subscriptionInterface";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import LoaderComponent from "@/Components/LoaderComponent";
import { FiCheck } from "react-icons/fi";
import { useAppSelector } from "@/lib/hooks";
import { toast } from "react-toastify";
import SuccessModal from "./@components/SuccessModal";
import CompanySelectionModal from "./@components/CompanySelectionModal";
import {
  COMPANIES_OWNER,
  SUBSCRIPTION_CHECKOUT,
  SUBSCRIPTION_TYPE_GET_DETAIL,
  SUBSCRIPTION_TYPE_LOOKUP,
} from "@/lib/urls";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { useUserState } from "@/Hooks/useUserState";
import { useRouter } from "next/navigation";
import { IoCloseCircleOutline } from "react-icons/io5";
import { APP_NAME, GetMetadata } from "@/lib/metadata";
interface Subscription_res extends IAPIResult<SubscriptionType[]> {}

export default function Plans() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { user: currentUser, isUserLoaded, isAuthenticated } = useUserState();
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(0);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [item, setItem] = useState<any>(null);
  const { checkAuth } = useAuthCheck();
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUserCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const response = await axiosInstance.get(COMPANIES_OWNER);
      setCompanies(response.data.data);
    } catch (error) {
      toast.error("خطا در دریافت لیست شرکت‌ها");
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleSubscriptionClick = (subscription: SubscriptionType) => {
    if (!checkAuth("جهت ارتقای حساب وارد شوید.")) {
      return;
    }
    setSelectedSubscription(subscription);
    setSelectedSubscriptionId(subscription.id);
    setShowCompanyModal(true);
    fetchUserCompanies();
  };

  const handleCompanySelection = async (
    companyId: number | null,
    paymentTypeId: number,
    coupon: string | null
  ) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("userId", currentUser?.userId.toString());
    formData.append("subscriptionTypeId", selectedSubscriptionId.toString());
    formData.append("paymentTypeId", paymentTypeId.toString());
    if (coupon) {
      formData.append("couponCode", coupon);
    }
    if (companyId) {
      formData.append("companyId", companyId.toString());
    }
    try {
      const response = await axiosInstance.post(
        SUBSCRIPTION_CHECKOUT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        if (response.data.success) {
          if (paymentTypeId === 1) {
            window.location.href = response.data.data;
          }
        } else {
          setShowModal(true);
        }
        setResponseMessage(
          response.data.message ||
            "درخواست اشتراک با موفقیت ثبت شد. پس از پرداخت هزینه با دفتر تماس بگیرید."
        );
      }
    } catch (error) {
      toast.error("خطا در ثبت درخواست اشتراک");
      console.error("Subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Set document title on client side
    const md = GetMetadata("اشتراک‌ها");
    if (typeof document !== "undefined") {
      document.title = md.title;
    }
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axiosInstance.get<Subscription_res>(
          SUBSCRIPTION_TYPE_LOOKUP
        );
        if (
          response.data.success &&
          response?.data?.data &&
          response?.data?.data?.length > 0
        ) {
          setSubscriptions(response.data.data);
        } else {
          console.error("Error fetching subscriptions:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false); // Set loading to false when fetch is complete
      }
    };

    fetchSubscriptions();
  }, []);

  // Render loading indicator if data is still being fetched
  if (loading) {
    return (
      <div className="w-100 pt-5">
        <LoaderComponent />
      </div>
    );
  }

  const renderMembership = (item: string, value: any, type: string) => {
    const checkmark = <FiCheck size={22} />;

    const getValueStr = (value: number) =>
      value == 1 ? "یک" : value.toString();

    const renderRow = (text: string, additionalText?: string) => (
      <div className="d-flex justify-content-end gap-2 w-100 align-items-center">
        <Typography className="fs-14 fw-500">{text}</Typography>
        {additionalText && (
          <Typography className="fs-14 fw-500">
            {Number(additionalText) === 1 ? "یک" : additionalText}
          </Typography>
        )}
        {checkmark}
      </div>
    );

    const specialRenderRow = (text: string, additionalText?: string) => (
      <div className="d-flex justify-content-end gap-2 w-100 align-items-center">
        <div className="d-flex justify-content-end gap-1 align-items-center">
          <Typography className="fs-14 fw-500">{text}</Typography>
          {additionalText && (
            <Typography className="fs-14 fw-500">
              {Number(additionalText) === 1 ? "یک" : additionalText}
            </Typography>
          )}
        </div>
        {checkmark}
      </div>
    );

    switch (item) {
      case "isOfficial":
        return value && renderRow("عضویت رسمی در " + APP_NAME);
      case "verifyUser":
        return value && renderRow("تایید هویت کاربر");
      case "verifyCompany":
        return value && renderRow("تایید هویت شرکت");
      case "exclusiveCompany":
        return value && specialRenderRow("ثبت شرکت و صفحه اختصاصی شرکت");
      case "writePost":
        return value && renderRow("درج پست");
      case "advertiseCount":
        if (value == 0) return null;
        return value == -1
          ? renderRow("درج آگهی نامحدود")
          : renderRow("درج آگهی در ماه", getValueStr(value));
      case "inquiryResponseCount":
        if (value == 0) return null;
        return value === -1
          ? renderRow("استعلام نامحدود")
          : renderRow("پاسخ به استعلام در ماه", getValueStr(value));
      case "adsInFeed":
        return value && renderRow("نمایش آگهی در بین پست‌ها");
      case "chosenCompany":
        return value && renderRow("معرفی به عنوان شرکت برگزیده");
      case "targetedBanner":
        return value && renderRow("تبلیغات بنری هدفمند (صفحات مرتبط)");
      case "feedBanner":
        return value && renderRow("تبلیغ بنری پر بازدید");
      case "marketingEmailCount":
        return (
          value !== 0 &&
          renderRow(`ارسال ${getValueStr(value)} مرتبه ایمیل بازاریابی در ماه`)
        );
      case "telegramCount":
        return (
          value !== 0 &&
          renderRow(
            `ارسال ${getValueStr(value)} مرتبه تبلیغ در کانال تلگرام در ماه`
          )
        );
      case "reportageCount":
        return (
          value !== 0 && specialRenderRow("رپورتاژ آگهی", getValueStr(value))
        );
      case "pinSellerCount":
        return value !== 0 && renderRow("نمایش یک آگهی در صَدر فروشندگان");
      case "feedBannerCount":
        return value !== 0 && renderRow("تبلیغ بنری پر بازدید");
      case "specialOfferCount":
        return value !== 0 && renderRow("نمایش آگهی در پیشنهادهای ویژه");
      case "targetedBannerCount":
        return value !== 0 && renderRow("تبلیغ بنری هدفمند (صفحات مرتبط)");
      default:
        return null;
    }
  };

  const getColor = (item: SubscriptionType) => {
    if (item.color && item.color.length > 0) return item.color;
    switch (item.id) {
      case 4:
        return "#F2A23F";
      case 2:
        return "#4A99E9";
      case 3:
        return "#8D6E63";
      default:
        return "#E9E9E9";
    }
  };

  return (
    <div className="mainStyle" dir="rtl">
      <Typography
        className="fs-36 fw-500"
        style={{
          margin: "64px auto 16px auto",
        }}
      >
        پلن‌های عضویت در {APP_NAME}
      </Typography>
      <Typography
        className="fs-18 fw-500"
        style={{
          margin: "16px auto 65px auto",
          color: "#757575",
        }}
      >
        با مقایسه ویژگی های هر پلن، یکی از پلن‌های زیر را انتخاب کنید. همچنین
        می‌توانید این پلن عضویت را برای شرکت‌هایی که عضو آن هستید خریداری
        نمایید.
      </Typography>

      <div className={styles.mainPlanDiv}>
        {subscriptions.map((itemArray: SubscriptionType, index: number) => (
          <div
            className={`${styles.planBox} ${styles[`border-${itemArray.id}`]}`}
            style={{ borderColor: getColor(itemArray) }}
            key={index}
          >
            <h3>{itemArray.title}</h3>
            <Typography className="fs-14 fw-500 greyColor mt-4 mb-3">
              تعرفه سالیانه
            </Typography>
            <div className="d-flex justify-content-start gap-2 w-100 align-items-center">
              <Typography className="fs-24 text-black fw-700">
                {Number(itemArray?.price).toLocaleString()}
              </Typography>
              <Typography className="fs-14 fw-500">تومان</Typography>
            </div>
            <Button
              onClick={() => handleSubscriptionClick(itemArray)}
              className="fs-16 w-100 fw-400 radius-12"
              disabled={isLoading}
              style={{
                color: itemArray.title === "عادی" ? "#212121" : "white",
                backgroundColor: getColor(itemArray),
                marginTop: "18px",
                height: "48px",
                border:
                  itemArray.title === "عادی" ? "1.5px solid #212121" : "none",
              }}
            >
              {itemArray.isFree
                ? "رایگان امتحان کنید"
                : "ارتقا به اشتراک " + itemArray.title}
            </Button>
            <div className={styles.divider} />
            <div className="mt-3">
              {Object.keys(itemArray).map((key: string, idx: number) => (
                <div key={idx} className="my-3" dir="ltr">
                  {renderMembership(key, itemArray[key], itemArray.title)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CompanySelectionModal
        open={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        onSelect={handleCompanySelection}
        companies={companies}
        loading={loadingCompanies}
        subscriptionType={selectedSubscription}
      />
      <SuccessModal
        item={item}
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={responseMessage}
      />
      <DashboardModal
        onClose={() => setShowModal(false)}
        open={showModal}
        title={responseMessage}
      />
    </div>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string | null;
};

function DashboardModal({ open, onClose, title = "عملیات موفق" }: Props) {
  const router = useRouter();

  const handleGoDashboard = () => {
    router.push("/my-profile/dashboard/subscription-history");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="end">
          <Typography variant="h6">پرداخت</Typography>
          <IconButton aria-label="close" onClick={onClose} size="large">
            <IoCloseCircleOutline />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Typography
          variant="body1"
          sx={{
            textAlign: "left",
          }}
        >
          {title}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, display: "flex", gap: 2 }}>
        <Button onClick={onClose} variant="text">
          بستن
        </Button>

        <Button
          onClick={handleGoDashboard}
          variant="contained"
          sx={{
            borderRadius: 9999,
            backgroundColor: "#ff9800",
            color: "#fff",
            textTransform: "none",
            "&:hover": { backgroundColor: "#fb8c00" },
          }}
        >
          رفتن به داشبورد
        </Button>
      </DialogActions>
    </Dialog>
  );
}
