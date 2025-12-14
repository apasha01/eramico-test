"use client";

import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import React from "react";
import dynamic from "next/dynamic";
import useLoginGeneral from "@/Helpers/CustomHooks/auth/useLoginGeneral";
import { toast } from "react-toastify";
import useLogin_PhoneApi from "@/Helpers/CustomHooks/auth/useLogin_PhoneApi";
import useForget_PasswordApi from "@/Helpers/CustomHooks/auth/useForget_PasswordApi";
import { useRouter } from "next/navigation";

const LoginStep1 = dynamic(() => import("./LoginStep1"));
const LoginStep2 = dynamic(() => import("./LoginStep2"));
const LoginByPass = dynamic(() => import("./LoginByPass"));

export default function Login(props: {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  HandleSendUserNameToBackend: (type?: "counter") => Promise<"" | undefined>;
  setOpenModal: (value: boolean) => void;
  loading_Entry: boolean;
}) {
  const { loading_LoginGeneral, postData_LoginGeneral } = useLoginGeneral();
  const { loading_Login_Phone, postData_Login_Phone } = useLogin_PhoneApi();
  const { loading_Forget_Password, postData_Forget_Password } =
    useForget_PasswordApi();
  const router = useRouter();
  

  const HandleSendUserNameAndPassToBackend = async () => {
    props.ChangeState({
      ...props.State,
      isLoading: true,
    });
    if (props.State.userName === "" || props.State.passWord === "") {
      toast.warning("لطفا نام کاربری و رمز عبور خود را به درستی وارد کنید.");
      props.ChangeState({
        ...props.State,
        isLoading: false,
      });
      return "";
    }
    if (!loading_LoginGeneral) {
      const data = await postData_LoginGeneral({
        Username: props.State.userName,
        Password: String(props.State.passWord),
      });
      if (!data?.success) {
        toast.warning(data?.message || "لطفا اطلاعات به درستی وارد کنید.");
        props.ChangeState({
          ...props.State,
          isLoading: false,
        });
      } else {
        toast.success(" ورود با موفقیت انجام شد.");
        props.ChangeState({
          ...props.State,
          isLoading: false,
        });
        props.setOpenModal(false);
        window.location.reload();
      }
    }
  };

  const HandleSendUserNameAndVerificationCodeToBackend = async () => {
    if (props.State.userName === "" || props.State.smsCode === "······") {
      toast.warning("لطفا کدی که به شما ارسال شده است را وارد کنید.");
      return "";
    }
    if (!loading_Login_Phone) {
      const data = await postData_Login_Phone({
        Phone: props.State.userName,
        Token: String(props.State.smsCode),
      });
      if (!data?.success) {
        toast.warning("کد وارد شده اشتباه است.");
      } else {
        toast.success(" ورود با موفقیت انجام شد.");
        props.setOpenModal(false);
        window.location.reload();
      }
    }
  };

  const HandleForgetPassword = async () => {
    if (props.State.userName === "") {
      toast.warning("لطفا نام کاربری خود را به درستی وارد کنید.");
      return "";
    }
    if (!loading_Forget_Password) {
      const data = await postData_Forget_Password({
        Username: props.State.userName,
      });
      if (!data?.success) {
        toast.warning(data?.message || "لطفا اطلاعات به درستی وارد کنید.");
      } else {
        if (data.message === "new-username") {
          toast.warning(
            "هیچ ایمیل یا شماره تلفنی برای این اکانت ثبت نشده است. لطفاً مجدداً ثبت‌نام کنید یا با پشتیبانی تماس بگیرید."
          );

          props.setOpenModal(false);
          return;
        }
        props.ChangeState({
          ...props.State,
          mode_message: data.message as any,
          step: 1,
          mode: "ForgetPass",
        });
      }
    }
  };

  return (
    <div dir="rtl">
      {props.State.mode === "LoginByPass" ? (
        <LoginByPass
          {...props}
          HandleSendUserNameAndPassToBackend={
            HandleSendUserNameAndPassToBackend
          }
          HandleForgetPassword={HandleForgetPassword}
        />
      ) : (
        <>
          {props.State.step === 1 && (
            <LoginStep1
              {...props}
              HandleSendUserNameToBackend={props.HandleSendUserNameToBackend}
              HandleForgetPassword={HandleForgetPassword}
              loading_Entry={props.loading_Entry}
            />
          )}
          {props.State.step === 2 && (
            <LoginStep2
              {...props}
              HandleSendUserNameToBackend={props.HandleSendUserNameToBackend}
              loading_Login_Phone={loading_Login_Phone}
              HandleSendUserNameAndVerificationCodeToBackend={
                HandleSendUserNameAndVerificationCodeToBackend
              }
            />
          )}
        </>
      )}
    </div>
  );
}
