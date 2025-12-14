"use client";

import React, { useEffect, useState } from "react";

import { mainUrl } from "@/Helpers/axiosInstance/constants";
import { LuPhone } from "react-icons/lu";
import { FiMail } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import {  Button, IconButton, Tooltip, Typography } from "@mui/material";
import styles from "./styles.module.css";
import Link from "next/link";
import ChatIcon from "@/Components/Icons/ChatIcon";
import ContactButton from "./ContactButton";
import ShareButton from "./share-button";
import ReplyAdvertise from "./reply-advertise";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { REPLY_LIST } from "@/lib/urls";
import { toast } from "react-toastify";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LoaderComponent from "@/Components/LoaderComponent";
import { getToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import Replies from "./replies";
import { InfoItem } from "@/Components/common/info-item";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { createUrlFromObject, saveEntityClick } from "@/Helpers/Utilities";
import TheAvatar from "@/Components/common/the-avatar";
import CompanyStatus from "@/Components/common/company-status";
import { COMPANY, PRODUCT, PROFILE } from "@/lib/internal-urls";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { AdvertiseDetail } from "../advertiseInterface";
import PageHeader from "@/Components/common/page-header";

interface InfoProps {
  response: AdvertiseDetail;
}

const Info: React.FC<InfoProps> = ({ response }) => {
  const [showReplyAdvertiseModal, setShowReplyAdvertiseModal] = useState(false);
  const [showResponses, setShowResponses] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { checkAuth } = useAuthCheck();

  useEffect(() => {
    if (getToken_Localstorage()) {
      setHasToken(true);
    }
  }, []);

  const {
    id,
    userId,
    productId,
    productTitle,
    productEngTitle,
    companyId,
    companyTitle,
    userFullName,
    companyIsVerified,
    userIsVerified,
    technicalInfo,
    producer,
    producerCountryPropertyTitle,
    dealTypePropertyTitle,
    packingTypePropertyTitle,
    priceUnitPropertyTitle,
    amountUnitPropertyTitle,
    price,
    description,
    companyAvatar,
    userAvatar,
    companyCode,
    userName,
    companyTelephone,
    companyCellphone,
    contactNumber,
    userTelephone,
    userCellphone,
    companyAddress,
    subscriptionAvatar,
    isMine,
    productTypeTitle,
    productGradeTitle,
    priceBasePropertyTitle,
    basedPriceLocationPropertyTitle,
    minAmount,
    maxAmount,
    userIsSubscribed,
    companyIsSubscribed,
    companyIsSafe,
  } = response;

  const verified = companyId ? companyIsVerified : userIsVerified;
  const safe = companyIsSafe;
  const isSubscribed = companyId ? companyIsSubscribed : userIsSubscribed;
  const avatar = companyId ? companyAvatar : userAvatar;
  const name = companyId ? companyTitle : userFullName;

  const handleClick = async () => {
    if (!checkAuth("برای ارسال درخواست خرید ابتدا وارد شوید.")) {
      return;
    }
    setLoading(true);
    if (!isMine) {
      setShowReplyAdvertiseModal(true);
    } else {
      if (showResponses) {
        setShowResponses(false);
      } else {
        setShowResponses(true);
        const response = await axiosInstance.get<any>(`${REPLY_LIST}/${id}`);

        if (!response.data.success) {
          toast(response.data.message);
        } else {
          const data = response.data.data.map(
            (item: {
              id: any;
              companyId: number;
              userId: number;
              userFullName: any;
              companyTitle: any;
              userName: any;
              companyCode: any;
              unitPropertyTitle: any;
              amount: any;
              timePast: any;
              createdDatePersian: any;
              userAvatar: any;
              companyAvatar: any;
              companyCellphone: any;
              userCellphone: any;
              companyAddress: any;
              companyEmail: any;
              userEmail: any;
              userProvince: any;
              companyIsVerified: any;
              description: any;
              userIsVerified: any;
            }) => ({
              id: item.id,
              companyId: item.companyId,
              userId: item.userId,
              description: item.description,
              name: item.companyId ? item.companyTitle : item.userFullName,
              username: item.companyId ? item.companyCode : item.userName,
              amount: item.amount,
              amountUnit: item.unitPropertyTitle,
              createdDate: item.timePast || item.createdDatePersian,
              avatar: item.companyId ? item.companyAvatar : item.userAvatar,
              cellphone: item.companyId
                ? item.companyCellphone
                : item.userCellphone,
              address: item.companyId ? item.companyAddress : item.userProvince,
              email: item.companyId ? item.companyEmail : item.userEmail,
              verified: item.companyId
                ? item.companyIsVerified
                : item.userIsVerified,
            })
          );

          setResponses(data || []);
          setLoading(false);
        }
      }
    }
  };

  const messageUrl = createUrlFromObject("/my-profile/messages", {
    ...{ i: id },
    ...(userId ? { u: userId } : {}),
    ...(companyId ? { c: companyId } : {}),
  });

  return (
    <div className="mt-4" dir="rtl">
      <div className="d-flex flex-column w-100 gap-2 px-4">
        <PageHeader title={` آگهی فروش ${productTitle || ""}`} />

        <div
          className="d-flex flex-column mt-5"
          style={{gap: 10, color: "#ffb300" }}
        >
          <Link
            href={PRODUCT(productId.toString(), productTitle)}
            onClick={async () => {
              await saveEntityClick(productId, EntityTypeEnum.Product);
            }}
          >
            <div className="d-flex justify-content-start mb-2">
              <Typography
                sx={{ fontSize: { md: "18px", xs: "16px" } }}
                variant="body2"
                className={`${styles.boxButtonTextStyle} fw-500 p-0 m-0`}
              >
                {productTitle}
              </Typography>
              {productEngTitle && (
                <Typography
                  sx={{ fontSize: { md: "18px", xs: "16px" } }}
                  variant="body2"
                  className={`${styles.boxEnglishButtonTextStyle} fw-500 p-0 me-2`}
                >
                  ({productEngTitle})
                </Typography>
              )}
            </div>
          </Link>
          <div className="d-flex gap-1 align-items-center">
            <InfoItem
              title="فروشنده"
              description={companyId ? companyTitle : userFullName}
              link={
                companyId
                  ? COMPANY(companyCode ?? companyId.toString())
                  : PROFILE(userId.toString())
              }
            />
            <CompanyStatus
              verified={verified}
              subscriptionAvatar={subscriptionAvatar}
              isSafe={safe}
            />
          </div>
        </div>
        <div className="BorderBottom w-100">
          <div className={styles.detailStyle}>
            <InfoItem title="مشخصات فنی" description={technicalInfo} />
            <div className="d-flex flex-column gap-4 rtl flex-wrap">
              <InfoItem title="نوع محصول" description={productTypeTitle} />
              <InfoItem title="گرید محصول" description={productGradeTitle} />
              <InfoItem title="تولید کننده" description={producer} />
              <InfoItem
                title="کشور تولیدکننده"
                description={producerCountryPropertyTitle}
              />
              <InfoItem
                title="نوع معامله"
                description={dealTypePropertyTitle}
              />
              <InfoItem
                title="بسته‌بندی"
                description={packingTypePropertyTitle || ""}
              />
              <InfoItem
                title="قیمت"
                description={
                  price
                    ? price?.toLocaleString() +
                      " " +
                      (priceUnitPropertyTitle || "")
                    : "تماس بگیرید"
                }
              />
              <InfoItem
                title="مبنای قیمت"
                description={priceBasePropertyTitle || ""}
              />
              <InfoItem
                title="محل مبنای قیمت"
                description={basedPriceLocationPropertyTitle || ""}
              />
              {minAmount && (
                <InfoItem
                  title="حداقل سفارش"
                  description={
                    minAmount?.toLocaleString() + " " + amountUnitPropertyTitle
                  }
                />
              )}
              {maxAmount && (
                <InfoItem
                  title="حداکثر سفارش"
                  description={
                    maxAmount?.toLocaleString() + " " + amountUnitPropertyTitle
                  }
                />
              )}
            </div>
            <InfoItem title=" توضیحات" description={description} />
            <div className="d-flex gap-2 w-100 justify-content-between mt-2 align-items-center mt-2 mb-4">
              <div className="d-flex gap-3 align-items-center">
                <Button
                  variant="contained"
                  className="rounded-5 px-4 py-1 rtl"
                  style={{ backgroundColor: "#0D47A1" }}
                  onClick={handleClick}
                >
                  {hasToken && isMine
                    ? showResponses
                      ? "بستن پاسخ‌ها"
                      : "مشاهده پاسخ‌ها"
                    : "درخواست خرید"}
                  <IconButton component="span" className="p-0">
                    {hasToken &&
                      isMine &&
                      (showResponses ? (
                        <KeyboardArrowUpIcon sx={{ color: "white" }} />
                      ) : (
                        <KeyboardArrowDownIcon sx={{ color: "white" }} />
                      ))}
                  </IconButton>
                </Button>
                <Tooltip title={<div dir="rtl">ارسال پیام به فروشنده</div>}>
                  <IconButton
                    href={messageUrl}
                    component={Link}
                    className="p-0"
                    onClick={(e) => {
                      if (!checkAuth("برای ارسال پیام ابتدا وارد شوید.")) {
                        e.preventDefault();
                        return;
                      }
                    }}
                  >
                    <ChatIcon color="#0d47a1" />
                  </IconButton>
                </Tooltip>
                <ContactButton response={response} color="#0d47a1" />
              </div>
              <ShareButton link={`${mainUrl}/advertise/${id}`} />
            </div>
          </div>
          <div className="d-flex flex-column rtl  w-100 justify-content-start">
            {hasToken && isMine && showResponses && (
              <>
                {loading ? (
                  <LoaderComponent />
                ) : (
                  <Replies responses={responses} />
                )}
              </>
            )}
          </div>
        </div>
        {isMine && (
          <div className={styles.detailStyle}>
            <Typography variant="body1" className={"mt-3 fs-26 fw-500"}>
              اطلاعات تماس
            </Typography>
            <div className="d-flex gap-2 w-100 justify-content-between">
              <div dir="rtl">
                {(contactNumber ||
                  companyTelephone ||
                  companyCellphone ||
                  userTelephone ||
                  userCellphone) && (
                  <Typography className="fs-16 mt-3 fw-500 d-flex gap-2 align-items-center">
                    <LuPhone />
                    {contactNumber ||
                      companyTelephone ||
                      companyCellphone ||
                      userTelephone ||
                      userCellphone}
                  </Typography>
                )}

                {(companyCode || userName) && (
                  <Typography className="fs-16 mt-3 fw-500 d-flex gap-2 align-items-center">
                    <FiMail />
                    {companyCode || userName}
                  </Typography>
                )}

                {companyAddress && (
                  <Typography className="fs-16 mt-3 fw-500 d-flex gap-2 align-items-center">
                    <IoLocationOutline />
                    {companyAddress}
                  </Typography>
                )}
              </div>
              <TheAvatar
                name={name}
                src={avatar || ""}
                isVerified={verified}
                isSafe={safe}
                subscriptionAvatar={subscriptionAvatar}
              />
            </div>
          </div>
        )}
      </div>
      {showReplyAdvertiseModal && (
        <ReplyAdvertise
          show={showReplyAdvertiseModal}
          name={companyId ? companyTitle : userFullName}
          productTitle={productTitle}
          productEngTitle={productEngTitle}
          productLink={PRODUCT(productId.toString(), productTitle)}
          subscriptionAvatar={subscriptionAvatar || ""}
          isVerified={verified}
          isSafe={safe}
          link={
            companyId
              ? COMPANY(companyCode ?? companyId.toString())
              : PROFILE(userId.toString())
          }
          onClose={() => setShowReplyAdvertiseModal(false)}
          id={id}
        />
      )}
    </div>
  );
};
export default Info;
