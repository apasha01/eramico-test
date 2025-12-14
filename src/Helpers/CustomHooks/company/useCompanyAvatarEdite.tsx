import { useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { COMPANY_REMOVE_AVATAR, COMPANY_UPDATE_AVATAR } from "@/lib/urls";

export interface AvatarUpdateResponse {
  success: boolean;
  message: string | null;
}

function useUpdateCompanyAvatarApi() {
  const [loadingUpdateAvatar, setLoadingUpdateAvatar] = useState(false);
  const [errorUpdateAvatar, setErrorUpdateAvatar] = useState<string | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [loadingRemoveAvatar, setLoadingRemoveAvatar] = useState(false);
  const [errorRemoveAvatar, setErrorRemoveAvatar] = useState<string | null>(
    null
  );
  const [successRemoveMessage, setSuccessRemoveMessage] = useState<
    string | null
  >(null);

  const updateAvatar = async (companyId: number, imageFile: File) => {
    const formData = new FormData();
    formData.append("avatar", imageFile);

    try {
      setLoadingUpdateAvatar(true);
      setErrorUpdateAvatar(null);
      setSuccessMessage(null);

      const response = await axiosInstance.post<AvatarUpdateResponse>(
        `${COMPANY_UPDATE_AVATAR}/${companyId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(
          response.data.message || "عکس با موفقیت به‌روزرسانی شد."
        );
      }
      return response.data;
    } catch (error: any) {
      setErrorUpdateAvatar("در به‌روزرسانی آواتار شرکت خطایی رخ داد.");
      return null;
    } finally {
      setLoadingUpdateAvatar(false);
    }
  };

  const removeAvatar = async (companyId: number) => {
    try {
      setLoadingRemoveAvatar(true);
      setErrorRemoveAvatar(null);
      setSuccessRemoveMessage(null);

      const response = await axiosInstance.post<AvatarUpdateResponse>(
        `${COMPANY_REMOVE_AVATAR}/${companyId}`
      );

      if (response.data.success) {
        setSuccessRemoveMessage(
          response.data.message || "آواتار با موفقیت حذف شد."
        );
      }
      return response.data;
    } catch (error: any) {
      setErrorRemoveAvatar("در حذف آواتار شرکت خطایی رخ داد.");
      return null;
    } finally {
      setLoadingRemoveAvatar(false);
    }
  };

  return {
    loadingUpdateAvatar,
    errorUpdateAvatar,
    successMessage,
    updateAvatar,

    loadingRemoveAvatar,
    errorRemoveAvatar,
    successRemoveMessage,
    removeAvatar,
  };
}

export default useUpdateCompanyAvatarApi;
