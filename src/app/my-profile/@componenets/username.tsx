"use client";

import { Typography, Avatar } from "@mui/material";
import React, { Suspense } from "react";
import styles from "./styles.module.css";
import BackButton from "@/Components/common/back-button";
import Image from "next/image";
import { BiUser } from "react-icons/bi";
import LoaderComponent from "@/Components/LoaderComponent";
import { RxDashboard, RxDotFilled } from "react-icons/rx";
import VerifiedIcon from "@mui/icons-material/Verified";
import Link from "next/link";
import LinearProgress from "../dashboard/@componenets/LinearProgress";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { COMPANY } from "@/lib/internal-urls";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import TheAvatar from "@/Components/common/the-avatar";

interface UserNameProps {
  title: string;
  isVerified?: boolean;
  membershipPeriod: string | null;
  followerCount: number;
  followCount: number;
  avatar: string | null;
  code: string | null;
  positionTitle: string;
  companyTitle: string;
  companyId: number;
  profilePercentage?: number;
  companyCode?: string;
}

const UserName = ({
  title,
  isVerified,
  membershipPeriod = "",
  followerCount = 0,
  followCount = 0,
  avatar,
  code,
  positionTitle,
  companyTitle,
  companyCode,
  companyId,
  profilePercentage,
}: UserNameProps) => {
  return (
    <Suspense fallback={<LoaderComponent />}>
      <div className="headerStyle" dir="rtl">
        <div className="headerTitleBoxStyle">
          <div className="headerBackRowStyle header-item">
            <BackButton />
            <TheAvatar
              variant="circular"
              width={80}
              height={80}
              src={avatar}
              name={title}
              isVerified={isVerified}
              isSafe={false}
              subscriptionAvatar={null}
            />
            <div className="mx-2">
              <div className="row mx-0 col-12">
                <div className="px-0 d-flex align-items-center">
                  <Typography className="fs-26 fw-500 ps-5">{title}</Typography>
                  {profilePercentage && (
                    <LinearProgress value={profilePercentage} />
                  )}
                  <KeyboardArrowLeftIcon />
                </div>
              </div>
              <div className="d-flex my-2 gap-2 align-items-center user-company-information">
                {companyTitle && positionTitle && (
                  <>
                    <Typography variant="body2" className="fs-14 fw-400">
                      {positionTitle}
                    </Typography>
                    <Link
                      className="fs-14 fw-400 post-company-link"
                      href={COMPANY(companyCode ?? companyId.toString())}
                      onClick={async () => {
                        await saveEntityClick(
                          companyId,
                          EntityTypeEnum.Company
                        );
                      }}
                      passHref
                    >
                      {companyTitle}
                    </Link>
                  </>
                )}
              </div>
              <div className="d-flex gap-2 mx-0 col-12 fs-13 mt-1  align-items-center">
                {code && (
                  <>
                    <span className="mt-1"> {code} @ </span>
                    <RxDotFilled className="mt-2" />
                  </>
                )}
                {membershipPeriod && (
                  <>
                    <span className="mt-1"> {membershipPeriod} </span>
                    <RxDotFilled className="mt-2" />
                  </>
                )}

                <span className="mt-1" style={{ color: "#fb8c00" }}>
                  {followerCount}
                </span>
                <Typography
                  className="fs-13 fw-500 greyColor2 mt-1"
                  component={Link}
                  href="/my-profile/followers"
                >
                  نفر دنبال کننده
                </Typography>
                <RxDotFilled className="mt-2" />

                <span className="mt-1" style={{ color: "#fb8c00" }}>
                  {followCount}
                </span>
                <Typography
                  className="fs-13 fw-500 greyColor2 mt-1"
                  component={Link}
                  href="/my-profile/following"
                >
                  نفر دنبال شده
                </Typography>
              </div>
            </div>
          </div>

          <div className="header-item">
            <Link
              href="/my-profile/dashboard"
              className={styles.LinkToDashboard}
            >
              داشبورد
              <RxDashboard size={16} />
            </Link>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default UserName;
