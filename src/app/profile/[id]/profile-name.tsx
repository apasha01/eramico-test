"use client";

import { Typography, Avatar, Button } from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import styles from "./styles.module.css";
import BackButton from "@/Components/common/back-button";
import Image from "next/image";
import { BiUser } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { toast } from "react-toastify";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { axiosInstance } from "@/Helpers/axiosInstance";
import LoaderComponent from "@/Components/LoaderComponent";
import { RxDotFilled } from "react-icons/rx";
import VerifiedIcon from "@mui/icons-material/Verified";
import { FOLLOW_USER, UNFOLLOW_USER } from "@/lib/urls";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import Link from "next/link";
import TheAvatar from "@/Components/common/the-avatar";

interface Follow_res extends IAPIResult<any> {}

interface ProfileNameProps {
  id: string;
  title: string;
  isFollowed: boolean;
  isVerified: boolean;
  membershipPeriod: string;
  followerCount: number;
  followCount: number;
  avatar: string | null;
  code: string | null;
  setSelectedView: (view: number) => void;
  isSafe?: boolean;
  subscriptionAvatar?: string | null;
}

const ProfileName = ({
  id,
  title,
  isFollowed,
  isVerified,
  membershipPeriod = "",
  followerCount = 0,
  followCount = 0,
  avatar,
  code,
  setSelectedView,
  isSafe = false,
  subscriptionAvatar = null,
}: ProfileNameProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { checkAuth } = useAuthCheck();

  useEffect(() => {
    setIsSubscribed(isFollowed);
  }, [isFollowed]);

  const handleSubmit = async () => {
    try {
      if (!checkAuth(`برای دنبال کردن این کاربر ابتدا وارد شوید.`)) {
        return;
      }

      const url = isSubscribed
        ? `${UNFOLLOW_USER}/${id}`
        : `${FOLLOW_USER}?id=${id}`;

      const response = await axiosInstance.post<Follow_res>(url);
      if (response?.data?.success) {
        toast.success(response.data.message);
        setIsSubscribed(!isSubscribed);
      } else {
        toast.warning(response?.data?.message || "متاسفانه خطایی رخ داده است");
      }
    } catch (e) {
      toast.warning("متاسفانه خطایی رخ داده است");
    }
  };

  return (
    <Suspense fallback={<LoaderComponent />}>
      <div className="headerStyle" dir="rtl">
        <div className="headerTitleBoxStyle">
          <div className="headerBackRowStyle header-item">
            <BackButton />
            <TheAvatar
              src={avatar}
              variant="circular"
              width={72}
              height={72}
              isVerified={isVerified}
              isSafe={isSafe}
              subscriptionAvatar={subscriptionAvatar}
              name={title}
            />
            <div className="mx-2">
              <div className="row mx-0 col-12">
                <div className="px-0">
                  <Typography className="fs-26 fw-500">{title}</Typography>
                </div>
              </div>
              <div className="d-flex gap-2 mx-0 col-12 fs-13 mt-1 align-items-center">
                {code && (
                  <>
                    <span className="mt-1"> {code}@ </span>
                    <RxDotFilled className="mt-2" />
                  </>
                )}
                {membershipPeriod && (
                  <>
                    <span className="mt-1"> {membershipPeriod} </span>
                    <RxDotFilled className="mt-2" />
                  </>
                )}
                <div className="d-flex" onClick={() => setSelectedView(4)}>
                  <span className="mt-1 ms-1" style={{ color: "#fb8c00" }}>
                    {followerCount}
                  </span>
                  <Typography className="fs-13 fw-500 greyColor2 mt-1">
                    نفر دنبال کننده
                  </Typography>
                </div>
                <RxDotFilled className="mt-2" />
                <div className="d-flex" onClick={() => setSelectedView(5)}>
                  <span className="mt-1 ms-1" style={{ color: "#fb8c00" }}>
                    {followCount}
                  </span>
                  <Typography className="fs-13 fw-500 greyColor2 mt-1">
                    نفر دنبال شده
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div className="header-item">
            <Button
              className={
                isSubscribed ? "followButtonStyle" : "wantToFollowButtonStyle"
              }
              variant="outlined"
              type="button"
              onClick={handleSubmit}
              startIcon={
                <>
                  {!isSubscribed ? (
                    <FiPlus color="white" />
                  ) : (
                    <FaCheck
                      style={{
                        color: "#616161",
                      }}
                      color="#616161"
                    />
                  )}
                </>
              }
            >
              {!isSubscribed ? "دنبال کردن" : " دنبال شده"}
            </Button>
            <Button
              className="websiteButtonStyle"
              variant="outlined"
              type="button"
              href={`/my-profile/messages?u=${id}`}
              component={Link}
              onClick={(e) => {
                if (!checkAuth(`برای ارسال پیام ابتدا وارد شوید.`)) {
                  e.preventDefault();
                  return;
                }
              }}
            >
              ارسال پیام
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default ProfileName;
