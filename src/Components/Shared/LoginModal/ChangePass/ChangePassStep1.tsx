"use client";
import React, { useState } from "react";
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import { Avatar, Chip, Typography } from "@mui/material";
import Image from "next/image";
import logo from "../../../../app/img/logo.svg";
import LoadingButton from "@mui/lab/LoadingButton";
import ReactInputVerificationCode from "react-input-verification-code";
import Countdown from "react-countdown";
import { mainUrl } from "@/Helpers/axiosInstance/constants";
import { BiUser } from "react-icons/bi";

export default function ChangePassStep1(props: {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  HandleSendUserNameAndVerificationCodeToBackendForgetPass: () => Promise<
    "" | undefined
  >;
  HandleSendUserNameToBackend: () => Promise<"" | undefined>;
}) {
  const [key, setKey] = useState(Date.now());
  return (
    <div className="px-0 px-md-5 px-lg-5 px-xl-5 ">
      <Typography
       
        variant="h6"
        component="h2"
        className="text-center mt-4"
      >
        <Image alt="LOGO" src={logo} />
      </Typography>
      <div className="col-12 text-center mt-4">
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
              alt="لوگو "
              loading="lazy"
              src={mainUrl + props.State.avatar}
            />
          ) : (
            <BiUser size={24} style={{ color: "#212121" }} />
          )}
        </Avatar>
      </div>
      <div className="col-12 text-center mt-2 fs-5 fw-bold">تغییر رمز عبور</div>
      <div className="col-12 text-center mt-3">
        <Chip variant="outlined" label={props.State.userName} dir="rtl" />
      </div>
      <div className="col-12 text-center fw-bold mt-3">
        لطفا کدی که به شما ارسال شده است را وارد کنید.
      </div>
      <div className="custom-styles col-12 mt-3" dir="ltr">
        <ReactInputVerificationCode
          onChange={(e) => props.ChangeState({ ...props.State, smsCode: e })}
          length={6}
          autoFocus
        />
      </div>
      <div className="col-12 mt-3">
        <LoadingButton
          className="col-12"
          size="large"
          variant="contained"
          loading={props.State.isLoading}
          onClick={
            props.HandleSendUserNameAndVerificationCodeToBackendForgetPass
          }
        >
          تایید
        </LoadingButton>
      </div>
      <div className="col-12 text-center mt-4 ff">
        {props.State.timer === "Started" ? (
          <div
            className="fs-9 fw-bold text-blue"
            onClick={() => {
              props.ChangeState({
                ...props.State,
                timer: "Completed",
              });
              props.HandleSendUserNameToBackend();
            }}
            style={{ cursor: "pointer" }}
          >
            ارسال مجدد کد
          </div>
        ) : (
          <span>
            زمان باقی مانده:{" "}
            <span>
              <Countdown
                key={key}
                date={key + 60000}
                renderer={(props) => <>{props.seconds}</>}
                onComplete={() => {
                  props.ChangeState({
                    ...props.State,
                    timer: "Started",
                  });
                }}
              />
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
