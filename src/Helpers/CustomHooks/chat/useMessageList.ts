import { useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { MESSAGE_USER_THREAD, MESSAGE_SET_READ } from "@/lib/urls";
import { MessageInterface } from "@/Components/Shared/Chats/chatInterface";
import { MessageTypes } from "@/Helpers/Interfaces/Enums";
// import { PAGE_SIZE } from "@/lib/constants";

export interface MessageListResponse {
  success: boolean;
  message: string | null;
  token: string | null;
  data: MessageInterface[];
  total: number;
}

export interface MessageListRequest {
  id: number;
}

interface SendMessageResponse {
  success: boolean;
  message: string | null;
  token: string | null;
  data: MessageInterface;
  total: number;
}

interface UploadFileResponse {
  success: boolean;
  message: string | null;
  token: string | null;
  data: string; // Assuming backend returns a URL for the uploaded file
}

function useMessageListApi() {
  const [messageList, setMessageList] = useState<MessageInterface[]>([]);
  const [loadingMessageList, setLoadingMessageList] = useState(false);
  const [errorMessageList, setErrorMessageList] = useState<string | null>(null);

  const fetchMessageList = async (
    id: number,
    messageType: MessageTypes,
    page = 1,
    size = 100
  ) => {
    try {
      setLoadingMessageList(true);

      const response = await axiosInstance.get<MessageListResponse>(
        `${MESSAGE_USER_THREAD}/${id}?messageType=${messageType}&page=${page}&size=${size}`
      );

      if (response.data.success) {
        if (page > 1) {
          setMessageList((prevMessages) => [
            ...prevMessages,
            ...response.data.data,
          ]);
        } else {
          setMessageList(response.data.data);
        }
      } else {
        setErrorMessageList(
          response.data.message ||
            "An error occurred while fetching message list."
        );
      }

      return response.data;
    } catch (error) {
      setErrorMessageList(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
      return null;
    } finally {
      setLoadingMessageList(false);
    }
  };

  const postMessage = async (
    otherId: number,
    text: string,
    entityId?: number,
    file?: File,
    messageType: MessageTypes = MessageTypes.UserToUser
  ) => {
    try {
      const formData = new FormData();
      formData.append("Id", "0");
      formData.append("Context", text);
      if (messageType === 1) formData.append("toUserId", String(otherId));
      else formData.append("toCompanyId", String(otherId));
      if (entityId) {
        formData.append("entityId", String(entityId));
        formData.append("entityInitiate", "true");
      }
      if (file) formData.append("file", file);
      const response = await axiosInstance.post<SendMessageResponse>(
        "Message/save",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.success) {
        // Add the new message to the beginning of the message list
        if (messageType > 0) fetchMessageList(otherId, messageType);
      } else {
        console.error(
          "Failed to send message:",
          response.data.message || "Unknown error"
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error sending message:", error || "Unknown error");
      return null;
    }
  };

  // Marks one or multiple messages as read
  const markMessagesRead = async (messageIds: number[]) => {
    if (!messageIds || messageIds.length === 0) return [] as number[];
    const succeeded: number[] = [];
    try {
      await Promise.all(
        messageIds.map(async (id) => {
          try {
            await axiosInstance.post(`${MESSAGE_SET_READ}/${id}`);
            succeeded.push(id);
          } catch (e) {
            // Fail silently per message; could add retry or logging
            // console.error("Failed to mark message read", id, e);
          }
        })
      );
    } catch (e) {
      // General failure (already handled per-message) – ignore
    }
    return succeeded;
  };

  return {
    messageList,
    loadingMessageList,
    errorMessageList,
    fetchMessageList,
    postMessage,
    markMessagesRead,
  };
}

export default useMessageListApi;
