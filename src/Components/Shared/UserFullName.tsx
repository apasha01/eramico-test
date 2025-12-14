import React from "react";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import PremiumIcon from "@/Components/Icons/PremiumIcon";

interface UserFullNameProps {
  user: {
    userFullName: string;
    userIsVerified: boolean;
    userIsSubscribed: boolean;
    subscriptionAvatar?: string | null;
  };
  twoLine?: boolean;
}

const UserFullName = ({ user, twoLine }: UserFullNameProps) => {
  return (
    <div className={(twoLine ? "flex-column " : "") + "d-flex gap-2 w-100"}>
      <div className="fullName">{user.userFullName}</div>
      <Tooltip
        dir="rtl"
        title={
          <div dir="rtl">
            با توجه به مدارک ارائه شده به سایت، اطلاعات شرکت و تماس این کاربر
            قابل تایید {user.userIsVerified ? " است" : " نیست"}.
          </div>
        }
        placement="top"
      >
        <PremiumIcon
          className="eranico-icon"
          color={user.userIsVerified ? "#FFB300" : "#A1887F"}
        />
      </Tooltip>
      {user.userIsSubscribed && user.subscriptionAvatar && (
        <Image
          src={user.subscriptionAvatar}
          alt="Subscription Avatar"
          width={16}
          loading="lazy"
          height={16}
        />
      )}
    </div>
  );
};

export default UserFullName;
