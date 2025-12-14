"use client";
import LoadingButton from "@mui/lab/LoadingButton";
import { Avatar, Button, Chip, Typography } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import Countdown from "react-countdown";
import { AiOutlineUser } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import ReactInputVerificationCode from "react-input-verification-code";
import logo from "../../../../app/img/logo.svg";
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import { APP_NAME } from "@/lib/metadata";

export default function LoginStep2(props: {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  loading_Login_Phone: boolean;
  HandleSendUserNameAndVerificationCodeToBackend: () => Promise<"" | undefined>;
  HandleSendUserNameToBackend: (type?: "counter") => Promise<"" | undefined>;
}) {
  const [key, setKey] = useState(Date.now() + 60000);
  return (
    <div className="px-0 px-md-5 px-lg-5 px-xl-5 " dir="rtl">
      <Typography variant="h6" component="h2" className="text-center mt-4">
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
          }}
          className="m-auto"
          alt="profile picture"
          src={props.State.profilePictureUrl as any}
        >
          <AiOutlineUser />
        </Avatar>
      </div>
      <div className="col-12 text-center mt-2 fs-5 fw-bold">
        ورود به {APP_NAME}
      </div>
      <div className="col-12 text-center mt-3">
        <Chip
          variant="outlined"
          label={props.State.userName}
          onClick={() => {
            props.ChangeState({
              ...props.State,
              step: 1,
            });
          }}
          dir="rtl"
          icon={<BiPencil />}
        />
      </div>
      <div className="col-12 text-center fw-bold mt-3">
        لطفا کدی که به شما ارسال شده است را وارد کنید.
      </div>
      <div className="custom-styles col-12 mt-3" dir="ltr">
        <ReactInputVerificationCode
          onChange={(e) =>
            props.ChangeState({
              ...props.State,
              smsCode: e,
            })
          }
          length={6}
          autoFocus
        />
      </div>
      <div className="col-12 mt-3">
        <LoadingButton
          className="col-12"
          size="large"
          variant="contained"
          loading={props.loading_Login_Phone}
          onClick={props.HandleSendUserNameAndVerificationCodeToBackend}
        >
          تایید
        </LoadingButton>
      </div>
      <div className="col-12 text-center mt-4 ff">
        {props.State.timer === "Started" ? (
          <div
            className="fs-9 fw-bold text-blue"
            onClick={() => {
              setKey(Date.now() + 60000);
              props.ChangeState({
                ...props.State,
                timer: "Completed",
              });
              props.HandleSendUserNameToBackend("counter");
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
                date={key}
                intervalDelay={10}
                renderer={(props) => <>{props.seconds}</>}
                onComplete={(e) => {
                  if (e.completed) {
                    props.ChangeState({
                      ...props.State,
                      timer: "Started",
                    });
                  }
                }}
              />
            </span>
          </span>
        )}
      </div>
      <div className="col-12 text-center mt-4 ff">
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
    </div>
  );
}
