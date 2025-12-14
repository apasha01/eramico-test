"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, Button, IconButton, Typography } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import styles from "./styles.module.css";
import { BiUser } from "react-icons/bi";
import { mainUrl } from "@/Helpers/axiosInstance/constants";
import { TbTrash } from "react-icons/tb";

export default function EditMemberCard(props: {
  id: number;
  name: string;
  IsConfirmed: boolean;
  avatar: string | null;
  positionStatus: string;
  phoneNumber: string;
  state: string;
}) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isConfirmedProfile, setIsConfirmedProfile] = useState(false);

  useEffect(() => {
    setIsConfirmedProfile(props.IsConfirmed);
    setAvatar(props?.avatar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.MemberCompanyStyle} style={{ border: "none" }}>
      <div className="d-flex gap-2">
        <div className="px-0 mx-0 position-relative">
          <Avatar
            variant={"circular"}
            sx={{
              width: 42,
              height: 42,
              backgroundColor: "#fff ",
              color: "#212121",
              border: "1px solid #F5F5F5",
            }}
            alt="profile picture"
          >
            {avatar ? (
              <Image
                className="col-12"
                 loading="lazy"
                alt="لوگو شرکت"
                src={mainUrl + avatar}
              />
            ) : (
              <BiUser size={24} style={{ color: "#212121" }} />
            )}
          </Avatar>
          {isConfirmedProfile && (
            <div
              className="p-absolute"
              style={{ top: "25px", color: "#548FED" }}
            >
              <VerifiedIcon sx={{ fontSize: "16px" }} />
            </div>
          )}
        </div>
        <div className="col-12 mx-0 px-0">
          <div className="d-flex gap-2 align-items-center mx-0  mt-0">
            <Typography className="fs-16 fw-500">{props.name}</Typography>
          </div>
          <div className="d-flex gap-2 align-items-center mx-0  mt-0">
            <div>
              <Typography className="fs-13 fw-500 greyColor2 mt-0">
                {props.phoneNumber}
              </Typography>
            </div>
            <div>
              <Typography className="fs-18 fw-500 greyColor2 mb-1">
                .
              </Typography>
            </div>
            <div>
              <Typography className="fs-13 fw-500 greyColor2 mt-0">
                {props.positionStatus}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex gap-3 align-items-center">
        <Button
          className="py-2 px-4 bg-transparent"
          variant="outlined"
          sx={{
            border: "1px solid #E0E0E0",
            color: "#424242",
            "&:hover": {
              color: "#FB8C00",
              borderColor: "#FB8C00",
            },
          }}
        >
          ویرایش دسترسی
        </Button>
        <IconButton
          style={{
            border: "1px solid #E0E0E0",
            width: "36px",
            height: "36px ",
            backgroundColor: "#fff ",
            padding: "4px",
          }}
        >
          <TbTrash color="#757575" />
        </IconButton>
      </div>
    </div>
  );
}
