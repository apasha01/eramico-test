import { useState } from "react";

import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";

export interface ILogin_Username_req {
  Username: string;
  Password: string;
}

export interface ILogin_Username_res extends IAPIResult<string> {}

function useLogin_UsernameApi() {
  const [data_Login_Username, setData_Login_Username] =
    useState<ILogin_Username_res>({} as ILogin_Username_res);
  const [loading_Login_Username, setLoading_Login_Username] = useState(false);
  const [error_Login_Username, setError_Login_Username] = useState<
    string | null
  >(null);

  const postData_Login_Username = async (body: ILogin_Username_req) => {
    try {
      setLoading_Login_Username(true);
      const response = await axiosInstance.post<ILogin_Username_res>(
        `auth/login-username?Username=${body.Username}&Password=${body.Password}`
      );
      setData_Login_Username((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      return response.data.message;
    } catch (err) {
      if (err instanceof Error) {
        setError_Login_Username(err.message);
        return err.message;
      } else {
        setError_Login_Username("An unknown error occurred");
        return "An unknown error occurred";
      }
    } finally {
      setLoading_Login_Username(false);
    }
  };

  return {
    data_Login_Username,
    loading_Login_Username,
    error_Login_Username,
    postData_Login_Username,
  };
}

export default useLogin_UsernameApi;
