"use client";

import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import React from "react";
import ForgetPassStep1 from "./ForgetPassStep1";
import ForgetPassStep2 from "./ForgetPassStep2";
import ForgetPassStep3 from "./ForgetPassStep3";
import { toast } from "react-toastify";
import useReset_PasswordApi from "@/Helpers/CustomHooks/auth/useReset_PasswordApi";
import useVerify_PhoneApi from "@/Helpers/CustomHooks/auth/useVerify_PhoneApi";
import useVerify_EmailApi from "@/Helpers/CustomHooks/auth/useVerify_EmailApi";
import { useRouter } from "next/navigation";

//all the forget password in the component need revised
export default function ForgetPass(props: {
  State: ILoginRegister;
  ChangeState: React.Dispatch<ILoginRegister>;
  HandleSendUserNameToBackend: (type?: "counter") => Promise<"" | undefined>;
  setOpenModal: (value: boolean) => void;
}) {
  const { loading_Verify_Email, postData_Verify_Email } = useVerify_EmailApi();
  const { loading_Verify_Phone, postData_Verify_Phone } = useVerify_PhoneApi();
  const { loading_Reset_Password, postData_Reset_Password } =
    useReset_PasswordApi();

  const router = useRouter();

  const HandleSendUserNameAndVerificationCodeToBackendForgetPass = async () => {
    const { userName, smsCode, mode_message } = props.State;
    props.ChangeState({
      ...props.State,
      isLoading: true,
    });
    if (userName === "") {
      toast.warning("لطفا کدی که به شما ارسال شده است را وارد کنید.");
      props.ChangeState({
        ...props.State,
        isLoading: false,
      });
      return "";
    }

    const postData = async (postDataFunction: any, data: any) => {
      const result = await postDataFunction(data);

      if (!result?.success) {
        toast.warning(result?.message || "لطفا اطلاعات به درستی وارد کنید.");
        props.ChangeState({
          ...props.State,
          isLoading: false,
        });
      } else {
        if (mode_message === "user-phone") {
          toast.success(" ورود با موفقیت انجام شد.");
          props.setOpenModal(false);
          props.ChangeState({
            ...props.State,
            isLoading: false,
          });
          window.location.reload();
          return;
        }
        props.ChangeState({
          ...props.State,
          mode: "ForgetPass",
          step: 2,
          isLoading: false,
        });
      }
    };

    if (!loading_Verify_Email && mode_message === "user-email") {
      await postData(postData_Verify_Email, {
        Email: userName,
        Password: String(smsCode),
      });
    } else if (!loading_Verify_Phone && mode_message === "user-phone") {
      await postData(postData_Verify_Phone, {
        Phone: userName,
        Token: String(smsCode),
      });
    }
  };

  const HandleResetPassword = async () => {
    if (!loading_Reset_Password) {
      if (
        !props.State.userName ||
        !props.State.passWord ||
        !props.State.ReEnteredPassWord
      ) {
        toast.warning("اطلاعات کامل کنید .");
      } else if (props.State.passWord !== props.State.ReEnteredPassWord) {
        toast.warning("رمز عبور و تکرار آن یکسان نیست.");
      } else {
        const data = await postData_Reset_Password({
          Email: props.State.userName,
          Password: props.State.passWord,
          ConfirmPassword: props.State.ReEnteredPassWord,
          Code: props.State.smsCode,
        });
        if (!data?.success) {
          toast.warning(data?.message ?? "اطلاعات وارد شده اشتباه است.");
        } else {
          props.ChangeState({
            ...props.State,
            mode: "ForgetPass",
            step: 3,
          });
        }
      }
    }
  };

  return (
    <div>
      {props.State.step === 1 && (
        <ForgetPassStep1
          {...props}
          HandleSendUserNameToBackend={props.HandleSendUserNameToBackend}
          HandleSendUserNameAndVerificationCodeToBackendForgetPass={
            HandleSendUserNameAndVerificationCodeToBackendForgetPass
          }
        />
      )}
      {props.State.step === 2 && (
        <ForgetPassStep2 {...props} HandleResetPassword={HandleResetPassword} />
      )}
      {props.State.step === 3 && (
        <ForgetPassStep3 {...props} setOpenModal={props.setOpenModal} />
      )}
    </div>
  );
}
