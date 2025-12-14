"use client";

import { IconButton, Button, Typography, Badge } from "@mui/material";
import Link from "next/link";
import MoreOption from "@/Components/Shared/Options";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  REMOVE_ADVERTISE,
  UPDATE_ADVERTISE_PRICE,
  ADD_ADVERTISE_SPECIAL_OFFER,
  REMOVE_ADVERTISE_SPECIAL_OFFER,
  ADD_ADVERTISE_PIN_SELLER,
  REMOVE_ADVERTISE_PIN_SELLER,
  ADVERTISE_ARCHIVED,
} from "@/lib/urls";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";
import { HiOutlinePencil } from "react-icons/hi";
import { numberWithCommas } from "@/lib/utils";
import EditAdvertiseModal from "./edit-advertise-modal";
import DeleteModal from "@/Components/common/delete-modal";
import CompanyStatus from "@/Components/common/company-status";
import { PRODUCT } from "@/lib/internal-urls";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { AdvertisementTypes } from "@/Helpers/Interfaces/Enums";
import ConfirmDialog from "@/Components/common/ArchiveItem";
import AdvertiseVisitChart from "./advertise-visit-chart";

export interface AdvertiseItemProps {
  item: any;
  options: any;
  setData: any;
  setShouldUpdate: any;
}

