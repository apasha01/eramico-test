import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import IsSafeIcon from "@/Components/Icons/IsSafeIcon";
import PremiumIcon from "@/Components/Icons/PremiumIcon";

interface CompanyFullNameProps {
  company: {
    companyId?: number;
    companyTitle: string;
    companyIsVerified: boolean;
    companyIsSubscribed: boolean;
    subscriptionAvatar?: string | null;
    companyIsSafe: boolean;
  };
  twoLine?: boolean;
}

const CompanyFullName = ({ company, twoLine }: CompanyFullNameProps) => {
  return company.companyId ? (
    <div
      className={(twoLine ? "flex-column " : "") + "d-flex gap-2 w-100"}
      dir="rtl"
    >
      <div className="fullName">{company.companyTitle}</div>
      <Tooltip
        dir="rtl"
        title={
          <div dir="rtl">
            با توجه به مدارک ارائه شده به سایت، اطلاعات شرکت و تماس این کاربر
            قابل تایید {company.companyIsVerified ? " است" : " نیست"}.
          </div>
        }
        placement="top"
      >
        <PremiumIcon
          className="eranico-icon"
          color={company.companyIsVerified ? "#FFB300" : "#A1887F"}
        />
      </Tooltip>
      {company.companyIsSafe && (
        <Tooltip
          dir="rtl"
          title={
            <div dir="rtl">
              با توجه به مدارک ارائه شده به سایت، اطلاعات شرکت و تماس این کاربر
              قابل تایید است.
            </div>
          }
          placement="top"
        >
          <IsSafeIcon className="eranico-icon" color="#17961a" />
        </Tooltip>
      )}
      {!company.companyIsSubscribed && company.subscriptionAvatar && (
        <Image
          src={company.subscriptionAvatar}
          alt="Subscription Avatar"
          width={16}
          loading="lazy"
          height={16}
        />
      )}
    </div>
  ) : null;
};

export default CompanyFullName;
