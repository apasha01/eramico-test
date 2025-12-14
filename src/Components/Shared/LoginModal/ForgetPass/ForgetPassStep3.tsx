'use client';
import React, { useState } from "react";
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import { Avatar, Chip, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Image from "next/image";
import logo from "../../../../app/img/logo.svg";
import LoadingButton from "@mui/lab/LoadingButton";
import { AiOutlineUser } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import ReactInputVerificationCode from "react-input-verification-code";
import Countdown from "react-countdown";
import { MdOutlineDone } from "react-icons/md";

export default function ForgetPassStep3(props: {
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
            backgroundColor: "rgba(0, 200, 83, 0.08)",
            color: "rgba(0, 200, 83, 1)",
          }}
          className="m-auto "
          alt="profile picture"
          src={props.State.profilePictureUrl as any}
        >
          <MdOutlineDone size={24} />
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
          ورود
        </Button>
      </div>
    </div>
  );
}
