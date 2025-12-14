"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  InputAdornment,
  OutlinedInput,
  FormControl,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { SubscriptionType } from "../subscriptionInterface";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { SUBSCRIPTION_APPLY_COUPON } from "@/lib/urls";
import { toast } from "react-toastify";
import ConfirmDialog from "@/Components/common/ArchiveItem";

interface MyCompany {
  companyId: number;
  companyTitle: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (
    companyId: number | null,
    paymentTypeId: number,
    coupon: string | null
  ) => void;
  companies: MyCompany[];
  loading: boolean;
  subscriptionType?: SubscriptionType | null;
}

export interface Coupon {
  couponAmount: number;
  finalPrice: number;
  subscriptionTypeDiscount: number;
  subscriptionTypeDiscountAmount: number;
  subscriptionTypeFinalPrice: number;
  subscriptionTypePrice: number;
  subscriptionTypeTax: number;
  subscriptionTypeTaxAmount: number;
}

export default function CompanySelectionModal({
  open,
  onClose,
  onSelect,
  companies,
  loading,
  subscriptionType,
}: Props) {
  const [coupon, setCoupon] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [paymentTypeId, setPaymentTypeId] = useState<number>(1);
  const [selectedCompany, setSelectedCompany] = useState<MyCompany | null>(
    null
  );

  const confirmMessage = useMemo(() => {
    let msg = `آیا مطمئن هستید که میخواهید یک اشتراک برای <b>${
      selectedCompany == null
        ? "خودتان "
        : "شرکت " + selectedCompany?.companyTitle
    } </b> خریداری کنید؟
    `;
    if (companies.length === 0) {
      msg += `<br/>نکته: در صورتی که در آینده شرکت خود را ثبت کنید، اشتراک به صورت اتوماتیک به شرکت منتقل خواهد شد.</br/>`;
    } else if (selectedCompany == null) {
      msg += `در صورتی که می‌خواهید برای شرکت اشتراک تهیه کنید، لطفاً شرکت مورد نظر را انتخاب نمایید. اشتراک‌هایی که برای خود تهیه می‌کنید امکان انتقال به شرکت‌های موجود را ندارند.`;
    }
    return msg;
  }, [selectedCompany, companies.length]);

  const confirmationApproved = async () => {
    sendBackToParent(paymentTypeId);
  };

  const sendBackToParent = (paymentType: number | null) => {
    onSelect(selectedCompany?.companyId || null, paymentType || 1, coupon);
    handleClose();
  };

  const handleConfirm = (paymentType: number) => {
    if (companies.length > 0) {
      setPaymentTypeId(paymentType);
      setConfirmationOpen(true);
    } else {
      sendBackToParent(paymentType);
    }
  };

  const handleClose = () => {
    setCoupon(null);
    setAppliedCoupon(null);
    setPaymentTypeId(1);
    onClose();
  };

  const handleApplyCoupon = async (remove: boolean) => {
    if (remove) {
      setCoupon("");
      setAppliedCoupon(null);
      return;
    }
    axiosInstance
      .get(
        SUBSCRIPTION_APPLY_COUPON +
          `?CouponCode=${coupon}&SubscriptionTypeId=${subscriptionType?.id}`
      )
      .then((response) => {
        if (response.data.success) {
          setAppliedCoupon(response.data.data);
          toast.success("کد تخفیف با موفقیت اعمال شد");
        } else {
          setAppliedCoupon(null);
          toast.error("کد تخفیف معتبر نیست");
        }
      })
      .catch(() => {
        setAppliedCoupon(null);
        toast.error("خطا در اعمال کد تخفیف");
      });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        dir="rtl"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>انتخاب شرکت</DialogTitle>
        <DialogContent>
          {loading ? (
            <div>در حال بارگذاری...</div>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                لطفاً شرکت مورد نظر خود را انتخاب کنید:
              </Typography>
              <List>
                <ListItem>
                  <ListItemButton onClick={() => setSelectedCompany(null)}>
                    <Radio checked={selectedCompany === null} />
                    <ListItemText primary="خرید برای خودم (شخصی یا ثبت برای شرکت جدید)" />
                  </ListItemButton>
                </ListItem>
                {companies.map((company) => (
                  <ListItem key={company.companyId}>
                    <ListItemButton onClick={() => setSelectedCompany(company)}>
                      <Radio
                        checked={
                          selectedCompany?.companyId === company.companyId
                        }
                      />
                      <ListItemText primary={company.companyTitle} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              {subscriptionType && subscriptionType.finalPrice > 0 && (
                <FormControl className="col-12 text-center pt-2">
                  <OutlinedInput
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    autoComplete="off"
                    id="apply-coupon"
                    placeholder="کد تخفیف را وارد کنید"
                    readOnly={!!appliedCoupon}
                    endAdornment={
                      <InputAdornment position="end">
                        <Button
                          onClick={() => handleApplyCoupon(!!appliedCoupon)}
                          size="large"
                          variant="outlined"
                          color="secondary"
                        >
                          {appliedCoupon && coupon
                            ? "حذف کد تخفیف"
                            : "اعمال کد تخفیف"}
                        </Button>
                      </InputAdornment>
                    }
                  ></OutlinedInput>
                </FormControl>
              )}

              {subscriptionType && (
                <div className="mt-3 p-3 border rounded-3 bg-light">
                  {subscriptionType.price > 0 && (
                    <div className="d-flex justify-content-between">
                      <div>قیمت پایه:</div>
                      <div>{subscriptionType.price.toLocaleString()} تومان</div>
                    </div>
                  )}
                  {subscriptionType.taxAmount > 0 && (
                    <div className="d-flex justify-content-between">
                      <div>مالیات ({subscriptionType.tax}%):</div>
                      <div>
                        {subscriptionType.taxAmount.toLocaleString()} تومان
                      </div>
                    </div>
                  )}
                  {subscriptionType.discount > 0 && (
                    <div className="d-flex justify-content-between">
                      <div>تخفیف ({subscriptionType.discount}%):</div>
                      <div>
                        <span dir="ltr">
                          -{subscriptionType.discountAmount.toLocaleString()}
                        </span>{" "}
                        تومان
                      </div>
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="d-flex justify-content-between">
                      <div>تخفیف کد تخفیف:</div>
                      <div>
                        <span dir="ltr">
                          -{appliedCoupon?.couponAmount.toLocaleString()}
                        </span>{" "}
                        تومان
                      </div>
                    </div>
                  )}
                  {subscriptionType && subscriptionType.finalPrice > 0 && (
                    <hr />
                  )}
                  <div className="d-flex justify-content-between fw-bold">
                    <div>قیمت نهایی:</div>
                    <div>
                      {appliedCoupon
                        ? appliedCoupon.finalPrice?.toLocaleString()
                        : subscriptionType.finalPrice.toLocaleString()}{" "}
                      تومان
                    </div>
                  </div>
                </div>
              )}

              {subscriptionType && subscriptionType.finalPrice > 0 && (
                <div className="mt-3 fs-12 text-secondary">
                  نکته: در صورتی که می‌خواهید برای شرکت اشتراک تهیه کنید:
                  <br />
                  ۱- اگر شرکت خود را پیش از این ثبت کرده‌اید، شرکت را انتخاب
                  کنید. اشتراک‌هایی که برای خود تهیه می‌کنید امکان انتقال به
                  شرکت‌های موجود را ندارند.
                  <br />
                  ۲- اگر شرکت ندارید یا می‌خواهید شرکت خود را در آینده ثبت کنید
                  خرید برای خودم را انتخاب کنید، پس از ثبت شرکت جدید، اشتراک به
                  صورت اتوماتیک به شرکت منتقل خواهد شد.
                </div>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={() => handleConfirm(1)}
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              color: "#fff",
              borderRadius: "12px",
              fontSize: "16px",
              "&:hover": { backgroundColor: "#43a047" },
            }}
            disabled={
              (appliedCoupon
                ? appliedCoupon.finalPrice
                : subscriptionType?.finalPrice) === 0
            }
          >
            پرداخت آنلاین
          </Button>

          <Button
            onClick={() => handleConfirm(2)}
            fullWidth
            variant="outlined"
            sx={{
              borderColor: "#ff9800",
              color: "#ff9800",
              borderRadius: "12px",
              fontSize: "16px",
              "&:hover": { borderColor: "#fb8c00", color: "#fb8c00" },
            }}
          >
            پرداخت با فیش بانکی
          </Button>

          {/* <Button
          onClick={onClose}
          fullWidth
          variant="text"
          sx={{
            mt: 1,
            color: "#757575",
            textDecoration: "underline",
          }}
        >
          انصراف
        </Button> */}
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        onClose={() => setConfirmationOpen(false)}
        open={confirmationOpen}
        submitText="بله مطمئن هستم"
        onSubmit={confirmationApproved}
        submitColor="#4caf50"
        text={confirmMessage}
        title="تایید انتخاب"
      />
    </>
  );
}