export default function ProfileAdvertiseItem({
  item,
  options,
  setData,
  setShouldUpdate,
}: AdvertiseItemProps) {
  const {
    id,
    companyId,
    companyTitle,
    price,
    visitCount,
    productId,
    advertiseStatusTitle,
    productTitle: faTitle,
    productEngTitle: enTitle,
    priceUnitPropertyTitle: priceUnit,
    amountUnitPropertyTitle: amountUnit,
    subscriptionAvatar,
    userIsVerified,
    userFullName,
    companyIsVerified,
    companyIsSafe,
    isSpecialOffer,
    isPinSeller,
    advertiseTypeId,
  } = item;
  const isAd = advertiseTypeId === AdvertisementTypes.Advertisement;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statePrice, setStatePrice] = useState<number>(price);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [archive, setShowArchive] = useState<boolean>(false);
  const [busyPin, setBusyPin] = useState(false);
  const [busySpecial, setBusySpecial] = useState(false);
  const [showVisitInfo, setShowVisitInfo] = useState(false); // ✅ اضافه شد

  useEffect(() => {
    setStatePrice(price);
  }, [price]);

  const onDeleteAdvertise = async () => {
    try {
      const response = await axiosInstance.post(`${REMOVE_ADVERTISE}/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        setData((prevData: any[]) => prevData.filter((ad) => ad.id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در حذف آگهی");
    }
    setShowDeleteModal(false);
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
        setData((prevData: any[]) =>
          prevData.map((ad) =>
            ad.id === id ? { ...ad, price: statePrice } : ad
          )
        );
        setIsEditing(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در ویرایش قیمت");
    }
  };

  const handleInputChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setStatePrice(parseFloat(numericValue) || 0);
  };

  // --- TOGGLE: پیشنهاد ویژه ---
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
    } catch (e: any) {
      console.error(e);
      toast.error("خطا در تغییر وضعیت پیشنهاد ویژه");
    } finally {
      setBusySpecial(false);
    }
  };

  // --- TOGGLE: صدر فروشندگان ---
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
    } catch (e: any) {
      console.error(e);
      toast.error("خطا در تغییر وضعیت صدر فروشندگان");
    } finally {
      setBusyPin(false);
    }
  };

  const archiveHandler = async () => {
    try {
      const res = await axiosInstance.post(`${ADVERTISE_ARCHIVED}/${id}`);
      if (res.data.success) {
        toast.success("آگهی با موفقیت آرشیو شد");
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("خطایی رخ داد");
    }
  };

  const renderField = () =>
    isEditing ? (
      <input
        type="text"
        className="fs-16 fw-500 w-100"
        autoComplete="off"
        value={`${statePrice}${priceUnit ? " " + priceUnit : ""}`}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && onEditPrice()}
        style={{
          outline: "none",
          border: "none",
          marginLeft: "8px",
          padding: "4px",
          textAlign: "center",
          direction: priceUnit ? "rtl" : "ltr",
        }}
        placeholder="قیمت"
      />
    ) : (
      <Typography className="fs-16 fw-500 w-50">
        {numberWithCommas(statePrice)} {priceUnit || ""}
      </Typography>
    );

  const renderIcon = () =>
    isEditing ? (
      <IconButton
        style={{
          borderRadius: "8px",
          width: "32px",
          height: "32px",
          backgroundColor: "#5caf4c",
        }}
        onClick={onEditPrice}
      >
        <FaCheck color="#fff" />
      </IconButton>
    ) : (
      <IconButton
        style={{
          borderRadius: "8px",
          width: "32px",
          height: "32px",
          backgroundColor: "#e9f2fe",
        }}
        onClick={() => setIsEditing(true)}
      >
        <HiOutlinePencil color="#0068ff" />
      </IconButton>
    );

  return (
    <>
      <section className="p-3 pt-2 mobileLeftPadding w-100" dir="rtl">
        <div className="container px-0 rounded-4 p-0 pe-auto AdvertisementBG sellAdvertisement">
          <div
            className="row px-4 mx-0 rtl justify-content-between"
            style={{ padding: "24px" }}
          >
            {/* --- عنوان محصول --- */}
            <div className="col-3 mx-0 px-0 d-flex align-items-center gap-2">
              <Badge
                badgeContent={advertiseStatusTitle}
                color="secondary"
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                className="text-related-badge"
              >
                <Link
                  className="d-flex gap-2 align-items-center"
                  href={PRODUCT(productId, faTitle)}
                  onClick={async () =>
                    await saveEntityClick(productId, EntityTypeEnum.Product)
                  }
                >
                  <Typography variant="body1" className="fs-19 fw-500">
                    {faTitle}
                  </Typography>
                  {enTitle && (
                    <Typography className=" greyColor fs-14 fw-500 sm-fs-12">
                      ({enTitle})
                    </Typography>
                  )}
                </Link>
              </Badge>
            </div>

            {/* --- شرکت / کاربر --- */}
            <div className="col-3 px-0">
              <Typography variant="body1" className="fs-19 fw-500">
                {companyTitle || userFullName}
              </Typography>
              <Typography className="d-flex gap-2 mt-2 fs-5">
                <CompanyStatus
                  verified={companyId ? companyIsVerified : userIsVerified}
                  subscriptionAvatar={subscriptionAvatar}
                  isSafe={companyId ? companyIsSafe : null}
                />
              </Typography>
            </div>

            {/* --- قیمت --- */}
            <div className="col-3 d-flex flex-column justify-content-center align-items-center">
              {amountUnit && (
                <Typography
                  variant="body2"
                  className="col-12"
                  style={{ fontSize: "18px" }}
                >
                  1 {amountUnit}
                </Typography>
              )}
              <div
                className="radius-12 w-100 col-12 bg-white d-flex no-wrap align-items-center justify-content-between p-2"
                style={{ border: "1px solid #e0e0e0" }}
              >
                {renderField()}
                {renderIcon()}
              </div>
            </div>

            {/* --- بازدید و دکمه‌ها --- */}
            <div className="col-3 d-none d-lg-flex">
              <div className="d-flex gap-3 align-items-center">
                <div>
                  <Badge
                    badgeContent={visitCount}
                    color="info"
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    <Image
                      src="/images/visit_count.png"
                      alt="تعداد بازدید"
                      width={24}
                      height={24}
                       loading="lazy"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowVisitInfo(!showVisitInfo)}
                    />
                  </Badge>
                </div>

                <Button
                  className="py-2"
                  variant="outlined"
                  LinkComponent={Link}
                  href={`/advertise/${id}`}
                  style={{ width: "121px" }}
                >
                  مشاهده آگهی
                </Button>

                <div className="advertise-more-btn">
                  <MoreOption
                    isAd={isAd}
                    archiveHandler={() => setShowArchive(true)}
                    deleteHandler={() => setShowDeleteModal(true)}
                    editHandler={() => setShowEditModal(true)}
                    toggleSpecialOfferHandler={toggleSpecialOffer}
                    togglePinSellerHandler={togglePinSeller}
                    isSpecialOffer={isSpecialOffer}
                    isPinSeller={isPinSeller}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ✅ متن پایین آگهی - باز می‌شود با کلیک روی بازدید */}
{showVisitInfo && (
  <div
    className="p-3 mt-2 mx-4 rounded-3"
    style={{

    }}
  >
    <AdvertiseVisitChart advertiseId={id} />
  </div>
)}

        </div>
      </section>

      {/* Modals */}
      {showDeleteModal && (
        <DeleteModal
          show={showDeleteModal}
          submitText="حذف آگهی"
          title="آیا مطمئن هستید که می‌خواهید آگهی را حذف کنید؟"
          text="با حذف آگهی، تمامی اطلاعات آن از صفحه شرکت شما حذف خواهد شد و قابل بازگردانی نیست."
          onClose={() => setShowDeleteModal(false)}
          onSubmit={onDeleteAdvertise}
        />
      )}

      {showEditModal && (
        <EditAdvertiseModal
          show={showEditModal}
          item={item}
          options={options}
          onClose={() => setShowEditModal(false)}
          setShouldUpdate={setShouldUpdate}
        />
      )}

      <ConfirmDialog
        onClose={() => setShowArchive(false)}
        open={archive}
        submitText="آرشیو کردن"
        onSubmit={archiveHandler}
        text="آیا از آرشیو کردن آگهی مطمئن هستید؟"
        title="آرشیو"
      />
    </>
  );
}
