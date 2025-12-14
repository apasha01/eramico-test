import { useState } from "react";

import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { setToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
export interface IVerify_Email_req {
  Email: string;
  Password: string;
}

export interface IVerify_Email_res extends IAPIResult<string> {}

function useVerify_EmailApi() {
  const [data_Verify_Email, setDataVerify_Email] = useState<IVerify_Email_res>(
    {} as IVerify_Email_res
  );
  const [loading_Verify_Email, setVerify_Email] = useState(false);
  const [error_Verify_Email, setError_Verify_Email] = useState<string | null>(
    null
  );

  const postData_Verify_Email = async (body: IVerify_Email_req) => {
    try {
      setVerify_Email(true);
      const response = await axiosInstance.post<IVerify_Email_res>(
        `auth/verify-email?Email=${body.Email}&Password=${body.Password}`
      );
      setDataVerify_Email((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      if (response.data.success) {
        setToken_Localstorage(String(response?.data?.token));
      }
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError_Verify_Email(err.message);
        return null;
      } else {
        setError_Verify_Email("An unknown error occurred");
        return null;
      }
    } finally {
      setVerify_Email(false);
    }
  };

  return {
    data_Verify_Email,
    loading_Verify_Email,
    error_Verify_Email,
    postData_Verify_Email,
  };
}

export default useVerify_EmailApi;
