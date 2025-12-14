"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  Avatar,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  ListItemButton,
  Button,
  Tooltip,
  Icon,
} from "@mui/material";
import { CiSearch } from "react-icons/ci";
import styles from "./styles.module.css";
import MessageSeenIcon from "@/Components/Icons/MessageSeen";
import InputEmoji from "react-input-emoji";
import { ImAttachment, ImCross } from "react-icons/im";
import { ChatInterfaceData, MessageInterface } from "./chatInterface";
import useChatListApi from "@/Helpers/CustomHooks/chat/useChatList";
import LoaderComponent from "@/Components/LoaderComponent";
import useMessageListApi from "@/Helpers/CustomHooks/chat/useMessageList";
import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import { UserInterface } from "@/lib/features/user/userSlice";
import { CompanyInterface } from "@/Helpers/Interfaces/EntityInterfaces";
import { AdvertiseDetail } from "@/app/advertise/advertiseInterface";
import Link from "next/link";
import ItemChat from "./item-chat";
import { MessageTypes } from "@/Helpers/Interfaces/Enums";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { DownloadOutlined } from "@mui/icons-material";
import { Refresh } from "@mui/icons-material";
import { FaTimes } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

interface RTLChatBoxProps {
  entityId?: string;
  user?: string;
  company?: string;
}

