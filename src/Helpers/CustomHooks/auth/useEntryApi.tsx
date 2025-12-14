import { useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";

export interface IEntry_req {
  Username: string;
}

export interface IEntry_res extends IAPIResult<string> {
  message?:
    | ""
    | "new-phone"
    | "new-email"
    | "new-username"
    | "user-phone"
    | "user-email"
    | "user-username";
  data: any;
}

function useEntryApi() {
  const [data_Entry, setDataEntry] = useState<IEntry_res>({} as IEntry_res);
  const [loading_Entry, setEntry] = useState(false);
  const [error_Entry, setError_Entry] = useState<string | null>(null);

  const postData_Entry = async (body: IEntry_req) => {
    try {
      setEntry(true);
      const response = await axiosInstance.post<IEntry_res>(
        `auth/entry?Username=${body.Username}`
      );
      setDataEntry((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError_Entry(err.message);
        return null;
      } else {
        setError_Entry("An unknown error occurred");
        return null;
      }
    } finally {
      setEntry(false);
    }
  };

  return {
    data_Entry,
    loading_Entry,
    error_Entry,
    postData_Entry,
  };
}

export default useEntryApi;
