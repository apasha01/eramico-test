"use client";

import {
  IconButton,
  Button,
  Typography,
  Tooltip,
  Badge,
  Box,
} from "@mui/material";
import Link from "next/link";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CompanyStatus from "./company-status";
import { AdvertisementTypes } from "@/Helpers/Interfaces/Enums";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { COMPANY, PRODUCT, PROFILE } from "@/lib/internal-urls";
import MoreOption from "@/Components/Shared/Options";
import { useState } from "react";
import {
  ADD_ADVERTISE_PIN_SELLER,
  ADD_ADVERTISE_SPECIAL_OFFER,
  ADVERTISE_ARCHIVED,
  ADVERTISE_PENDING,
  REMOVE_ADVERTISE,
  REMOVE_ADVERTISE_PIN_SELLER,
  REMOVE_ADVERTISE_SPECIAL_OFFER,
  UPDATE_ADVERTISE_PRICE,
} from "@/lib/urls";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { toast } from "react-toastify";
import EditAdvertiseModal from "@/app/my-profile/@componenets/edit-advertise-modal";
import DeleteModal from "./delete-modal";
import { useRouter } from "next/navigation";
import ConfirmDialog from "./ArchiveItem";
import Image from "next/image";
import { numberWithCommas } from "@/lib/utils";
import { FaCheck } from "react-icons/fa";
import { HiOutlinePencil } from "react-icons/hi";
import AdvertiseVisitChart from "@/app/my-profile/@componenets/advertise-visit-chart";
import { useAdvertiseLookups } from "@/Hooks/useAdvertiseLookups";

interface AdvertiseItemProps {
  item?: any;
  id?: string | number;
  faTitle: string;
  enTitle: string;
  name?: string;
  amount?: number;
  advertiseStatusTitle?: string;
  amountUnit?: string | null;
  date?: number | string | null;
  verified?: boolean;
  isMine?: boolean;
  isSafe?: boolean | null;
  subscriptionAvatar?: string | null;
  userId?: number;
  companyId?: number;
  productId?: number;
  isSpecialOffer?: boolean;
  isPinSeller?: boolean;
  wrapperClassName?: string | null;
  advertiseTypeId?: AdvertisementTypes | number | null;
  price?: number | null;
  priceUnit?: string | null;
  handleClick?: () => void;
  isSmall?: boolean;
}

