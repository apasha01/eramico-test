import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { setToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import LoginStateReducer from "@/Helpers/Redux/Reducers/auth/LoginStateReducer";
import { fetchUserData } from "@/lib/features/user/userSlice";

export interface ILogin_Phone_req {
  Phone: string;
  Token: string;
}

export interface ILogin_Phone_res extends IAPIResult<string> {}

function useLogin_PhoneApi() {
  const dispatch = useAppDispatch();
  const [data_Login_Phone, setDataLogin_Phone] = useState<ILogin_Phone_res>(
    {} as ILogin_Phone_res
  );
  const [loading_Login_Phone, setLoadingLogin_Phone] = useState(false);
  const [error_Login_Phone, setError_Login_Phone] = useState<string | null>(
    null
  );

  const postData_Login_Phone = async (body: ILogin_Phone_req) => {
    try {
      setLoadingLogin_Phone(true);
      const response = await axiosInstance.post<ILogin_Phone_res>(
        `auth/login-phone?Phone=${body.Phone}&Token=${body.Token}`
      );
      setDataLogin_Phone((prevData) => ({
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
        // Fetch user data after successful phone login
        // dispatch(fetchUserData());
      }
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError_Login_Phone(err.message);
        return null;
      } else {
        setError_Login_Phone("An unknown error occurred");
        return null;
      }
    } finally {
      setLoadingLogin_Phone(false);
    }
  };

  return {
    data_Login_Phone,
    loading_Login_Phone,
    error_Login_Phone,
    postData_Login_Phone,
  };
}

export default useLogin_PhoneApi;
