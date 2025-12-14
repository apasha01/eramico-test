import { useState } from "react";

import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { setToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import LoginStateReducer from "@/Helpers/Redux/Reducers/auth/LoginStateReducer";

export interface IReset_Password_req {
  Email: string;
  Password: string;
  ConfirmPassword: string;
  Code?: string;
}

// Define the response interface
export interface IReset_Password_res extends IAPIResult<string> {}

// Create the custom hook function
function useReset_PasswordApi() {
  const [data_Reset_Password, setDataReset_Password] =
    useState<IReset_Password_res>({} as IReset_Password_res);
  const [loading_Reset_Password, setReset_Password] = useState(false);
  const [error_Reset_Password, setError_Reset_Password] = useState<
    string | null
  >(null);

  const postData_Reset_Password = async (body: IReset_Password_req) => {
    try {
      setReset_Password(true);
      let url = `auth/reset-password?Email=${body.Email}&Password=${body.Password}&ConfirmPassword=${body.ConfirmPassword}`;
      if (body.Code) {
        url += `&Code=${body.Code}`;
      }
      // Adjusted URL for reset password
      const response = await axiosInstance.post<IReset_Password_res>(url);

      setDataReset_Password((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      if (response.data.success && response.data?.token) {
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
        setError_Reset_Password(err.message);
        return null;
      } else {
        setError_Reset_Password("An unknown error occurred");
        return null;
      }
    } finally {
      setReset_Password(false);
    }
  };

  return {
    data_Reset_Password,
    loading_Reset_Password,
    error_Reset_Password,
    postData_Reset_Password,
  };
}

export default useReset_PasswordApi;
