import { StaticImageData } from "next/image";

export interface ILoginRegister {
  mode: "Login" | "LoginByPass" | "Register" | "ForgetPass" | "ChangePass";
  //TODO: need to add otherstrings
  mode_message?:
    | ""
    | "new-phone"
    | "new-email"
    | "new-username"
    | "user-phone"
    | "user-email"
    | "user-username";
  step: number;
  profilePictureUrl?: string | StaticImageData;
  userName: string;
  passWord?: string;
  ReEnteredPassWord?: string;
  ShowPass?: boolean;
  smsCode?: string;
  name?: string;
  family?: string;
  IsCompany?: boolean;
  companyName?: string;
  CompanyId?: number;
  positionId?: string;
  fieldOfActivity: number[];
  timer?: "Completed" | "Started";
  isLoading: boolean;
  avatar?: any;
}