const RTLChatBoxContent: React.FC<RTLChatBoxProps> = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState({
    entityId: undefined as string | undefined,
    user: undefined as string | undefined,
    company: undefined as string | undefined,
  });

  useEffect(() => {
    const i = searchParams.get("i");
    const u = searchParams.get("u");
    const c = searchParams.get("c");

    if (i || u || c) {
      setParams({
        entityId: i || undefined,
        user: u || undefined,
        company: c || undefined,
      });

      const url = new URL(window.location.href);
      url.searchParams.delete("i");
      url.searchParams.delete("u");
      url.searchParams.delete("c");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  const currentUser = useAppSelector((state) => state.user);
  const [selectedChat, setSelectedChat] = useState<ChatInterfaceData | null>(
    null
  );
  const [selectedUserToStartChat, setSelectedUserToStartChat] =
    useState<UserInterface | null>(null);
  const [selectedCompanyToStartChat, setSelectedCompanyToStartChat] =
    useState<CompanyInterface | null>(null);
  const [selectedEntityToChat, setSelectedEntityToChat] =
    useState<AdvertiseDetail | null>(null);

  const [filteredChatList, setFilteredChatList] = useState<ChatInterfaceData[]>(
    []
  );
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  const {
    fetchChatList,
    loadingChatList,
    chatList,
    fetchUser,
    fetchCompany,
    fetchEntity,
  } = useChatListApi();
  const {
    messageList,
    loadingMessageList,
    fetchMessageList,
    postMessage,
    markMessagesRead,
  } = useMessageListApi();

  const [chatColors, setChatColors] = useState<Record<number, string>>({});
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const unreadGlobal = useUnreadMessages();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Utility function to generate random colors
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    // Assign random colors to each chat on initial load
    const colors: Record<number, string> = {};
    chatList.forEach((chat) => {
      if (!colors[chat.otherId]) {
        colors[chat.otherId] = generateRandomColor();
      }
    });
    setChatColors(colors);
  }, [chatList]);

  useEffect(() => {
    if (currentPage < 2) scrollToBottom();
  }, [messageList, currentPage]);

  useEffect(() => {
    if (params.entityId || params.user || params.company) {
      let foundInList: ChatInterfaceData | undefined = undefined;
      if (params.user && !params.company) {
        fetchUser(Number(params.user)).then((u) => {
          setSelectedUserToStartChat(u);
        });
        foundInList = chatList.find(
          (chat) => chat.otherId === Number(params.user)
        );
      }
      if (params.company) {
        fetchCompany(Number(params.company)).then((c) => {
          setSelectedCompanyToStartChat(c);
        });
        foundInList = chatList.find(
          (chat) => chat.otherId === Number(params.company)
        );
      }
      if (params.entityId) {
        fetchEntity(Number(params.entityId)).then((e) => {
          setSelectedEntityToChat(e);
        });
      }
      if (foundInList) {
        setSelectedChat(foundInList);
        setParams({
          entityId: undefined,
          user: undefined,
          company: undefined,
        });
      }
    }
  }, [
    params.user,
    params.company,
    params.entityId,
    chatList,
    fetchUser,
    fetchCompany,
    fetchEntity,
  ]);

  async function handleOnEnter(text: any) {
    if (!text || text.trim() === "") return; // Ignore empty messages
    if (
      selectedChat &&
      selectedChat?.otherId &&
      !loadingChatList &&
      !loadingMessageList
    ) {
      // Fetch message list data when the selected chat changes
      await postMessage(
        selectedChat?.otherId,
        text,
        selectedEntityToChat?.id || 0,
        selectedFile,
        selectedChat?.messageTypeId as MessageTypes
      );
    } else {
      await postMessage(
        selectedCompanyToStartChat?.id || selectedUserToStartChat?.id || 0,
        text,
        selectedEntityToChat?.id || 0,
        selectedFile,
        selectedCompanyToStartChat
          ? MessageTypes.UserToCompany
          : MessageTypes.UserToUser
      );
    }
    setSelectedEntityToChat(null);
    setSelectedCompanyToStartChat(null);
    setSelectedUserToStartChat(null);
    fetchAndSetChatList();
    setSelectedFile(undefined);
  }

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return; // If no file is selected, exit the function

    // Check if the selected file type is allowed
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("لطفا فایل معتبر انتخاب کنید: Word document, PDF, JPEG, or PNG.");
      return;
    }
    setSelectedFile(file);
  };

  const fetchAndSetChatList = async () => {
    const chatListData = await fetchChatList();
    setFilteredChatList(chatListData?.data || []);
  };

  useEffect(() => {
    fetchAndSetChatList();
  }, []);

  useEffect(() => {
    if (
      selectedChat &&
      selectedChat?.otherId &&
      !loadingChatList &&
      !loadingMessageList
    ) {
      // Reset pagination when selected chat changes
      setCurrentPage(1);
      setHasMoreMessages(true);
      setSelectedCompanyToStartChat(null);
      setSelectedUserToStartChat(null);
      // Fetch initial message list
      fetchMessageList(
        selectedChat?.otherId,
        selectedChat?.messageTypeId,
        1
      ).then((newMessages) => {
        if (newMessages) {
          markMessagesRead(
            newMessages.data
              .filter(
                (msg) => !msg.isRead && msg.fromUserId != currentUser.userId
              )
              .map((msg) => msg.id)
          );
        }
      });

      // Set up interval to reload messages every 30 seconds only if unread > 1
      const intervalId = setInterval(() => {
        if (unreadGlobal > 1 && !loadingMessageList) {
          fetchAndSetChatList();
          fetchMessageList(
            selectedChat?.otherId,
            selectedChat?.messageTypeId,
            1
          );
        }
      }, 30000);

      // Clean up interval on component unmount or when selectedChat changes
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat, unreadGlobal]);

  // Handle scroll to load more messages
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = async () => {
      if (
        chatContainer.scrollTop === 0 && // Check if scrolled to top
        hasMoreMessages &&
        !isLoadingMore &&
        selectedChat?.otherId &&
        messageList.length > 0 // Only load more if there are existing messages
      ) {
        setIsLoadingMore(true);
        const nextPage = currentPage + 1;
        const response = await fetchMessageList(
          selectedChat.otherId,
          selectedChat.messageTypeId,
          nextPage
        );

        if (response?.data && response.data.length > 0) {
          setCurrentPage(nextPage);
        } else {
          setHasMoreMessages(false);
        }
        setIsLoadingMore(false);
      }
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, [currentPage, hasMoreMessages, selectedChat]);

  const filterChats = (searchTerm: string) => {
    // Implement chat filtering logic here
    const filtered = chatList.filter((chat) =>
      chat.otherName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChatList(filtered);
  };

  const getChatAvatar = (chat: ChatInterfaceData) => {
    const bgColor = chatColors[chat.otherId] || "#ccc";
    return (
      <Avatar sx={{ bgcolor: bgColor, width: 56, height: 56 }}>
        {chat.otherAvatar ? (
          <Image
            alt={chat.otherName}
            src={chat.otherAvatar}
            width={100}
            loading="lazy"
            height={100}
          />
        ) : (
          chat.otherName[0]
        )}
      </Avatar>
    );
  };

  const getSelectedChatAvatar = () => {
    const bgColor = selectedChat ? chatColors[selectedChat.otherId] : "#ccc";
    return (
      <Avatar sx={{ bgcolor: bgColor, width: 56, height: 56 }}>
        {selectedChat?.otherAvatar ? (
          <Image
            alt={selectedChat.otherName}
            src={selectedChat.otherAvatar}
            width={100}
            height={100}
            loading="lazy"
          />
        ) : (
          selectedChat?.otherName[0]
        )}
      </Avatar>
    );
  };

  const refreshChatList = async () => {
    if (selectedChat) {
      await fetchMessageList(selectedChat.otherId, selectedChat.messageTypeId);
    }
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        marginTop: "0px",
        border: "1px solid #EEEEEE",
      }}
      style={{ overflow: "visible" }}
    >
      <Grid
        xs={12}
        md={5}
        sx={{ maxWidth: 500, borderLeft: "1px solid #EEEEEE", padding: "0px" }}
        className="d-flex flex-column"
      >
        <div
          className={`d-flex justify-content-between py-2 px-4 align-items-center BorderBottom ${styles.chatHeader}`}
          dir="rtl"
        >
          <Typography className=" fs-16 fw-500">گفتگوها</Typography>
          <TextField
            name="search"
            className="px-0  fs-16 fw-500 border rounded-4 customStyleTextField"
            // style={{ width: "190px" }}
            InputProps={{
              style: {
                height: "36px",
                padding: "0px",
                fontSize: "12px",
                textAlign: "right",
              },
              startAdornment: (
                <InputAdornment
                  position="start"
                  className="mx-1 px-0 text-center"
                >
                  <CiSearch size={16} />
                </InputAdornment>
              ),
            }}
            placeholder="جستجو در گفتگوها ..."
            onChange={(e) => filterChats(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className={styles.ListContainer}>
          <>
            {(filteredChatList as ChatInterfaceData[]).map((chat) => (
              <ListItemButton
                key={chat.otherId}
                sx={{
                  backgroundColor:
                    selectedChat?.otherId === chat.otherId
                      ? "#FFF9F2"
                      : "#FFFFFF",
                  borderRadius: "16px",
                  margin: "8px",
                  height: 100,
                  width: "97%",
                  overflow: "hidden",
                  textAlign: "right",
                }}
                onClick={() => setSelectedChat(chat)}
                className="rtl d-flex justify-content-between"
              >
                {getChatAvatar(chat)}
                <div className="d-flex w-100 flex-column gap-1">
                  <div className="d-flex w-100 justify-content-between">
                    <div className="d-flex gap-1 align-items-center">
                      <Tooltip title={<div dir="rtl">{chat.otherName}</div>}>
                        <Typography className="fs-19 fw-500">
                          {chat.otherName.substring(0, 20)}
                          {chat.otherName.length > 20 ? "..." : ""}
                        </Typography>
                      </Tooltip>
                      {chat.otherUserName && (
                        <Tooltip
                          title={<div dir="rtl">{chat.otherUserName}</div>}
                        >
                          <Typography variant="body2" className="fs-12 fw-500">
                            @{chat.otherUserName.substring(0, 20)}
                          </Typography>
                        </Tooltip>
                      )}
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      {chat.unread == 0 ? <MessageSeenIcon /> : null}
                      <Typography variant="body2" className="fs-10 fw-300">
                        {chat.timePast}
                      </Typography>
                    </div>
                  </div>
                  <div className="w-100">
                    <Tooltip title={<div dir="rtl">{chat.lastContext}</div>}>
                      <Typography
                        variant="body2"
                        className="col-12 d-flex gap-1 mt-2 fs-14 fw-500"
                      >
                        {" "}
                        {chat.lastContext.substring(0, 50)}
                        {chat.lastContext.length > 50 ? "..." : ""}
                      </Typography>
                    </Tooltip>
                  </div>
                </div>
              </ListItemButton>
            ))}
          </>
          {loadingChatList ? <LoaderComponent /> : null}
        </div>
      </Grid>
      <Grid
        xs={12}
        md={7}
        sx={{ maxWidth: 600, position: "relative" }}
        className="d-flex flex-column"
      >
        {selectedChat ||
        selectedUserToStartChat ||
        selectedCompanyToStartChat ? (
          <>
            <div
              className={`d-flex justify-content-between py-2 px-4 align-items-center BorderBottom chat-header ${styles.chatHeader}`}
            >
              <div className="d-flex gap-2 align-items-start justify-content-between">
                <div className="d-flex gap-3 py-1  align-items-start">
                  {getSelectedChatAvatar()}
                  <div className="px-0">
                    <div className="d-flex gap-2 align-items-center">
                      <Typography className="fs-19 fw-500">
                        {selectedChat == null ? "ارسال پیام به: " : ""}
                        {selectedChat?.otherName ||
                          selectedCompanyToStartChat?.title ||
                          selectedUserToStartChat?.fullName}
                      </Typography>
                    </div>
                    {selectedChat?.timePast ? (
                      <Typography
                        variant="body2"
                        className="col-12 d-flex gap-1 mt-2 fs-14 fw-500"
                      >
                        آخرین بازدید: {selectedChat?.timePast}
                      </Typography>
                    ) : null}
                  </div>
                </div>
              </div>
              <div>
                {selectedEntityToChat ? (
                  <Button
                    href={
                      selectedEntityToChat.advertiseTypeId === 1
                        ? "/advertise/" + selectedEntityToChat.id
                        : "/inquiries/" + selectedEntityToChat.id
                    }
                    component={Link}
                    className="fs-12 fw-500"
                    target="_blank"
                  >
                    درباره {selectedEntityToChat?.advertiseTypeTitle}{" "}
                    {selectedEntityToChat?.productTitle}
                  </Button>
                ) : null}
                {selectedChat ? (
                  <div className="d-flex gap-2">
                    <IconButton
                      onClick={() => refreshChatList()}
                      component="span"
                    >
                      <Refresh />
                    </IconButton>
                    <IconButton
                      onClick={() => setSelectedChat(null)}
                      component="span"
                    >
                      <FaTimes />
                    </IconButton>
                  </div>
                ) : null}
              </div>
            </div>
            <div
              dir="ltr"
              className={styles.chatContainer}
              ref={chatContainerRef}
            >
              {messageList
                .slice()
                .reverse()
                .map((message: MessageInterface) =>
                  message.advertise ? (
                    <ItemChat
                      key={message.id}
                      id={message.advertise.id.toString()}
                      faTitle={message.advertise.productTitle || ""}
                      enTitle={message.advertise.productEngTitle || ""}
                      name={
                        message.advertise.companyTitle ||
                        message.advertise.userFullName ||
                        ""
                      }
                      subscriptionAvatar={message.advertise.subscriptionAvatar}
                      verified={
                        message.advertise.companyId
                          ? message.advertise.companyIsVerified
                          : message.advertise.userIsVerified
                      }
                      date={message.advertise.expirationRemained}
                      amount={message.advertise.amount}
                      amountUnit={message.advertise.amountUnitPropertyTitle}
                      isSafe={message.advertise.companyIsSafe}
                      userId={message.advertise.userId}
                      companyId={message.advertise.companyId}
                      productId={message.advertise.productId}
                      message={message?.context || ""}
                      messageDate={message?.createdDatePersian || ""}
                      isAdvertise={message.advertise.advertiseTypeId === 1}
                      companyCode={message.advertise.companyCode}
                    />
                  ) : (
                    <Tooltip
                      key={message.id}
                      title={<div dir="rtl">{message?.fromName}</div>}
                    >
                      <div
                        className={
                          message.fromUserId === currentUser.userId
                            ? styles.userMessage
                            : styles.botMessage
                        }
                      >
                        <div dir="rtl">
                          <div>
                            {message.media ? (
                              <IconButton
                                href={message.media.mediaSourceFileName}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <DownloadOutlined />
                              </IconButton>
                            ) : null}
                            {message?.context}
                          </div>
                          <div className="w-100 text-start">
                            <Typography
                              variant="caption"
                              className="text-muted"
                            >
                              {message?.createdDatePersian}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </Tooltip>
                  )
                )}
              {isLoadingMore ? (
                <div style={{ padding: "10px", textAlign: "center" }}>
                  <LoaderComponent />
                </div>
              ) : null}
              {loadingChatList || loadingMessageList ? (
                <LoaderComponent />
              ) : null}
              <div ref={messagesEndRef} />
            </div>
            <div className={styles.inputMessageBox} dir="rtl">
              {/* @ts-ignore */}
              <InputEmoji
                value={text}
                onChange={setText}
                cleanOnEnter
                language="fa"
                borderColor="#fff"
                onEnter={handleOnEnter}
                placeholder="نوشتن پیام ... "
                shouldReturn={false}
                shouldConvertEmojiToImage={false}
                fontFamily="IRANYekanX"
                fontSize={16}
              />
              {selectedFile ? (
                <div>
                  <Tooltip title={selectedFile.name}>
                    <Typography variant="caption" className="text-muted">
                      {selectedFile.name.substring(0, 50)}
                    </Typography>
                  </Tooltip>
                  <IconButton
                    onClick={() => setSelectedFile(undefined)}
                    style={{ padding: 0, border: "none" }}
                    component="span"
                  >
                    <ImCross
                      size={24}
                      style={{ color: "#858585", cursor: "pointer" }}
                    />
                  </IconButton>
                </div>
              ) : null}
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                placeholder="انتخاب فایل"
              />
              <label htmlFor="fileInput">
                <IconButton
                  style={{ padding: 0, border: "none" }}
                  component="span"
                >
                  <ImAttachment
                    size={24}
                    style={{ color: "#858585", cursor: "pointer" }}
                  />
                </IconButton>
              </label>
            </div>
          </>
        ) : (
          <Typography
            variant="body2"
            className="h-100 fs-19 d-flex justify-content-center align-items-center"
          >
            برای شروع، یک چت را انتخاب کنید یا پیامی ارسال کنید.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

const RTLChatBox: React.FC<RTLChatBoxProps> = () => {
  return (
    <Suspense fallback={<LoaderComponent />}>
      <RTLChatBoxContent />
    </Suspense>
  );
};

export default RTLChatBox;
