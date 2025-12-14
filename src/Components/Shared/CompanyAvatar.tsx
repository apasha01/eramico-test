import React from "react";
import Image from "next/image";
import { Avatar } from "@mui/material";
import { BiUser } from "react-icons/bi";
import PremiumIcon from "@/Components/Icons/PremiumIcon";

interface Props {
  companyId?: number;
  companyAvatar?: string;
  companyTitle: string;
  companyIsVerified: boolean;
  small?: boolean;
}

const CompanyAvatar = ({
  companyId,
  companyTitle,
  companyAvatar,
  companyIsVerified,
  small,
}: Props) => {
  return companyId ? (
    <div className={(small ? "small " : "") + "arma-avatar"} dir="rtl">
      <Avatar
        variant={"rounded"}
        sx={{
          width: small ? 48 : 100,
          height: small ? 48 : 100,
          borderRadius: "12px",
        }}
        alt={"لوگوی شرکت " + companyTitle}
      >
        {companyAvatar ? (
          <Image
            className="avatar-image"
            alt={"لوگوی شرکت " + companyTitle}
            width={100}
            height={100}
            loading="lazy"
            src={companyAvatar}
          />
        ) : (
          <BiUser size={24} style={{ color: "#212121" }} />
        )}
      </Avatar>
      {companyIsVerified && (
        <PremiumIcon className="avatar-badge" color="#FFB300" />
      )}
    </div>
  ) : null;
};

export default CompanyAvatar;
