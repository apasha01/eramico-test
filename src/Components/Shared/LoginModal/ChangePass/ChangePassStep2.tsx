"use client";

import React, { useState } from "react";
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import {
  Avatar,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import logo from "../../../../app/img/logo.svg";
import LoadingButton from "@mui/lab/LoadingButton";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { mainUrl } from "@/Helpers/axiosInstance/constants";
import { BiUser } from "react-icons/bi";

export default function ChangePassStep2(props: {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  HandleResetPassword: () => Promise<void>;
}) {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      
              src={mainUrl + props.State.avatar}
            />
          ) : (
            <BiUser size={24} style={{ color: "#212121" }} />
          )}
        </Avatar>
      </div>
      <div className="col-12 text-center mt-2 fs-5 fw-bold">تغییر رمز عبور</div>
      <div className="col-12 mt-3">
        <label className="ff fs-13 fw-bold" htmlFor="pass">
          رمز عبور جدید خود را وارد کنید.
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
        <label className="ff fs-13 fw-bold" htmlFor="pass">
          تکرار رمز عبور جدید خود را وارد کنید.
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
      <div className="col-12 mt-4">
        <LoadingButton
          className="col-12 mt-3"
          size="large"
          variant="contained"
          loading={props.State.isLoading}
          onClick={() => props.HandleResetPassword()}
        >
          تغییر رمز عبور
        </LoadingButton>
      </div>
    </div>
  );
}
