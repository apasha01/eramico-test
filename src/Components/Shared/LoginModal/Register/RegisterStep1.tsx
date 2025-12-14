"use client";
import React, { useState } from "react";
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import { Avatar, Chip, Typography } from "@mui/material";
import Image from "next/image";
import logo from "../../../../app/img/logo.svg";
import LoadingButton from "@mui/lab/LoadingButton";
import { AiOutlineUser } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import ReactInputVerificationCode from "react-input-verification-code";
import Countdown from "react-countdown";
import useVerify_EmailApi from "@/Helpers/CustomHooks/auth/useVerify_EmailApi";
import { toast } from "react-toastify";
import useVerify_PhoneApi from "@/Helpers/CustomHooks/auth/useVerify_PhoneApi";
import { APP_NAME } from "@/lib/metadata";

export default function RegisterStep1(props: {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  HandleSendUserNameToBackend: (type?: "counter") => Promise<"" | undefined>;
}) {
  const [key, setKey] = useState(Date.now());
  //verify login email
  const { loading_Verify_Email, postData_Verify_Email } = useVerify_EmailApi();
  const { loading_Verify_Phone, postData_Verify_Phone } = useVerify_PhoneApi();

  const HandleRegisterStep1 = async () => {
    const { userName, smsCode, mode_message } = props.State;
    props.ChangeState({
      ...props.State,
      isLoading: false,
    });
    if (!loading_Verify_Email && mode_message === "new-email") {
      const data = await postData_Verify_Email({
        Email: userName,
        Password: String(smsCode),
      });

      handleVerificationResult(data);
      return;
    }

    if (!loading_Verify_Phone) {
      const data = await postData_Verify_Phone({
        Phone: userName,
        Token: String(smsCode),
      });

      handleVerificationResult(data);
    }
  };

  const handleVerificationResult = (data: any) => {
    if (!data?.success) {
      toast.warning("کد وارد شده اشتباه است.");
    } else {
      if (props.State.mode_message === "new-email") {
        props.ChangeState({
          ...props.State,
          mode: "Register",
          step: 3, // it change step 2 was removed
        });
      } else {
        props.ChangeState({
          ...props.State,
          mode: "Register",
          step: 3,
        });
      }
    }
  };

  return (
    <div className="px-0 px-md-5 px-lg-5 px-xl-5 ">
      <Typography variant="h6" component="h2" className="text-center mt-0">
        <Image alt="LOGO" src={logo} />
      </Typography>
      <div className="col-12 text-center mt-5">
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
        ثبت نام در {APP_NAME}
      </h6>
      <div className="col-12 text-center mt-4 ">
        <Chip
          variant="outlined"
          label={props.State.userName}
          onClick={() => {
            props.ChangeState({
              ...props.State,
              mode: "Login",
              step: 1,
            });
          }}
          dir="rtl"
          icon={<BiPencil />}
        />
      </div>
      <h6 className="col-12 text-center fs-14 fw-500 mt-4 pt-3">
        لطفا کدی ۶ رقمی که به شما ارسال شده است را وارد نمایید.
      </h6>
      <div className="custom-styles col-12 mt-3" dir="ltr">
        <ReactInputVerificationCode
          onChange={(e) => props.ChangeState({ ...props.State, smsCode: e })}
          length={6}
          autoFocus
        />
      </div>
      <div className="col-12 mt-4">
        <LoadingButton
          className="col-12"
          size="large"
          variant="contained"
          loading={loading_Verify_Email}
          onClick={HandleRegisterStep1}
        >
          تایید
        </LoadingButton>
      </div>
      <div
        className="col-12 text-center mt-4 ff"
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {props.State.timer === "Started" ? (
          <div
            className="fs-14 fw-bold text-blue"
            style={{ cursor: "pointer" }}
            onClick={() => {
              props.ChangeState({
                ...props.State,
                timer: "Completed",
              });
              setKey(Date.now()); // Update the key to restart the countdown
              props.HandleSendUserNameToBackend();
            }}
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
