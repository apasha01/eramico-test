"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, Button, IconButton, Typography } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import styles from "./styles.module.css";
import { BiUser } from "react-icons/bi";
import { mainUrl } from "@/Helpers/axiosInstance/constants";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { LuClock3 } from "react-icons/lu";
import { HiOutlinePencil } from "react-icons/hi";
import { IoBan } from "react-icons/io5";

interface Follow_res extends IAPIResult<any> {}

export default function WaitingCompanyStatus(props: {
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

  useEffect(() => {
    setIsConfirmedCompany(props.IsConfirmedCompany);
    setCompanyAvatar(props?.avatar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.VerifyCompanyStyle}>
      <div
        className="col-1 px-0 mx-0"
        style={{ opacity: "0.5", position: "relative" }}
      >
        <Avatar
          variant={"rounded"}
          sx={{
            width: 68,
            height: 68,
            backgroundColor: "#fff ",
            color: "#212121",
            border: "1px solid #F5F5F5",
            borderRadius: "12px",
          }}
          alt="profile picture"
        >
          {companyAvatar ? (
            <Image
              className="col-12"
              alt="لوگو شرکت"
               loading="lazy"
              src={mainUrl + companyAvatar}
            />
          ) : (
            <BiUser size={24} style={{ color: "#212121" }} />
          )}
        </Avatar>
        {isConfirmedCompany && (
          <div className="p-absolute" style={{ top: "55px", color: "#FB8C00" }}>
            <VerifiedIcon />
          </div>
        )}
      </div>
      <div className="col-4" style={{ opacity: "0.5" }}>
        <div className="row mx-0 col-12">
          <div className="col-9 px-0">
            <Typography className="fs-26 fw-500">{props.name}</Typography>
            <Typography className="fs-14 fw-500 greyColor2 mt-2">
              {props.shortIntroduction
                ? props.shortIntroduction.length > 200
                  ? props.shortIntroduction.slice(0, 200) + " ..."
                  : props.shortIntroduction
                : ""}
            </Typography>
          </div>
        </div>
      </div>
      <div className="col-2  text-end ">
        <Typography className="fs-12 fw-500">
          <LuClock3 className="mx-1" /> در انتظار تایید شرکت
        </Typography>
      </div>
      <div className="col-2  text-center d-flex gap-2">
        <Typography className="fs-12 fw-500 greyColor2">سمت : </Typography>
        <Typography className="fs-12 "> {props.positionStatus}</Typography>
        <IconButton
          style={{
            background: "transparent",
            padding: "0px",
            width: "20px",
            height: "20px ",
          }}
        >
          <HiOutlinePencil color="#0068ff" />
        </IconButton>
      </div>
      <div className="col-2  text-start ">
        {" "}
        <Button
          className="py-2 ps-4 pe-2"
          variant="outlined"
          sx={{
            border: "1px solid #E0E0E0",
            color: "#D32F2F",
            "&:hover": {
              // Adding hover style
              backgroundColor: "transparent", // Setting background color to transparent
              color: "#FB8C00",
              borderColor: "#FB8C00",
            },
          }}
          startIcon={<IoBan className=" ms-3" />}
        >
          انصراف
        </Button>
      </div>
    </div>
  );
}
