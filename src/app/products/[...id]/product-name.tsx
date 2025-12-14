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
import { FOLLOW_PRODUCT, UNFOLLOW_PRODUCT } from "@/lib/urls";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import TheAvatar from "@/Components/common/the-avatar";

interface Follow_res extends IAPIResult<any> {}
interface ProductNameProps {
  id: number;
  title: string;
  isFollowed: boolean;
  avatar: string | null;
  followerCount?: number;
  code?: string;
  setSelectedView: (view: number) => void;
}

const ProductName = ({
  id,
  title,
  isFollowed,
  avatar,
  followerCount = 0,
  code,
  setSelectedView,
}: ProductNameProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { checkAuth } = useAuthCheck();

  useEffect(() => {
    setIsSubscribed(isFollowed);
  }, [isFollowed]);

  const handleSubmit = async () => {
    try {
      if (!checkAuth()) {
        return;
      }

      const url = isSubscribed
        ? `${UNFOLLOW_PRODUCT}/${id}`
        : `${FOLLOW_PRODUCT}?id=${id}`;

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
      <div dir="rtl" className="headerStyle">
        <div className="headerTitleBoxStyle">
          <div className="headerBackRowStyle header-item">
            <BackButton />
            <div
              className="d-flex px-0"
              style={{ marginRight: "16px", position: "relative" }}
            >
              <TheAvatar
                variant="rounded"
                sx={{ width: { xs: 55, sm: 72 }, height: { xs: 55, sm: 72 } }}
                src={avatar}
                name={title}
              />
            </div>
            <div className="mx-2">
              <div className="row mx-0 col-12">
                <div className="px-0">
                  <Typography
                    sx={{ fontSize: { xs: "18px", md: "26px" } }}
                    className="fw-500"
                  >
                    {title}
                  </Typography>
                </div>
              </div>
              <div className="d-flex gap-2 mx-0 col-12 fs-13 mt-1 align-items-center">
                {code && (
                  <span>
                    {" "}
                    ({code}) <RxDotFilled size={26} />{" "}
                  </span>
                )}
                <div onClick={() => setSelectedView(6)}>
                  <span style={{ color: "#fb8c00" }}> {followerCount} </span>
                  نفر دنبال کننده
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
              endIcon={
                <>
                  {!isSubscribed ? (
                    <FiPlus size={13} color="white" />
                  ) : (
                    <FaCheck
                      size={13}
                      style={{
                        color: "#616161",
                      }}
                      color="#616161"
                    />
                  )}
                </>
              }
            >
              {!isSubscribed ? "دنبال‌کردن" : " دنبال‌شده"}
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default ProductName;
