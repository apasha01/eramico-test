import { useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { setToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";

export interface IAdmin_Login_Phone_req {
  Phone: string;
  Password: string;
}

export interface IAdmin_Login_Phone_res extends IAPIResult<string> {}

function useAdmin_Login_PhoneApi() {
  const [data_Admin_Login_Phone, setDataAdmin_Login_Phone] =
    useState<IAdmin_Login_Phone_res>({} as IAdmin_Login_Phone_res);
  const [loading_Admin_Login_Phone, setAdmin_Login_Phone] = useState(false);
  const [error_Admin_Login_Phone, setError_Admin_Login_Phone] = useState<
    string | null
  >(null);

  const postData_Admin_Login_Phone = async (body: IAdmin_Login_Phone_req) => {
    try {
      setAdmin_Login_Phone(true);
      const response = await axiosInstance.post<IAdmin_Login_Phone_res>(
        `auth/admin-login-phone?Phone=${body.Phone}&Token=${body.Password}`
      );
      setDataAdmin_Login_Phone((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      if (response.data.success) {
        setToken_Localstorage(String(response.data.token));
      }
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError_Admin_Login_Phone(err.message);
        return null;
      } else {
        setError_Admin_Login_Phone("An unknown error occurred");
        return null;
      }
    } finally {
      setAdmin_Login_Phone(false);
    }
  };

  return {
    data_Admin_Login_Phone,
    loading_Admin_Login_Phone,
    error_Admin_Login_Phone,
    postData_Admin_Login_Phone,
  };
}

export default useAdmin_Login_PhoneApi;
