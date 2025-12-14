"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, Button, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import VerifiedIcon from "@mui/icons-material/Verified";
import styles from "./styles.module.css";
import { BiUser } from "react-icons/bi";
import { toast } from "react-toastify";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { FOLLOW_COMPANY, UNFOLLOW_COMPANY } from "@/lib/urls";
import { RxDotFilled } from "react-icons/rx";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { COMPANY } from "@/lib/internal-urls";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { useRouter } from "next/navigation";
import TheAvatar from "@/Components/common/the-avatar";
import CompanyStatus from "@/Components/common/company-status";

interface Follow_res extends IAPIResult<any> {}

interface IndividualCompanyProps {
  id: number;
  name: string;
  isFollowed: boolean;
  isVerified: boolean;
  membershipPeriod: string;
  followerCount: number;
  shortIntroduction: string;
  avatar: string | null;
  code: string | null;
  isSafe: boolean;
  subscriptionAvatar?: string | null;
}

export default function IndividualCompany({
  id,
  name,
  isFollowed,
  isVerified,
  membershipPeriod = "",
  followerCount = 0,
  shortIntroduction = "",
  avatar,
  code,
  isSafe,
  subscriptionAvatar,
}: IndividualCompanyProps) {
  const [companyFollowed, setCompanyFollowed] = useState(isFollowed);
  const { checkAuth } = useAuthCheck();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      if (!checkAuth()) {
        return;
      }

      const url = companyFollowed
        ? `${UNFOLLOW_COMPANY}/${id}`
        : `${FOLLOW_COMPANY}?id=${id}`;

      const response = await axiosInstance.post<Follow_res>(url);

      if (response?.data?.success) {
        toast.success(response.data.message);
        setCompanyFollowed(!companyFollowed);
      } else {
        toast.warning(response?.data?.message || "متاسفانه خطایی رخ داده است");
      }
    } catch (e) {
      toast.warning("متاسفانه خطایی رخ داده است");
    }
  };

  return (
    <div
      className={styles.individualCompanyStyle}
      onClick={async () => {
        router.push(COMPANY(code ?? id.toString()));
        await saveEntityClick(id, EntityTypeEnum.Company);
      }}
    >
      <div className="px-0 mx-0">
        <TheAvatar
          src={avatar || ""}
          name={name || "لوگوی شرکت"}
          width={72}
          height={72}
          variant="rounded"
          isSafe={isSafe}
          isVerified={isVerified}
          subscriptionAvatar={subscriptionAvatar}
        />
      </div>
      <div className="col-11">
        <div className="row mx-0 col-12">
          <div className="px-0 ">
            <Link
              href={COMPANY(code ?? id.toString())}
              passHref
              className={`text-decoration-none d-flex align-items-center ${styles.SmCompaniesFs}`}
              onClick={async (e) => {
                e.stopPropagation();
                await saveEntityClick(id, EntityTypeEnum.Company);
              }}
            >
              <Typography
                className={`fs-26 ms-2 fw-500 ${styles.SmCompaniesFs}`}
              >
                {name}
              </Typography>
              <CompanyStatus
                isSafe={isSafe}
                subscriptionAvatar={subscriptionAvatar}
                verified={isVerified}
              />
            </Link>
          </div>
          <div className="d-flex align-items-center mx-0 px-0 my-2 justify-content-end text-start">
            <div className={`${styles.wantToFollowButtonStyle}`}>
              <Button
                className={
                  companyFollowed
                    ? "followButtonStyle"
                    : "wantToFollowButtonStyle"
                }
                variant="outlined"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit();
                }}
                startIcon={
                  <>
                    {!companyFollowed ? (
                      <FiPlus
                        size={13}
                        color="white"
                      />
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
                {!companyFollowed ? "دنبال کردن" : " دنبال شده"}
              </Button>
            </div>
            <div>
              <Button
                className={"websiteButtonStyle"}
                variant="outlined"
                LinkComponent={Link}
                href={COMPANY(code ?? id.toString())}
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();

                  await saveEntityClick(id, EntityTypeEnum.Company);
                }}
              >
                مشاهده شرکت
              </Button>
            </div>
          </div>
        </div>
        <div className="d-flex gap-2 mx-0 col-12 fs-13 mt-1">
          {code && (
            <>
              <span className="mt-1"> {code} </span>
              <RxDotFilled className="mt-2" />
            </>
          )}

          <span className="mt-1"> {membershipPeriod} </span>
          <RxDotFilled className="mt-2" />

          <span className="mt-1"> {followerCount} </span>
          <Typography className="fs-13 fw-500 greyColor2 mt-1">
            نفر دنبال کننده
          </Typography>
        </div>
        {shortIntroduction && (
          <div className="col-12 text-justify mt-3 pl-2">
            <Typography
              sx={{ fontSize: { md: "14px", sm: "12px"}, paddingRight:'10px' }}
              variant="body2"
              className=" fw-500"
            >
              {shortIntroduction
                ? shortIntroduction.length > 280
                  ? shortIntroduction.slice(0, 280) + " ..."
                  : shortIntroduction
                : ""}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
