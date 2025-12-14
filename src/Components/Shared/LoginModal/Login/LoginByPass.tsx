"use client";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import logo from "../../../../app/img/logo.svg";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import { toast } from "react-toastify";
import { APP_NAME } from "@/lib/metadata";

interface LoginByPassProps {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  HandleSendUserNameAndPassToBackend: () => Promise<"" | undefined>;
  HandleForgetPassword: () => Promise<"" | undefined>;
}

const LoginByPass = ({
  State,
  ChangeState,
  HandleSendUserNameAndPassToBackend,
  HandleForgetPassword,
}: LoginByPassProps) => {
  return (
    <div className="px-0 px-md-5 px-lg-5 px-xl-5 " dir="rtl">
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
          src={State.profilePictureUrl as any}
        >
          <AiOutlineUser />
        </Avatar>
      </div>
      <h6 className="col-12 text-center mt-4 fs-19 fw-500">
        ورود به {APP_NAME}
      </h6>
      <div className="col-12 text-center mt-4">
        <Chip
          variant="outlined"
          label={State.userName}
          onClick={() => {
            ChangeState({
              ...State,
              step: 1,
              mode: "Login",
            });
          }}
          dir="rtl"
          icon={<BiPencil />}
        />
      </div>
      <Typography className="mt-4 text-center fs-14 fw-500">
        رمز عبور خود را وارد کنید.
      </Typography>
      <div className="col-12 mt-4" style={{ marginTop: "-10px" }}>
        <div>
          <TextField
            className="col-12 text-center eng"
            variant="outlined"
            type={State.ShowPass ? "text" : "password"}
            value={State.passWord}
            autoComplete="off"
            onChange={(e) =>
              ChangeState({
                ...State,
                passWord: e.target.value,
              })
            }
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                HandleSendUserNameAndPassToBackend();
              }
            }}
            inputProps={{
              style: {
                textAlign: "center",
                fontSize: "16px",
                height: "14px",
                borderRadius: "8px",
                direction: "ltr",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: "48px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      ChangeState({
                        ...State,
                        ShowPass: !State.ShowPass,
                      })
                    }
                    edge="end"
                  >
                    {State.ShowPass ? (
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
      <div className="col-12  mt-4">
        <Typography
          className="mt-2 text-center fs-14 fw-500 text-grey"
          onClick={() => {
            if (State.userName) {
              HandleForgetPassword();
            } else {
              toast.warning("لطفا نام کاربری را وارد نمایید.");
            }
          }}
          style={{ cursor: "pointer" }}
        >
          ورود با کد یک بار مصرف
        </Typography>
      </div>
      <div className="col-12 mt-4">
        <LoadingButton
          className="col-12"
          size="large"
          variant="contained"
          loading={State.isLoading}
          onClick={HandleSendUserNameAndPassToBackend}
        >
          ورود
        </LoadingButton>
      </div>
    </div>
  );
};

export default LoginByPass;
