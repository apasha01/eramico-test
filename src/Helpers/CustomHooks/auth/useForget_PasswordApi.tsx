import { useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";

export interface IForget_Password_req {
  Username: string;
}

export interface IForget_Password_res extends IAPIResult<string> {}

function useForget_PasswordApi() {
  const [data_Forget_Password, setDataForget_Password] =
    useState<IForget_Password_res>({} as IForget_Password_res);
  const [loading_Forget_Password, setForget_Password] = useState(false);
  const [error_Forget_Password, setError_Forget_Password] = useState<
    string | null
  >(null);

  const postData_Forget_Password = async (body: IForget_Password_req) => {
    try {
      setForget_Password(true);
      const response = await axiosInstance.post<IForget_Password_res>(
        `auth/forget-password?Username=${body.Username}`
      );
      setDataForget_Password((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError_Forget_Password(err.message);
        return null;
      } else {
        setError_Forget_Password("An unknown error occurred");
        return null;
      }
    } finally {
      setForget_Password(false);
    }
  };

  return {
    data_Forget_Password,
    loading_Forget_Password,
    error_Forget_Password,
    postData_Forget_Password,
  };
}

export default useForget_PasswordApi;
