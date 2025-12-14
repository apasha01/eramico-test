"use client";
import { useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { toast } from "react-toastify";
import { resetUser } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hooks";

export interface ILogout_res extends IAPIResult<string> {}

function useLogoutApi() {
  const [loading_Logout, setLoading_Logout] = useState(false);
  const [error_Logout, setError_Logout] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const postData_Logout = async () => {
    try {
      setLoading_Logout(true);
      const response = await axiosInstance.post<ILogout_res>(`auth/logout`);

      if (response.status === 200) {
        dispatch(resetUser());
        toast.success("خروج با موفقیت انجام شد.");
        if (typeof window !== "undefined") {
          const location = window.location;
          if (location.pathname.indexOf("my-") >= 0)
            window.location.href = "/";
          else window.location.reload();
        }

        return;
      }
      return;
    } catch (err) {
      if (err instanceof Error) {
        setError_Logout(err.message);
        return err.message;
      } else {
        setError_Logout("An unknown error occurred");
        return "An unknown error occurred";
      }
    } finally {
      setLoading_Logout(false);
    }
  };

  return { loading_Logout, error_Logout, postData_Logout };
}

export default useLogoutApi;
