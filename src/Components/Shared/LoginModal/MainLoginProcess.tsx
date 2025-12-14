import React, { useState } from "react";
import { ILoginRegister } from "@/Helpers/ComponentsInterface/ILoginRegister";
import { toast } from "react-toastify";
import face from "../../../app/img/face.jpg";
import useEntryApi from "@/Helpers/CustomHooks/auth/useEntryApi";
import dynamic from "next/dynamic";
const Register = dynamic(() => import("./Register"));
const Login = dynamic(() => import("./Login"));
const ForgetPass = dynamic(() => import("./ForgetPass"));
const ChangePass = dynamic(() => import("./ChangePass"));

interface MainLoginProcessProps {
  setOpenModal: (value: boolean) => void;
  step?: "Login" | "Register" | "ForgetPass" | "LoginByPass" | "ChangePass";
  userName?: string;
}

export default function MainLoginProcess({
  setOpenModal,
  step,
  userName,
}: MainLoginProcessProps) {
  const [LoginRegisterState, setLoginRegisterState] = useState<ILoginRegister>({
    mode: step ?? "Login", //Register, ForgetPass, Login, LoginByPass, ChangePass
    mode_message: "new-phone",
    smsCode: "",
    isLoading: false,
    step: 1,
    userName: userName ?? "",
    timer: "Completed",
    profilePictureUrl: face,
    ShowPass: false,
    fieldOfActivity: [],
  });
  const { loading_Entry, postData_Entry } = useEntryApi();

  const updateLoginRegisterState = (newItem: Partial<ILoginRegister>): void => {
    setLoginRegisterState((prevState) => ({
      ...prevState,
      ...newItem,
    }));
  };

  const HandleSendUserNameToBackend = async (
    type?: "counter" | "request" | undefined
  ) => {
    if (LoginRegisterState.userName === "") {
      toast.warning("شماره موبایل، ایمیل یا نام کاربری خود را وارد کنید.");
      return "";
    }
    if (!loading_Entry) {
      const data = await postData_Entry({
        Username: LoginRegisterState.userName,
      });
      //if the clock counter to send again reset return
      if (type === "counter") {
        return;
      }
      if (!data?.success || !data?.message) {
        toast.warning("خطایی رخ داده است لطفا مجددا تلاش کنید.");
        return;
      }
      if (data?.message && data?.message?.split("-")[0] === "user") {
        // already registerd user
        setLoginRegisterState({
          ...LoginRegisterState,
          mode: "LoginByPass",
          name: data?.data?.fullName,
          avatar: data?.data?.avatar,
          step: 1,
        });
      } else if (data?.message?.split("-")[0] === "new") {
        // new registerd user
        if (data?.message === "new-phone" || data?.message === "new-email") {
          setLoginRegisterState({
            ...LoginRegisterState,
            mode: "Register",
            mode_message: data?.message as any,
            step: 1,
          });
        } else if (data?.message === "new-username") {
          toast.warning(
            "نام کاربری وجود ندارد.لطفا ابتدا با موبایل یا ایمیل ثبت نام کنید."
          );
        }
      }
    }
  };

  let currentComponent;
  switch (LoginRegisterState.mode) {
    case "Login":
      currentComponent = (
        <Login
          State={LoginRegisterState}
          ChangeState={updateLoginRegisterState}
          HandleSendUserNameToBackend={HandleSendUserNameToBackend}
          setOpenModal={setOpenModal}
          loading_Entry={loading_Entry}
        />
      );
      break;
    case "Register":
      currentComponent = (
        <Register
          State={LoginRegisterState}
          ChangeState={updateLoginRegisterState}
          HandleSendUserNameToBackend={HandleSendUserNameToBackend}
          setOpenModal={setOpenModal}
        />
      );
      break;
    case "ForgetPass":
      currentComponent = (
        <ForgetPass
          State={LoginRegisterState}
          ChangeState={updateLoginRegisterState}
          HandleSendUserNameToBackend={HandleSendUserNameToBackend}
          setOpenModal={setOpenModal}
        />
      );
      break;
    case "ChangePass":
      currentComponent = (
        <ChangePass
          State={LoginRegisterState}
          ChangeState={updateLoginRegisterState}
          HandleSendUserNameToBackend={HandleSendUserNameToBackend}
          setOpenModal={setOpenModal}
        />
      );
      break;
    default:
      //LoginByPass
      currentComponent = (
        <Login
          State={LoginRegisterState}
          ChangeState={updateLoginRegisterState}
          HandleSendUserNameToBackend={HandleSendUserNameToBackend}
          setOpenModal={setOpenModal}
          loading_Entry={loading_Entry}
        />
      );
      break;
  }

  return (
    <div style={{ maxWidth: "402px", marginInline: "auto" }}>
      {currentComponent}
    </div>
  );
}
