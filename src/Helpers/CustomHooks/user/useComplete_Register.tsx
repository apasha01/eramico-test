import { useState } from "react";

import { axiosInstance, getJWTHeader } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import {
  getToken_Localstorage,
  setToken_Localstorage,
} from "@/Helpers/LocalStorageHandler/LocalStorageHelper";

export interface ICompleted_Register_req {
  FirstName: string;
  LastName: string;
  Username: string;
  Password: string;
  CompanyId?: number;
  Post?: string;
}

export interface ICompleted_Register_res extends IAPIResult<string> {}

function useCompleted_RegisterApi() {
  const [data_Completed_Register, setDataCompleted_Register] =
    useState<ICompleted_Register_res>({} as ICompleted_Register_res);
  const [loading_Completed_Register, setCompleted_Register] = useState(false);
  const [error_Completed_Register, setError_Completed_Register] = useState<
    string | null
  >(null);

  const postData_Completed_Register = async (body: ICompleted_Register_req) => {
    try {
      setCompleted_Register(true);
      let url = `User/complete-register?FirstName=${body.FirstName}&LastName=${body.LastName}&Username=${body.Username}&Password=${body.Password}`;

      if (body.CompanyId) {
        url += `&CompanyId=${body.CompanyId}`;
      }

      if (body.Post) {
        url += `&Post=${body.Post}`;
      }
      const token = getToken_Localstorage();
      const jwtHeader = token
        ? { Authorization: `Bearer ${token}` }
        : getJWTHeader();

      const response = await axiosInstance.post<ICompleted_Register_res>(
        url,
        null,
        { headers: jwtHeader }
      );
      setDataCompleted_Register((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError_Completed_Register(err.message);
        return null;
      } else {
        setError_Completed_Register("An unknown error occurred");
        return null;
      }
    } finally {
      setCompleted_Register(false);
    }
  };

  return {
    data_Completed_Register,
    loading_Completed_Register,
    error_Completed_Register,
    postData_Completed_Register,
  };
}

export default useCompleted_RegisterApi;
