import { useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { toast } from "react-toastify";

export interface AvatarUpdateResponse {
  success: boolean;
  message: string | null;
}

function useUpdateAvatarApi() {
  const [loadingUpdateAvatar, setLoadingUpdateAvatar] = useState(false);
  const [errorUpdateAvatar, setErrorUpdateAvatar] = useState<string | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateAvatar = async (imageFile: any) => {
    const formData = new FormData();
    formData.append("avatar", imageFile);

    try {
      setLoadingUpdateAvatar(true);
      setErrorUpdateAvatar(null);
      setSuccessMessage(null);

      const response = await axiosInstance.post<AvatarUpdateResponse>(
        "User/update-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message); // Persian message for success
      }

      return response.data;
    } catch (error) {
      toast.error("عکس پروفایل به روزرسانی نشد.");
      return null;
    } finally {
      setLoadingUpdateAvatar(false);
    }
  };

  return {
    loadingUpdateAvatar,
    errorUpdateAvatar,
    successMessage,
    updateAvatar,
  };
}

export default useUpdateAvatarApi;
