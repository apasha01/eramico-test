"use client";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../app/img/logo.svg";
import Login from "../LoginModal";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import Menu from "./menu";
import NavbarSearchBox from "./navbar-search-box";
import { use, useEffect, useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { USER_CONFIG } from "@/lib/urls";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { useUserState } from "@/Hooks/useUserState";
import { APP_NAME } from "@/lib/metadata";
import TheAvatar from "@/Components/common/the-avatar";

interface UserConfigResponse {
  notificationCountUnread: number;
  subscriptionAvatar: string;
  subscriptionRemainDays: number;
  subscriptionShowBuy: boolean;
  subscriptionShowRenewal: boolean;
  subscriptionTypeTitle: string;
  subscriptionCanUpgrade: boolean;
}

export default function Navbar() {
  const { user: currentUser, isUserLoaded, isAuthenticated } = useUserState();
  const [userConfig, setUserConfig] = useState<UserConfigResponse | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [upgradeText, setUpgradeText] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<
          IAPIResult<UserConfigResponse>
        >(USER_CONFIG);
        if (!response.data.success) {
          return null;
        }
        setUserConfig(response.data.data);
        setUnreadCount(response.data.data?.notificationCountUnread || 0);
      } catch {
        console.error("Error fetch user config");
      }
    };
    if (isUserLoaded && isAuthenticated) fetchData();

    const handleUnreadCountUpdate = (event: CustomEvent) => {
      setUnreadCount(event.detail.count);
    };

    document.addEventListener(
      "unread_count_updated",
      handleUnreadCountUpdate as EventListener
    );

    return () => {
      document.removeEventListener(
        "unread_count_updated",
        handleUnreadCountUpdate as EventListener
      );
    };
  }, [isUserLoaded, isAuthenticated]);

  useEffect(() => {
    if (userConfig || isUserLoaded) {
      setUpgradeText(
        userConfig?.subscriptionShowBuy
          ? "خرید اشتراک"
          : userConfig?.subscriptionCanUpgrade || !isAuthenticated
          ? "ارتقا حساب"
          : userConfig?.subscriptionShowRenewal
          ? "تمدید اشتراک"
          : ""
      );
      if (isUserLoaded && !isAuthenticated) setUserConfig(null);
    }
  }, [userConfig, isUserLoaded, isAuthenticated]);

  return (
    <AppBar className="shadow-none" position="relative">
      <Toolbar className="justify-content-between">
        <div className="d-flex gap-3 logo">
          <Badge
            badgeContent={"BETA"}
            sx={{
              marginTop: "4px",
              "& .MuiBadge-badge": {
                backgroundColor: "#fb8c00",
                color: "#fff",
              },
            }}
          >
            <Link href="/">
              <Typography variant="h6" component="h1">
                <Image alt={APP_NAME} priority src={logo}/>
              </Typography>
            </Link>
          </Badge>

          <NavbarSearchBox />
        </div>
        <div className="d-flex gap-3 align-items-center">
          {isClient ? (
            <>
              {upgradeText && upgradeText.length > 0 && (
                <Button
                  style={{
                    borderRadius: "100px",
                    border: " 1px solid #E0E0E0",
                    padding: "10px 12px",
                    minWidth: "110px",
                    margin: "8px auto",
                  }}
                  {...{
                    href: "/plans",
                    component: Link,
                  }}
                >
                  <IoArrowUpCircleOutline
                    style={{
                      marginLeft: "5px",
                      color: "#FB8C00",
                      fontSize: "24px",
                    }}
                  />
                  {upgradeText}
                </Button>
              )}

              {userConfig?.subscriptionAvatar && (
                <Tooltip
                  title={
                    <div dir="rtl">
                      {(userConfig?.subscriptionTypeTitle || "") +
                        " تا " +
                        (userConfig.subscriptionRemainDays || "")}
                    </div>
                  }
                >
                  <TheAvatar
                    name={currentUser?.fullName || "کاربر"}
                    src={userConfig.subscriptionAvatar}
                    height={40}
                    width={40}
                    variant="circular"
                  />
                </Tooltip>
              )}
              {isUserLoaded && isAuthenticated && (
                <Tooltip
                  title={
                    <div dir="rtl">
                      {unreadCount > 0
                        ? `شما ${unreadCount} اعلان خوانده نشده دارید`
                        : "شما هیچ اعلان جدیدی ندارید"}
                    </div>
                  }
                >
                  <Button href="/my-profile/notifications" component={Link}>
                    <Box
                      component="span"
                      sx={{
                        bgcolor: "#fff",
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        border: "1px solid #E0E0E0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {unreadCount > 0 && (
                        <Badge
                          max={99}
                          color="error"
                          overlap="circular"
                          badgeContent={unreadCount}
                          className="clickable"
                          style={{ bottom: "17px" }}
                        />
                      )}

                      <IoMdNotificationsOutline
                        style={{
                          color: "#212121",
                          fontSize: "24px",
                        }}
                      />
                    </Box>
                  </Button>
                </Tooltip>
              )}
            </>
          ) : null}
          <Login />
        </div>
      </Toolbar>
      <Menu />
    </AppBar>
  );
}