export default function AdvertiseItem({
  item,
  id,
  userId,
  companyId,
  productId,
  faTitle,
  enTitle,
  name,
  date,
  amount,
  isMine = false,
  amountUnit,
  subscriptionAvatar,
  verified,
  advertiseStatusTitle,
  isSafe,
  wrapperClassName,
  advertiseTypeId,
  isSpecialOffer,
  isPinSeller,
  price,
  priceUnit,
  handleClick,
  isSmall = false,
}: AdvertiseItemProps) {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statePrice, setStatePrice] = useState<number>(price || 0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [endInquiries, setEndInquiry] = useState(false);
  const [advertiseStatus, setAdvertiseStatus] = useState<string | undefined>(
    advertiseStatusTitle
  );
  const [busyPin, setBusyPin] = useState(false);
  const [busySpecial, setBusySpecial] = useState(false);
  const [archive, setArchive] = useState<boolean>(false);
  const [showVisitInfo, setShowVisitInfo] = useState(false);
  const { options } = useAdvertiseLookups();

  const handleProductClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (productId) await saveEntityClick(productId, EntityTypeEnum.Product);
  };

  const handleCompanyClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (companyId) await saveEntityClick(companyId, EntityTypeEnum.Company);
    else if (userId) await saveEntityClick(userId, EntityTypeEnum.User);
  };

  const handleViewItemClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) await saveEntityClick(id, EntityTypeEnum.Advertise);
    if (handleClick) handleClick();
  };

  const handleInputChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setStatePrice(parseFloat(numericValue) || 0);
  };

  const onEditPrice = async () => {
    try {
      if (price === statePrice) {
        setIsEditing(false);
        return;
      }
      const response = await axiosInstance.post(
        `${UPDATE_ADVERTISE_PRICE}?id=${id}&Price=${statePrice}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setIsEditing(false);
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("خطا در ویرایش قیمت");
    }
  };

  const renderField = () =>
    isEditing ? (
      <input
        type="text"
        className="fs-16 fw-500"
        autoComplete="off"
        value={`${statePrice}${priceUnit ? " " + priceUnit : ""}`}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && onEditPrice()}
        style={{
          outline: "none",
          border: "none",
          background: "transparent",
          marginLeft: "8px",
          padding: "4px",
          textAlign: "center",
          direction: priceUnit ? "rtl" : "ltr",
          width: "200px",
        }}
        placeholder="قیمت"
      />
    ) : (
      <Typography
        className={`${isSmall ? "fs-14" : "fs-16"} fw-500`}
        style={{ minWidth: "200px" }}
      >
        {numberWithCommas(statePrice)}{" "}
        <Typography component="span" className="fs-10 fw-400">
          {priceUnit || ""}
        </Typography>
      </Typography>
    );

  const renderIcon = () =>
    isEditing ? (
      <IconButton
        style={{
          borderRadius: "8px",
          width: isSmall ? "24px" : "32px",
          height: isSmall ? "24px" : "32px",
          backgroundColor: "#5caf4c",
        }}
        onClick={onEditPrice}
      >
        <FaCheck color="#fff" size={isSmall ? 12 : 16} />
      </IconButton>
    ) : (
      <IconButton
        style={{
          borderRadius: "8px",
          width: isSmall ? "24px" : "32px",
          height: isSmall ? "24px" : "32px",
          backgroundColor: "#e9f2fe",
        }}
        onClick={() => setIsEditing(true)}
      >
        <HiOutlinePencil color="#0068ff" size={isSmall ? 12 : 16} />
      </IconButton>
    );

  const toggleSpecialOffer = async () => {
    if (busySpecial) return;
    setBusySpecial(true);
    const currentlyOn = Boolean(isSpecialOffer);
    const endpoint = currentlyOn
      ? `${REMOVE_ADVERTISE_SPECIAL_OFFER}/${id}`
      : `${ADD_ADVERTISE_SPECIAL_OFFER}/${id}`;

    try {
      const { data } = await axiosInstance.post(endpoint);
      if (data?.success) {
        toast.success(data?.message || "با موفقیت انجام شد");
        setData((prev: any[]) =>
          prev.map((ad) =>
            ad.id === id ? { ...ad, isSpecialOffer: !currentlyOn } : ad
          )
        );
      } else {
        toast.error(data?.message || "عملیات ناموفق بود");
      }
    } catch {
      toast.error("خطا در تغییر وضعیت پیشنهاد ویژه");
    } finally {
      setBusySpecial(false);
    }
  };

  const togglePinSeller = async () => {
    if (busyPin) return;
    setBusyPin(true);
    const currentlyOn = Boolean(isPinSeller);
    const endpoint = currentlyOn
      ? `${REMOVE_ADVERTISE_PIN_SELLER}/${id}`
      : `${ADD_ADVERTISE_PIN_SELLER}/${id}`;

    try {
      const { data } = await axiosInstance.post(endpoint);
      if (data?.success) {
        toast.success(data?.message || "با موفقیت انجام شد");
        setData((prev: any[]) =>
          prev.map((ad) =>
            ad.id === id ? { ...ad, isPinSeller: !currentlyOn } : ad
          )
        );
      } else {
        toast.error(data?.message || "عملیات ناموفق بود");
      }
    } catch {
      toast.error("خطا در تغییر وضعیت صدر فروشندگان");
    } finally {
      setBusyPin(false);
    }
  };

  const onDeleteAdvertise = async () => {
    try {
      const response = await axiosInstance.post(`${REMOVE_ADVERTISE}/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        setData((prevData: any[]) => prevData.filter((ad) => ad.id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("خطا در حذف آگهی");
    }
    setShowDeleteModal(false);
  };

  const archiveHandler = async () => {
    try {
      const res = await axiosInstance.post(`${ADVERTISE_ARCHIVED}/${id}`);
      if (res.data.success) {
        toast.success("اگهی با موفقیت ارشیو شد");
        setAdvertiseStatus("پایان پذیرفته");
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("خطایی رخ داد");
    }
  };

  const pendingHandler = async () => {
    try {
      const res = await axiosInstance.post(`${ADVERTISE_PENDING}/${id}`);
      if (res.data.success) {
        toast.success("آگهی با موفقیت در لیست بررسی مجدد کارشناسان قرار گرفت");
        setAdvertiseStatus("منتظر تأیید");
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("خطایی رخ داد");
    }
  };

  const isAd = advertiseTypeId === AdvertisementTypes.Advertisement;
  const canChangeStatus =
    isMine &&
    advertiseStatus !== "در جریان" &&
    advertiseStatus !== "منتظر تأیید";
  const cls =
    (isAd
      ? "AdvertisementBG sellAdvertisement"
      : "AdvertisementBgSell buyAdvertisement") +
    (isMine ? "" : " cursor-pointer");
  const btnText = isAd ? "مشاهده آگهی" : "مشاهده استعلام";
  const url = isAd ? `/advertise/${id}` : `/inquiries/${id}`;
  const btnCls = isAd ? "" : "goldoutline";

  return (
    <div
      className={`row ${
        isSmall ? "p-2 min-w-250" : "p-3 pr-2 pt-2 min-w-350"
      } ${wrapperClassName || ""} `}
    >
      <Box
        className={`container px-0 rounded-4 p-0 ${cls}`}
        component={isMine ? "div" : Link}
        href={isMine ? undefined : url}
      >
        <div className="row px-2 py-3 rtl flex-nowrap text-wrap justify-content-between align-items-center">
          <div className="col-4 d-flex gap-2 flex-column align-items-start ">
            {isMine ? (
              <Badge
                badgeContent={advertiseStatus || null}
                color="secondary"
                sx={{ pr: 4 }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                className="text-related-badge"
              >
                <Typography
                  variant="body1"
                  className={`${isSmall ? "fs-16" : "fs-19"} fw-500 faTitle no-wrap-ellipsis`}
                >
                  {faTitle}
                </Typography>
              </Badge>
            ) : (
              <Typography
                variant="body1"
                className={`${isSmall ? "fs-16" : "fs-19"} fw-500 faTitle no-wrap-ellipsis`}
              >
                {faTitle}
              </Typography>
            )}

            {enTitle && (
              <Typography
                className={`greyColor ${isSmall ? "fs-12" : "fs-14"} fw-500 enTitle no-wrap-ellipsis`}
              >
                {enTitle}
              </Typography>
            )}
          </div>

          <div
            className={`d-flex flex-column align-items-center gap-1 p-0 ${
              isSmall ? "col-3" : isMine ? "col" : "col-4"
            }`}
          >
            <Tooltip title={name}>
              <Typography
                variant="body1"
                className={`no-wrap-ellipsis ${
                  isSmall ? "fs-16" : "fs-19"
                } fw-500 faTitle`}
              >
                {name}
              </Typography>
            </Tooltip>

            <Typography className="col-12 d-flex gap-2 fs-5">
              <CompanyStatus
                verified={verified}
                subscriptionAvatar={subscriptionAvatar}
                isSafe={isSafe || false}
              />
            </Typography>
          </div>

          {isAd && isMine ? (
            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
              {amountUnit && (
                <Typography variant="body2">1 {amountUnit}</Typography>
              )}
              <div
                className="radius-12 bg-white d-flex no-wrap align-items-center justify-content-between p-2"
                style={{ border: "1px solid #e0e0e0" }}
              >
                {renderField()}
                {renderIcon()}
              </div>
            </div>
          ) : !isSmall ? (
            <div className="col-auto d-flex gap-1 align-self-center flex-column p-0">
              {!isAd ? (
                amount ? (
                  <>
                    {date && (
                      <Typography variant="body2" className="text-nowrap">
                        {date}
                      </Typography>
                    )}
                    <Typography
                      variant="body1"
                      className="text-nowrap sm-fs-10"
                    >
                      {amount ? (
                        <>
                          {amount?.toLocaleString()} {amountUnit || ""}
                        </>
                      ) : (
                        "تماس بگیرید"
                      )}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" className="sm-fs-10">
                    تماس بگیرید
                  </Typography>
                )
              ) : price ? (
                <div className="d-flex flex-column flex-nowrap p-0">
                  <Typography variant="body2" className="text-nowrap">
                    {amount?.toLocaleString()} {amountUnit || " عدد"}
                  </Typography>
                  <Typography variant="body1" className="text-nowrap">
                    {price?.toLocaleString()} {priceUnit || " ریال"}
                  </Typography>
                </div>
              ) : (
                <Typography variant="body2" className="sm-fs-10">
                  تماس بگیرید
                </Typography>
              )}
            </div>
          ) : null}

          {isMine && (
            <Badge
              badgeContent={item.visitCount}
              color="info"
              className="col-auto"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <Image
                src="/images/visit_count.png"
                alt="تعداد بازدید"
                width={24}
                loading="lazy"
                height={24}
                style={{ cursor: "pointer" }}
                onClick={() => setShowVisitInfo(!showVisitInfo)}
              />
            </Badge>
          )}

          <div className="col-auto d-flex align-self-center w-fit-content gap-2">
            <Button
              variant="outlined"
              className={`${isSmall ? "fs-12 px-1" : "fs-14"}${btnCls} d-none d-lg-inline-block`}
              component={isMine ? Link : "div"}
              href={isMine ? url : undefined}
              onClick={handleViewItemClick}
            >
              {btnText}
            </Button>
            {isMine && (
              <MoreOption
                isAd={isAd}
                deleteHandler={() => setShowDeleteModal(true)}
                editHandler={() => setShowEditModal(true)}
                archiveHandler={() => setArchive(true)}
                className={btnCls}
                endInquiries={() => setEndInquiry(true)}
                toggleSpecialOfferHandler={toggleSpecialOffer}
                togglePinSellerHandler={togglePinSeller}
                isSpecialOffer={isSpecialOffer}
                isPinSeller={isPinSeller}
                PendingHandler={
                  canChangeStatus ? () => setShowPendingModal(true) : undefined
                }
              />
            )}
            <div className="d-inline-block d-lg-none">
              <IconButton className="advertisementButton">
                <NavigateBeforeIcon />
              </IconButton>
            </div>
          </div>
        </div>

        {showVisitInfo && (
          <div className="col-auto p-3 mt-2 mx-4 rounded-3">
            <AdvertiseVisitChart advertiseId={id as number} />
          </div>
        )}
      </Box>

      {showDeleteModal && (
        <DeleteModal
          show={showDeleteModal}
          submitText={isAd ? "حذف آگهی" : "حذف استعلام"}
          title={`آیا مطمئن هستید که می‌خواهید ${
            isAd ? "آگهی" : "استعلام"
          }  را حذف کنید؟`}
          text={`با حذف ${isAd ? "آگهی" : "استعلام"}  تمامی اطلاعات این ${
            isAd ? "آگهی" : "استعلام"
          } از صفحه شرکت شما حذف خواهدشد و قابل بازگردانی نمی‌باشد.`}
          onClose={() => setShowDeleteModal(false)}
          onSubmit={onDeleteAdvertise}
        />
      )}

      {showEditModal && (
        <EditAdvertiseModal
          isAd={isAd}
          show={showEditModal}
          item={item!}
          options={options}
          onClose={() => setShowEditModal(false)}
          setShouldUpdate={setShouldUpdate}
        />
      )}

      <ConfirmDialog
        open={archive}
        onClose={() => setArchive(false)}
        submitText="آرشیو کردن"
        title="آرشیو آگهی"
        onSubmit={archiveHandler}
        text="آیا از آرشیو کردن آگهی مطمئنید؟"
      />

      <ConfirmDialog
        open={endInquiries}
        onClose={() => setEndInquiry(false)}
        submitText="پایان استعلام"
        title="پایان استعلام"
        onSubmit={archiveHandler}
        text="آیا از پایان استعلام مطمئنید؟"
      />

      <ConfirmDialog
        open={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        submitText="ارسال درخواست بررسی مجدد"
        title="بررسی مجدد"
        onSubmit={pendingHandler}
        text="آیا از ارسال درخواست بررسی مجدد آگهی مطمئنید؟"
        submitColor="green"
      />
    </div>
  );
}
