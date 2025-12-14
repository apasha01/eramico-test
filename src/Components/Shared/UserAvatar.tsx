import React from "react";
import Image from "next/image";
import { Avatar } from "@mui/material";
import { BiUser } from "react-icons/bi";
import PremiumIcon from "@/Components/Icons/PremiumIcon";

interface Props {
  userId?: number;
  userAvatar?: string;
  userFullName: string;
  userIsVerified: boolean;
  small?: boolean;
}

const UserAvatar = ({
  userId,
  userFullName,
  userAvatar,
  userIsVerified,
  small,
}: Props) => {
  return userId ? (
    <div className={(small ? "small " : "") + "arma-avatar"} dir="rtl">
      <Avatar
        variant={"rounded"}
        sx={{
          width: small ? 48 : 100,
          height: small ? 48 : 100,
          borderRadius: "12px",
        }}
        alt={"تصویر " + userFullName}
      >
        {userAvatar ? (
          <Image
            className="avatar-image"
            alt={"تصویر " + userFullName}
            width={100}
            height={100}
            loading="lazy"
            src={userAvatar}
          />
        ) : (
          <BiUser size={24} style={{ color: "#212121" }} />
        )}
      </Avatar>
      {!userIsVerified && (
        <PremiumIcon className="avatar-badge" color="#FFB300" />
      )}
    </div>
  ) : null;
};

export default UserAvatar;
