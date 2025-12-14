import { useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { COMPANY_LOOKUP } from "@/lib/urls";
import { createUrlFromObject } from "@/Helpers/Utilities";

export interface Company_Lookup_req {
  type: 1 | 2;
  text: string;
}

export interface Company_Lookup_res extends IAPIResult<string> {}

function useCompany_LookupApi() {
  const [data_Company_Lookup, setDataCompany_Lookup] =
    useState<Company_Lookup_res>({} as Company_Lookup_res);
  const [loading_Company_Lookup, setLoadingCompany_Lookup] = useState(false);
  const [error_Company_Lookup, setError_Company_Lookup] = useState<
    string | null
  >(null);

  const postData_Company_Lookup = async (body: Company_Lookup_req) => {
    try {
      const url = createUrlFromObject(COMPANY_LOOKUP, {
        type: body.type,
        text: body.text,
      });
      setLoadingCompany_Lookup(true);

      const response = await axiosInstance.get<Company_Lookup_res>(url);
      setDataCompany_Lookup((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError_Company_Lookup(err.message);
        return null;
      } else {
        setError_Company_Lookup("An unknown error occurred");
        return null;
      }
    } finally {
      // Use setTimeout to add a delay of 500 ms before setting loading to false
      setTimeout(() => {
        setLoadingCompany_Lookup(false);
      }, 500);
    }
  };

  return {
    data_Company_Lookup,
    loading_Company_Lookup,
    error_Company_Lookup,
    postData_Company_Lookup,
  };
}

export default useCompany_LookupApi;
