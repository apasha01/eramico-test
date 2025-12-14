"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, Button, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import VerifiedIcon from "@mui/icons-material/Verified";
import styles from "./styles.module.css";
import { BiUser } from "react-icons/bi";
import { mainUrl } from "@/Helpers/axiosInstance/constants";
import { getToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import { toast } from "react-toastify";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { LuClock3 } from "react-icons/lu";
import { HiOutlinePencil } from "react-icons/hi";
import { IoBan } from "react-icons/io5";
import { FaRegCircleCheck } from "react-icons/fa6";
import MemberCard from "./ManagerMemberCard";
import WaitingMemberCard from "./WaitingMemberCard";
import EditMemberCard from "./EditMemberCard";
import TheAvatar from "@/Components/common/the-avatar";
export default function MultiMemberCompanyStatus(props: {
  id: number;
  name: string;
  IsConfirmedCompany: boolean;
  shortIntroduction: string;
  avatar: string | null;
  positionStatus: string;
  state: string;
}) {
  const [companyAvatar, setCompanyAvatar] = useState<string | null>(null);
  const [isConfirmedCompany, setIsConfirmedCompany] = useState(false);
  const [isMembersVisible, setIsMembersVisible] = useState(false);

  useEffect(() => {
    setIsConfirmedCompany(props.IsConfirmedCompany);
    setCompanyAvatar(props?.avatar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = {
    state: "verify",
    name: "سام راد",
    id: 1,
    avatar: null,
    IsConfirmed: true,
    positionStatus: "مدیر مالی",
    phoneNumber: "09123456789",
  };

  const data2 = {
    state: "waiting",
    name: "محمدحسین رحیم‌پور",
    id: 1,
    avatar: null,
    IsConfirmed: true,
    positionStatus: "مدیر مالی",
    phoneNumber: "09123456789",
  };
  const data3 = {
    state: "waiting",
    name: "سحر خاقانی ",
    id: 1,
    avatar: null,
    IsConfirmed: true,
    positionStatus: " مدیر فروش",
    phoneNumber: "09123456789",
  };

  return (
    <div className={styles.MultiCompanyStyle}>
      <div className="col-1 px-0 mx-0" style={{ position: "relative" }}>
        <TheAvatar
          variant={"rounded"}
          width={68}
          height={68}
          name={props.name}
          src={mainUrl + companyAvatar}
          isVerified={isConfirmedCompany}
        />
      </div>
      <div className="col-11">
        <div className="row mx-0 col-12">
          <div className="col-12 px-0">
            <div className="d-flex w-full flex-row align-items-center justify-content-between">
              <div className="col-6 px-0">
                <Typography className="fs-26 fw-500">{props.name}</Typography>
                <Typography className="fs-14 fw-500 greyColor2 mt-2">
                  {props.shortIntroduction
                    ? props.shortIntroduction.length > 200
                      ? props.shortIntroduction.slice(0, 200) + " ..."
                      : props.shortIntroduction
                    : ""}
                </Typography>
              </div>
              <div className="d-flex gap-3 mx-4 px-1">
                <Button
                  className="py-2 px-4"
                  variant="outlined"
                  sx={{
                    border: "1px solid #E0E0E0",
                    color: "#212121",
                    "&:hover": {
                      // Adding hover style
                      backgroundColor: "transparent", // Setting background color to transparent
                      color: "#FB8C00",
                      borderColor: "#FB8C00",
                    },
                  }}
                >
                  انتقال مالکیت شرکت
                </Button>
                <IconButton
                  style={{
                    background: "transparent",
                    padding: "0px",
                    marginTop: "4px",
                    width: "36px",
                    height: "36px ",
                    border: "1px solid #0068FF",
                  }}
                  onClick={() => setIsMembersVisible(!isMembersVisible)}
                >
                  <HiOutlinePencil color="#0068ff" />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        {isMembersVisible && (
          <>
            {/* border to show the members */}
            <div
              style={{
                width: "100%",
                marginTop: "24px",
                borderBottom: "1px solid #EEEEEE",
              }}
            ></div>
            <Typography className="fs-18 fw-500 mt-4 mb-2">
              اعضای شرکت
            </Typography>
            <MemberCard {...data} />
            <WaitingMemberCard {...data2} />
            <EditMemberCard {...data3} />
          </>
        )}
      </div>
    </div>
  );
}
