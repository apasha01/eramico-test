"use client";

import React from "react";
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import { Avatar, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Image from "next/image";
import logo from "../../../../app/img/logo.svg";
import { mainUrl } from "@/Helpers/axiosInstance/constants";
import { BiUser } from "react-icons/bi";

export default function ChangePassStep3(props: {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  setOpenModal: (value: boolean) => void;
}) {
  return (
    <div className="px-0 px-md-5 px-lg-5 px-xl-5 ">
      <Typography
       
        variant="h6"
        component="h2"
        className="text-center mt-4 "
      >
        <Image alt="LOGO" src={logo} />
      </Typography>
      <div className="col-12 text-center mt-5">
        <Avatar
          variant="circular"
          sx={{
            width: 56,
            height: 56,
            backgroundColor: "#F5F5F5",
            color: "#212121",
            border: "1px solid #F5F5F5",
          }}
          className="m-auto"
          alt="profile picture"
        >
          {props.State?.avatar ? (
            <Image
              className="col-12"
              loading="lazy"
              alt="لوگو "
              src={mainUrl + props.State.avatar}
            />
          ) : (
            <BiUser size={24} style={{ color: "#212121" }} />
          )}
        </Avatar>
      </div>

      <div className="col-12 text-center fw-bold mt-3">
        رمز عبور شما با موفقیت تغییر کرد.
      </div>

      <div className="col-12 mt-3">
        <Button
          className="col-12"
          size="large"
          variant="contained"
          onClick={() => {
            props.setOpenModal(false);
            props.ChangeState({
              ...props.State,
              passWord: "",
              ReEnteredPassWord: "",
              mode: "LoginByPass",
              step: 1,
            });
          }}
        >
          بستن
        </Button>
      </div>
    </div>
  );
}
