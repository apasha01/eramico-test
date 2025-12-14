"use client";

import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import { TextField, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import logo from "../../../../app/img/logo.svg";
import LoadingButton from "@mui/lab/LoadingButton";
import LoaderComponent from "@/Components/LoaderComponent";
import { APP_NAME } from "@/lib/metadata";

export default function LoginStep1(props: {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  loading_Entry: boolean;
  HandleSendUserNameToBackend: () => Promise<"" | undefined>;
  HandleForgetPassword: () => Promise<"" | undefined>;
}) {
  return (
    <Suspense fallback={<LoaderComponent />}>
      <div className="px-0 px-md-5 px-lg-5 px-xl-5 " dir="ltr">
        <Typography
         
          className="text-center mt-0 fw-500 fs-19"
        >
          <Image alt="LOGO" src={logo} />
        </Typography>
        <Typography
          className=" text-center fs-19 fw-500"
          id="modal-modal-description"
          style={{ marginTop: "87px" }}
        >
          ورود / ثبت‌نام
        </Typography>
        <p className="col-12 fs-14 fw-500 t mt-4">
          .شماره تلفن همراه، ایمیل یا نام کاربری خود را وارد کنید
        </p>
        <div className="col-12 mt-3" dir="ltr">
          <TextField
            className="col-12 text-center rounded"
            variant="outlined"
            value={props.State.userName}
            autoComplete="off"
            onChange={(e) =>
              props.ChangeState({
                ...props.State,
                userName: e.target.value,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                props.HandleSendUserNameToBackend();
              }
            }}
            inputProps={{
              style: {
                textAlign: "center",
                fontSize: "16px",
                height: "14px",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: "48px",
              },
            }}
          />
        </div>
        {/* <div className="col-12  mt-3">
            <Typography
              className="fs-13"
              fontWeight="light"
              onClick={() => {
                if (props.State.userName) {
                  props.HandleForgetPassword();
                } else {
                  toast.warning("لطفا نام کاربری را وارد نمایید.");
                }
              }}
              style={{ cursor: "pointer" }}
            >
              رمز عبور خود را فراموش کرده‌اید؟
            </Typography>
          </div> */}
        <div className="col-12 mt-4">
          <LoadingButton
            className="col-12"
            size="large"
            variant="contained"
            loading={props.loading_Entry}
            disabled={props.loading_Entry}
            onClick={props.HandleSendUserNameToBackend}
          >
            {props.loading_Entry ? "در حال ارسال" : "ادامه"}
          </LoadingButton>
        </div>
      </div>
      <div
        className="ff text-center fw-500 fs-14 mt-5"
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Link href="/policy"> قوانین استفاده از {APP_NAME}</Link>
        <span> را خوانده و قبول دارم</span>
      </div>
    </Suspense>
  );
}
