import { useState, useEffect } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { toast } from "react-toastify";

export interface IdentityUpdateResponse {
  success: boolean;
  message: string | null;
}

function useUpdateIdentityApi() {
  const [loadingUpdateIdentity, setLoadingUpdateIdentity] = useState(false);
  const [errorUpdateIdentity, setErrorUpdateIdentity] = useState<string | null>(
    null
  );

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateIdentity = async (imageFile: any) => {
    const formData = new FormData();
    formData.append("identityImage", imageFile);

    try {
      setLoadingUpdateIdentity(true);
      setErrorUpdateIdentity(null);
      setSuccessMessage(null);

      const response = await axiosInstance.post<IdentityUpdateResponse>(
        "User/update-identity",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("تصویر شناسایی با موفقیت به‌روزرسانی شد."); // Persian message for success
      } else {
        toast.warning(
          response?.data?.message ?? "تصویر شناسایی به روزرسانی نشد."
        );
      }

      return response.data;
    } catch (error) {
      toast.error("تصویر شناسایی به روزرسانی نشد.");

      return null;
    } finally {
      setLoadingUpdateIdentity(false);
    }
  };

  return {
    loadingUpdateIdentity,
    errorUpdateIdentity,
    updateIdentity,
    successMessage,
  };
}

export default useUpdateIdentityApi;
