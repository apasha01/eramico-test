import { useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import {
  ADVERTISE_GET_DETAIL,
  COMPANY_DETAILS,
  MESSAGE_USER_INBOX,
  USER_DETAILS,
} from "@/lib/urls";
import { ChatInterfaceData } from "@/Components/Shared/Chats/chatInterface";
import { UserInterface } from "@/lib/features/user/userSlice";
import { CompanyInterface } from "@/Helpers/Interfaces/EntityInterfaces";
import { AdvertiseDetail } from "@/app/advertise/advertiseInterface";
import { IAPIResult } from "@/Helpers/IAPIResult";

function useChatListApi() {
  const [chatList, setChatList] = useState<ChatInterfaceData[]>([]);
  const [loadingChatList, setLoadingChatList] = useState(false);
  const [errorChatList, setErrorChatList] = useState<string | null>(null);

  const fetchChatList = async () => {
    try {
      setLoadingChatList(true);

      const response = await axiosInstance.get<IAPIResult<ChatInterfaceData[]>>(
        MESSAGE_USER_INBOX
      );

      if (response.data.success) {
        setChatList(response.data.data || []);
      } else {
        setErrorChatList(
          response.data.message || "An error occurred while fetching chat list."
        );
      }

      return response.data;
    } catch (error) {
      setErrorChatList(
        error instanceof Error ? error.message : "خطا در بارگذاری تصویر"
      );
      return null;
    } finally {
      setLoadingChatList(false);
    }
  };

  const fetchUser = async (userId: number) => {
    try {
      const response = await axiosInstance.get<IAPIResult<UserInterface>>(
        `${USER_DETAILS}/${userId}`
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        setErrorChatList(
          response.data.message || "An error occurred while fetching user."
        );
        return null;
      }
    } catch (error) {
      setErrorChatList(
        error instanceof Error ? error.message : "خطا در بارگذاری"
      );
      return null;
    } finally {
      setLoadingChatList(false);
    }
  };

  const fetchCompany = async (companyId: number) => {
    try {
      const response = await axiosInstance.get<IAPIResult<CompanyInterface>>(
        `${COMPANY_DETAILS}/${companyId}`
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        setErrorChatList(
          response.data.message || "An error occurred while fetching company."
        );
        return null;
      }
    } catch (error) {
      setErrorChatList(
        error instanceof Error ? error.message : "خطا در بارگذاری"
      );
      return null;
    } finally {
      setLoadingChatList(false);
    }
  };

  const fetchEntity = async (entityId: number) => {
    try {
      const response = await axiosInstance.get<IAPIResult<AdvertiseDetail>>(
        `${ADVERTISE_GET_DETAIL}/${entityId}`
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        setErrorChatList(
          response.data.message || "An error occurred while fetching entity."
        );
        return null;
      }
    } catch (error) {
      setErrorChatList(
        error instanceof Error ? error.message : "خطا در بارگذاری"
      );
      return null;
    } finally {
      setLoadingChatList(false);
    }
  };

  return {
    chatList,
    loadingChatList,
    errorChatList,
    fetchChatList,
    fetchUser,
    fetchCompany,
    fetchEntity,
  };
}

export default useChatListApi;
