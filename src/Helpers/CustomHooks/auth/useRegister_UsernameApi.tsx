import { useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";

export interface ILogin_Username_req {
  Username: string;
  Password: string;
}

export interface ILogin_Username_res extends IAPIResult<string> {}

function useRegister_UsernameApi() {
  const [data_Register_Username, setData_Register_Username] =
    useState<ILogin_Username_res>({} as ILogin_Username_res);
  const [loading_Register_Username, setLoading_Register_Username] =
    useState(false);
  const [error_Register_Username, setError_Register_Username] = useState<
    string | null
  >(null);

  const postData_Register_Username = async (body: ILogin_Username_req) => {
    try {
      setLoading_Register_Username(true);
      const response = await axiosInstance.post<ILogin_Username_res>(
        `auth/register-username?Username=${body.Username}&Password=${body.Password}`
      );
      setData_Register_Username((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      return response.data.message;
    } catch (err) {
      if (err instanceof Error) {
        setError_Register_Username(err.message);
        return err.message;
      } else {
        setError_Register_Username("An unknown error occurred");
        return "An unknown error occurred";
      }
    } finally {
      setLoading_Register_Username(false);
    }
  };

  return {
    data_Register_Username,
    loading_Register_Username,
    error_Register_Username,
    postData_Register_Username,
  };
}

export default useRegister_UsernameApi;
