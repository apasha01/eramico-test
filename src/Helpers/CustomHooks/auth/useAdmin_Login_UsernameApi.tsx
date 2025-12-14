import { useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { setToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import LoginStateReducer from "@/Helpers/Redux/Reducers/auth/LoginStateReducer";

export interface IAdmin_Login_Username_req {
  Username: string;
  Password: string;
}

export interface IAdmin_Login_Username_res extends IAPIResult<string> {}

function useAdmin_Login_UsernameApi() {
  const [data_Admin_Login_Username, setDataAdmin_Login_Username] =
    useState<IAdmin_Login_Username_res>({} as IAdmin_Login_Username_res);
  const [loading_Admin_Login_Username, setAdmin_Login_Username] =
    useState(false);
  const [error_Admin_Login_Username, setError_Admin_Login_Username] = useState<
    string | null
  >(null);

  const postData_Admin_Login_Username = async (
    body: IAdmin_Login_Username_req
  ) => {
    try {
      setAdmin_Login_Username(true);
      const response = await axiosInstance.post<IAdmin_Login_Username_res>(
        `auth/admin-login-username?Username=${body.Username}&Password=${body.Password}`
      );
      setDataAdmin_Login_Username((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      if (response.data.success) {
        setToken_Localstorage(String(response.data.token));
        LoginStateReducer(
          {
            loginstate: true,
            Token: String(response.data.token),
            ExpireDate: 1,
          },
          "SetLogin"
        );
      }
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError_Admin_Login_Username(err.message);
        return null;
      } else {
        setError_Admin_Login_Username("An unknown error occurred");
        return null;
      }
    } finally {
      setAdmin_Login_Username(false);
    }
  };

  return {
    data_Admin_Login_Username,
    loading_Admin_Login_Username,
    error_Admin_Login_Username,
    postData_Admin_Login_Username,
  };
}

export default useAdmin_Login_UsernameApi;
