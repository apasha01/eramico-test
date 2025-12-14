import { useState } from "react";

import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";

export interface ISave_Category_Multiple_req {
  entityIds: number[];
}

export interface ISave_Category_Multiple_res extends IAPIResult<string> {}

function useSave_Category_MultipleApi() {
  const [data_Save_Category_Multiple, setDataSave_Category_Multiple] =
    useState<ISave_Category_Multiple_res>({} as ISave_Category_Multiple_res);
  const [loading_Save_Category_Multiple, setSave_Category_Multiple] =
    useState(false);
  const [error_Save_Category_Multiple, setError_Save_Category_Multiple] =
    useState<string | null>(null);

  const postData_Save_Category_Multiple = async (
    body: ISave_Category_Multiple_req
  ) => {
    try {
      setSave_Category_Multiple(true);
      const params = body.entityIds.map((id) => `entityIds=${id}`).join("&");
      const response = await axiosInstance.post<ISave_Category_Multiple_res>(
        `Follow/save-category-multiple?${params}`
      );
      setDataSave_Category_Multiple((prevData) => ({
        ...prevData,
        ...response.data,
      }));
      if (response.data.success) {
        // Handle success actions if needed
      }
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError_Save_Category_Multiple(err.message);
        return null;
      } else {
        setError_Save_Category_Multiple("An unknown error occurred");
        return null;
      }
    } finally {
      setSave_Category_Multiple(false);
    }
  };

  return {
    data_Save_Category_Multiple,
    loading_Save_Category_Multiple,
    error_Save_Category_Multiple,
    postData_Save_Category_Multiple,
  };
}

export default useSave_Category_MultipleApi;
