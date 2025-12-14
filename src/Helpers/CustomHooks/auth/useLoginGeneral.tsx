import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { setToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import { fetchUserData } from "@/lib/features/user/userSlice";

export interface ILoginGeneralReq {
  Username: string;
  Password: string;
}

export interface ILoginGeneralRes extends IAPIResult<string> {}

function useLoginGeneral() {
  const dispatch = useAppDispatch();
  const [data_LoginGeneral, setDataLoginGeneral] = useState<ILoginGeneralRes>(
    {} as ILoginGeneralRes
  );
  const [loading_LoginGeneral, setLoginGeneral] = useState(false);
  const [error_LoginGeneral, setErrorLoginGeneral] = useState<string | null>(
    null
  );

  const postData_LoginGeneral = async (body: ILoginGeneralReq) => {
    try {
      setLoginGeneral(true);
      const response = await axiosInstance.post<ILoginGeneralRes>(
        `auth/login?Username=${body.Username}&Password=${body.Password}`
      );
      setDataLoginGeneral((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      if (response.data.success) {
        setToken_Localstorage(String(response?.data?.token));
        // Fetch user data after successful login
        // dispatch(fetchUserData());
      }
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setErrorLoginGeneral(err.message);
        return null;
      } else {
        setErrorLoginGeneral("An unknown error occurred");
        return null;
      }
    } finally {
      setLoginGeneral(false);
    }
  };

  return {
    data_LoginGeneral,
    loading_LoginGeneral,
    error_LoginGeneral,
    postData_LoginGeneral,
  };
}

export default useLoginGeneral;
