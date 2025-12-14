"use client";

import React, { useEffect, useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import { BiUser } from "react-icons/bi";
import Image from "next/image";
import { mainUrl } from "@/Helpers/axiosInstance/constants";
import { LuPhone } from "react-icons/lu";
import { FiMail } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { Avatar, Button, IconButton, Tooltip, Typography } from "@mui/material";
import styles from "./styles.module.css";
import Link from "next/link";
import BackButton from "@/Components/common/back-button";
import ChatIcon from "@/Components/Icons/ChatIcon";
import { getToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import ContactButton from "@/app/advertise/[...id]/ContactButton";
import ShareButton from "@/app/advertise/[...id]/share-button";
import ReplyInquiry from "./reply-inquiry";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { REPLY_LIST } from "@/lib/urls";
import { toast } from "react-toastify";
import LoaderComponent from "@/Components/LoaderComponent";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Replies from "./replies";
import { InfoItem } from "@/Components/common/info-item";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { createUrlFromObject, saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { COMPANY, PRODUCT, PROFILE } from "@/lib/internal-urls";
import TheAvatar from "@/Components/common/the-avatar";

interface InfoProps {
  response: any;
}

const Info: React.FC<InfoProps> = ({ response }) => {
  const {
    id,
    productTitle,
    productEngTitle,
    companyId,
    productId,
    companyTitle,
    userFullName,
    companyIsVerified,
    userIsVerified,
    technicalInfo,
    producer,
    producerCountryPropertyTitle,
    dealTypePropertyTitle,
    amountUnitPropertyTitle,
    amount,
    description,
    companyAvatar,
    companyCode,
    userName,
    contactNumber,
    companyTelephone,
    companyCellphone,
    userTelephone,
    userCellphone,
    companyAddress,
    subscriptionAvatar,
    isMine,
    userId,
    packingTypePropertyTitle,
    productTypeTitle,
    productGradeTitle,
  } = response;

  const verified = companyId ? companyIsVerified : userIsVerified;
  const [showReplyInquiryModal, setShowReplyInquiryModal] = useState(false);
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

  const handleClick = async () => {
    if (!checkAuth()) {
      return;
    }

    setLoading(true);
    if (!isMine) {
      setShowReplyInquiryModal(true);
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
              price: any;
              unitPropertyTitle: any;
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
              userIsVerified: any;
              days: any;
              isAgreemental: boolean;
            }) => ({
              id: item.id,
              companyId: item.companyId,
              userId: item.userId,
              name: item.companyId ? item.companyTitle : item.userFullName,
              username: item.companyId ? item.companyCode : item.userName,
              price: item.price,
              priceUnit: item.unitPropertyTitle,
              createdDate: item.timePast || item.createdDatePersian,
              days: item.days,
              avatar: item.companyId ? item.companyAvatar : item.userAvatar,
              cellphone: item.companyId
                ? item.companyCellphone
                : item.userCellphone,
              address: item.companyId ? item.companyAddress : item.userProvince,
              isAgreemental: item.isAgreemental,
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
    <div className={styles.mainStyle}>
      <div className={styles.boxButtonStyle}>
        <Typography variant="body1" className="fs-20">
          استعلام خرید
        </Typography>
        <BackButton />
      </div>

      <div
        className="d-flex flex-column mt-5"
        style={{ marginRight: "60px", gap: 10, color: "#ffb300" }}
      >
        <Link
          href={PRODUCT(productId, productTitle)}
          onClick={() => {
            saveEntityClick(productId, EntityTypeEnum.Product);
          }}
          className="w-100"
        >
          <div className="d-flex justify-content-start rtl mb-2">
            <Typography
              variant="body2"
              className={`${styles.boxButtonTextStyle} fw-500 fs-18 p-0 m-0`}
            >
              {productTitle}
            </Typography>
            {productEngTitle && (
              <Typography
                variant="body2"
                className={`${styles.boxEnglishButtonTextStyle} fw-500 fs-18 p-0 me-2`}
              >
                ({productEngTitle})
              </Typography>
            )}
          </div>
        </Link>
        <div className="d-flex justify-content-end">
          {subscriptionAvatar && (
            <Image  loading="lazy" alt="" src={subscriptionAvatar} width={20} height={20} />
          )}
          {verified && <VerifiedIcon fontSize="inherit" color="inherit" />}
          <InfoItem
            title="خریدار"
            description={companyId ? companyTitle : userFullName}
            link={
              companyId ? COMPANY(companyCode ?? companyId) : PROFILE(userId)
            }
            onClick={() => {
              saveEntityClick(
                companyId || userId,
                companyId ? EntityTypeEnum.Company : EntityTypeEnum.User
              );
            }}
          />
        </div>
      </div>
      <div className="BorderBottom w-100">
        <div className={styles.detailStyle}>
          <InfoItem title="مشخصات فنی" description={technicalInfo} />
          <div className="d-flex gap-4 rtl flex-wrap">
            <InfoItem title="نوع محصول" description={productTypeTitle} />
            <InfoItem title="گرید محصول" description={productGradeTitle} />
            <InfoItem title="تولید کننده" description={producer} />
            <InfoItem
              title="کشور تولیدکننده"
              description={producerCountryPropertyTitle}
            />
            <InfoItem title="نوع معامله" description={dealTypePropertyTitle} />
            <InfoItem
              title="بسته‌بندی"
              description={packingTypePropertyTitle}
            />
            {amount > 0 && (
              <InfoItem
                title="مقدار"
                description={
                  amount?.toLocaleString() + " " + amountUnitPropertyTitle
                }
              />
            )}
          </div>
          <InfoItem title="توضیحات" description={description} />
          <div className="d-flex gap-2 w-100 justify-content-between mt-2 align-items-center">
            <ShareButton link={`${mainUrl}/inquiries/${id}`} />
            <div className="d-flex gap-3 align-items-center">
              <ContactButton response={response} color="#ffb300" />
              <Tooltip title={<div dir="rtl">ارسال پیام به استعلام‌کننده</div>}>
                <IconButton
                  onClick={(e) => {
                    if (!checkAuth("برای ارسال پیام ابتدا وارد شوید")) {
                      e.preventDefault();
                    }
                  }}
                  href={messageUrl}
                  component={Link}
                  className="p-0"
                >
                  <ChatIcon color="#ffb300" />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                className="rounded-5 px-4 py-1 rtl"
                onClick={handleClick}
              >
                {hasToken && isMine
                  ? showResponses
                    ? "بستن پاسخ‌ها"
                    : "مشاهده پاسخ‌ها"
                  : "پاسخ به استعلام"}
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
            </div>
          </div>
          <div className="d-flex flex-column rtl  w-100 justify-content-start">
            {hasToken && showResponses && isMine && (
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
      </div>
      {hasToken && isMine && (
        <div className={styles.detailStyle}>
          <Typography variant="body1" className="mt-3 fs-26 fw-500">
            اطلاعات تماس
          </Typography>
          <div className="d-flex gap-2 w-100 justify-content-between">
            <TheAvatar
              variant={"rounded"}
              width={100}
              height={100}
              src={companyAvatar}
              name={companyTitle}
              subscriptionAvatar={subscriptionAvatar}
              isVerified={verified}
              isSafe={false}
            />
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
          </div>
        </div>
      )}
      {showReplyInquiryModal && (
        <ReplyInquiry
          show={showReplyInquiryModal}
          name={companyId ? companyTitle : userFullName}
          productTitle={productTitle}
          productEngTitle={productEngTitle}
          productLink={PRODUCT(productId, productTitle)}
          productId={productId}
          subscriptionAvatar={subscriptionAvatar}
          verified={verified}
          link={companyId ? COMPANY(companyId) : PROFILE(userId)}
          onClose={() => setShowReplyInquiryModal(false)}
          id={id}
        />
      )}
    </div>
  );
};
export default Info;
