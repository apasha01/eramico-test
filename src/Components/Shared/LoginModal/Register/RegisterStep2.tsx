"use client";

import React, { useState } from "react";
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import {
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import logo from "../../../../app/img/logo.svg";
import LoadingButton from "@mui/lab/LoadingButton";
import { AiOutlineUser } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import useReset_PasswordApi from "@/Helpers/CustomHooks/auth/useReset_PasswordApi";
import { toast } from "react-toastify";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function RegisterStep2(props: {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  HandleSendUserNameToBackend: (type?: "counter") => Promise<"" | undefined>;
}) {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //complete register
  const { loading_Reset_Password, postData_Reset_Password } =
    useReset_PasswordApi();

  const HandleRegisterStep2 = async () => {
    props.ChangeState({
      ...props.State,
      isLoading: true,
    });
    if (!loading_Reset_Password) {
      if (
        !props.State.userName ||
        !props.State.passWord ||
        !props.State.ReEnteredPassWord
      ) {
        toast.warning("اطلاعات کامل کنید .");
        props.ChangeState({
          ...props.State,
          isLoading: false,
        });
      } else if (props.State.passWord !== props.State.ReEnteredPassWord) {
        toast.warning("رمز عبور و تکرار آن یکسان نیست.");
        props.ChangeState({
          ...props.State,
          isLoading: false,
        });
      } else {
        const data = await postData_Reset_Password({
          Email: props.State.userName,
          Password: props.State.passWord,
          ConfirmPassword: props.State.ReEnteredPassWord,
          Code: props.State.smsCode,
        });
        if (!data?.success) {
          toast.warning(data?.message ?? "اطلاعات وارد شده اشتباه است.");
          props.ChangeState({
            ...props.State,
            isLoading: false,
          });
        } else {
          props.ChangeState({
            ...props.State,
            mode: "Register",
            step: 3,
            isLoading: false,
          });
        }
      }
    }
  };

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
          }}
          className="m-auto"
          alt="profile picture"
          src={props.State.profilePictureUrl as any}
        >
          <AiOutlineUser />
        </Avatar>
      </div>
      <div className="col-12 text-center mt-2 fs-5 fw-bold">تکمیل ثبت‌ نام</div>
      <div className="col-12 text-center mt-3">
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
      <div className="col-12 mt-4">
        <label className="ff fs-13 fw-bold">
          یک رمز عبور برای خود تعیین کنید
        </label>
        <div className="col-12" style={{ marginTop: "-24px" }}>
          <div dir="ltr">
            <TextField
              className="col-12 text-center"
              variant="outlined"
              type={props.State.ShowPass ? "text" : "password"}
              value={props.State.passWord}
              autoComplete="off"
              onChange={(e) =>
                props.ChangeState({
                  ...props.State,
                  passWord: e.target.value,
                })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        props.ChangeState({
                          ...props.State,
                          ShowPass: !props.State.ShowPass,
                        })
                      }
                      edge="end"
                    >
                      {props.State.ShowPass ? (
                        <MdVisibility size={20} />
                      ) : (
                        <MdVisibilityOff size={20} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
      </div>
      <div className="col-12 mt-4">
        <label className="ff fs-13 fw-bold">
          تکرار رمز عبور جدید خود را وارد کنید
        </label>
        <div className="col-12" style={{ marginTop: "-24px" }}>
          <div dir="ltr">
            <TextField
              className="col-12 text-center"
              variant="outlined"
              type={showConfirmPassword ? "text" : "password"}
              value={props.State.ReEnteredPassWord}
              autoComplete="off"
              onChange={(e) =>
                props.ChangeState({
                  ...props.State,
                  ReEnteredPassWord: e.target.value,
                })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <MdVisibility size={20} />
                      ) : (
                        <MdVisibilityOff size={20} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
      </div>
      <div className="col-12" style={{ marginTop: "32px" }}>
        <LoadingButton
          className="col-12"
          size="large"
          variant="contained"
          loading={props.State.isLoading}
          onClick={HandleRegisterStep2}
        >
          ادامه
        </LoadingButton>
      </div>
    </div>
  );
}
