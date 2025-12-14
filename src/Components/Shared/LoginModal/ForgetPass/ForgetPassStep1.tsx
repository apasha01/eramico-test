"use client";

import React, { useState } from "react";
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import { Avatar, Chip, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Image from "next/image";
import logo from "../../../../app/img/logo.svg";
import LoadingButton from "@mui/lab/LoadingButton";
import { AiOutlineUser } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import ReactInputVerificationCode from "react-input-verification-code";
import Countdown from "react-countdown";
import { APP_NAME } from "@/lib/metadata";

export default function ForgetPassStep1(props: {
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
      <Typography variant="h6" component="h2" className="text-center mt-0">
        <Image alt="LOGO" src={logo} loading="lazy" />
      </Typography>
      <div className="col-12 text-center mt-4">
        <Avatar
          variant="circular"
          sx={{
            width: 64,
            height: 64,
            backgroundColor: "#F5F5F5",
            color: "#212121",
            border: "1px solid #E0E0E0",
          }}
          className="m-auto"
          alt="profile picture"
          src={props.State.profilePictureUrl as any}
        >
          <AiOutlineUser />
        </Avatar>
      </div>
      <h6 className="col-12 text-center mt-3 fs-19 fw-500">
        ورود به {APP_NAME}
      </h6>
      <div className="col-12 text-center mt-4 ">
        <Chip
          variant="outlined"
          label={props.State.userName}
          onClick={() => {
            props.ChangeState({ ...props.State, step: 1 });
          }}
          dir="rtl"
          icon={<BiPencil />}
        />
      </div>
      <h6 className="col-12 text-center fs-14 fw-500 mt-4 pt-3">
        لطفا کدی ۶ رقمی که به شما ارسال شده است را وارد نمایید.
      </h6>
      <div className="custom-styles col-12 mt-4" dir="ltr">
        <ReactInputVerificationCode
          onChange={(e) => props.ChangeState({ ...props.State, smsCode: e })}
          length={6}
          autoFocus
        />
      </div>
      <div className="col-12 text-center mt-4 text-grey">
        <Button
          className="col-12"
          variant="text"
          onClick={() => {
            props.ChangeState({
              ...props.State,
              mode: "LoginByPass",
              step: 1,
            });
          }}
        >
          ورود با رمز عبور
        </Button>
      </div>
      <div className="col-12 mt-4">
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

      <div className="col-12 text-center mt-4 mb-3 ff">
        {props.State.timer === "Started" ? (
          <div
            className="fs-14 fw-bold text-blue"
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
