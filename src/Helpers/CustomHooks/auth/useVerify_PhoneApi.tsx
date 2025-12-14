import { useState } from "react";

import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { setToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";

export interface IVerify_Phone_req {
  Phone: string;
  Token: string;
}

export interface IVerify_Phone_res extends IAPIResult<string> {}

function useVerify_PhoneApi() {
  const [data_Verify_Phone, setDataVerify_Phone] = useState<IVerify_Phone_res>(
    {} as IVerify_Phone_res
  );
  const [loading_Verify_Phone, setVerify_Phone] = useState(false);
  const [error_Verify_Phone, setError_Verify_Phone] = useState<string | null>(
    null
  );

  const postData_Verify_Phone = async (body: IVerify_Phone_req) => {
    try {
      setVerify_Phone(true);
      const response = await axiosInstance.post<IVerify_Phone_res>(
        `auth/verify-phone?Phone=${body.Phone}&Token=${body.Token}`
      );
      setDataVerify_Phone((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      if (response.data.success) {
        setToken_Localstorage(String(response?.data?.token));
      }
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError_Verify_Phone(err.message);
        return null;
      } else {
        setError_Verify_Phone("An unknown error occurred");
        return null;
      }
    } finally {
      setVerify_Phone(false);
    }
  };

  return {
    data_Verify_Phone,
    loading_Verify_Phone,
    error_Verify_Phone,
    postData_Verify_Phone,
  };
}

export default useVerify_PhoneApi;
