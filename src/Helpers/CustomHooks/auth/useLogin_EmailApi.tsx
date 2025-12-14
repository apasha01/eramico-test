import { useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { setToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import LoginStateReducer from "@/Helpers/Redux/Reducers/auth/LoginStateReducer";

export interface ILogin_Email_req {
  Email: string;
  Password: string;
}

export interface ILogin_Email_res extends IAPIResult<string> {}

function useLogin_EmailApi() {
  const [data_Login_Email, setDataLogin_Email] = useState<ILogin_Email_res>(
    {} as ILogin_Email_res
  );
  const [loading_Login_Email, setLoading_Login_Email] = useState(false);
  const [error_Login_Email, setError_Login_Email] = useState<string | null>(
    null
  );

  const postData_Login_Email = async (body: ILogin_Email_req) => {
    try {
      setLoading_Login_Email(true);
      const response = await axiosInstance.post<ILogin_Email_res>(
        `auth/login-email?Email=${body.Email}&Password=${body.Password}`
      );
      setDataLogin_Email((prevData) => ({
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
        setError_Login_Email(err.message);
        return null;
      } else {
        setError_Login_Email("An unknown error occurred");
        return null;
      }
    } finally {
      setLoading_Login_Email(false);
    }
  };

  return {
    data_Login_Email,
    loading_Login_Email,
    error_Login_Email,
    postData_Login_Email,
  };
}

export default useLogin_EmailApi;
