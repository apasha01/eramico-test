"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LoaderComponent from "@/Components/LoaderComponent";
import { useUserState } from "@/Hooks/useUserState";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { axiosInstance } from "@/Helpers/axiosInstance";
import {
  USER_DETAILS,
  MINE_SOCIAL_MEDIA,
  MY_ADVERTISE_LIST,
  MESSAGE_UNREAD,
} from "@/lib/urls";
import { IAPIResult } from "@/Helpers/IAPIResult";
import styles from "./styles.module.css";
import UserName from "./@componenets/username";
import SideBar from "@/Components/common/sidebar";
import { UnreadMessagesProvider } from "@/context/UnreadMessagesContext";
import SocialMedia from "@/Components/common/social-media";
import Advertisments from "@/Components/common/advertisments";
import RecommendedProducts from "../../Components/common/recommended-products";
import SideBanner from "@/Components/Home/Sidebar/SideBanner/SideBanner";
import MenuIcon from "@/Components/Icons/MenuIcon";
import { TbMailOpened, TbNews, TbSpeakerphone } from "react-icons/tb";
import { PiChatCenteredTextBold } from "react-icons/pi";
import { RiUserAddLine, RiUserFollowLine } from "react-icons/ri";
import { Apartment } from "@mui/icons-material";

// Sidebar configuration extracted outside component to avoid re-creation.
const baseSidebarList = [
  { id: 0, name: "نگاه کلی", icon: <MenuIcon />, url: "/my-profile" },
  {
    id: 1,
    name: "پُست‌ها",
    icon: <TbNews size={22} />,
    url: "/my-profile/posts",
  },
  {
    id: 2,
    name: "آگهی‌ها",
    icon: <TbSpeakerphone size={22} />,
    url: "/my-profile/advertises",
  },
  {
    id: 3,
    name: "استعلام‌ها",
    icon: <TbMailOpened size={22} />,
    url: "/my-profile/inquiries",
  },
  // پیام‌ها (messages) item will receive dynamic badgeCount
  {
    id: 4,
    name: "پیام‌ها",
    icon: <PiChatCenteredTextBold size={22} />,
    url: "/my-profile/messages",
  },
  {
    id: 5,
    name: "شرکت های من",
    icon: <Apartment />,
    url: "/my-profile/my-companies",
  },
  {
    id: 6,
    name: "دنبال‌کننده‌ها",
    icon: <RiUserAddLine size={22} />,
    url: "/my-profile/followers",
  },
  {
    id: 7,
    name: "دنبال شده‌ها",
    icon: <RiUserFollowLine />,
    url: "/my-profile/following",
  },
];

// Paths where left sidebar (extra widgets) should appear
const leftSidebarPaths = ["/my-profile", "/my-profile/posts"] as const;

interface UserDetailsResponse extends IAPIResult<any> {}

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentPath = usePathname();
  const { user, isUserLoaded, isAuthenticated } = useUserState();
  const { checkAuth } = useAuthCheck();
  const router = useRouter();
  const authCheckDone = useRef(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasFetchedDetails, setHasFetchedDetails] = useState(false); // prevent duplicate fetch
  const [userDetailsError, setUserDetailsError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Derived sidebar list with unread badge
  const sidebarList = React.useMemo(() => {
    return baseSidebarList.map((item) =>
      item.id === 4 ? { ...item, badgeCount: unreadCount } : item
    );
  }, [unreadCount]);

  const isDashboardPage = currentPath.includes("/my-profile/dashboard");
  const showLeftSidebar = leftSidebarPaths.includes(currentPath as any);

  // One-time auth check when user state known
  useEffect(() => {
    if (isUserLoaded && !authCheckDone.current) {
      authCheckDone.current = true;
      if (!checkAuth("برای مشاهده پروفایل خود وارد شوید.")) {
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoaded, isAuthenticated, checkAuth]);

  // Fetch user details only if we have a userId and haven't fetched yet.
  useEffect(() => {
    const fetch = async () => {
      if (!user.userId || hasFetchedDetails) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await axiosInstance.get<UserDetailsResponse>(
          `${USER_DETAILS}/${user.userId}`
        );
        if (!res?.data?.success) {
          setUserDetailsError("API call unsuccessful");
        }
      } catch (e) {
        setUserDetailsError("Error fetching user data");
      } finally {
        setHasFetchedDetails(true);
        setIsLoading(false);
      }
    };
    fetch();
  }, [user.userId, hasFetchedDetails]);

  // Poll unread messages count every 30 seconds while on any my-profile route
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchUnread = async () => {
      try {
        const res = await axiosInstance.get<{ success: boolean; data: number }>(
          MESSAGE_UNREAD
        );
        if (res.data?.success && typeof res.data.data === "number") {
          setUnreadCount(res.data.data);
        }
      } catch (e) {
        // silently ignore
      }
    };

    if (isUserLoaded && isAuthenticated) {
      fetchUnread(); // initial
      intervalId = setInterval(fetchUnread, 30000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isUserLoaded, isAuthenticated]);

  // Unified loading gate
  if (!isUserLoaded || isLoading) return <LoaderComponent />;

  // Dashboard page bypasses wrapper layout
  if (isDashboardPage) return <>{children}</>;

  return (
    <Suspense fallback={<LoaderComponent />}>
      {userDetailsError && !user.fullName && (
        <div className="text-center mt-4">
          <h2>اطلاعات کاربر بارگذاری نشد</h2>
        </div>
      )}
      <UnreadMessagesProvider value={unreadCount}>
        <div dir="rtl" className="mainStyle">
          <UserName
            title={user.fullName || ""}
            membershipPeriod={user.membershipPeriod}
            followerCount={user.followerCount}
            followCount={user.followCount}
            avatar={user.avatar}
            code={user.userName}
            positionTitle={user.defaultPositionTitle}
            companyTitle={user.defaultCompanyTitle}
            companyId={user.defaultCompanyId}
            companyCode=""
            profilePercentage={user?.profilePercentage}
          />
          <div className="dividerStyle">
            <div className={styles.listCompanyStyle}>
              <div className={styles.listCategoryStyle}>
                <SideBar sidebarList={sidebarList} />
              </div>
              <div
                className="mainStyle"
                style={{
                  borderLeft: "1px solid #EEEEEE",
                  borderRight: "1px solid #EEEEEE",
                  height: "100%",
                }}
              >
                {children}
              </div>
            </div>
            {showLeftSidebar && (
              <div
                className="pt-4 pe-4 ps-2 hideInMobileScreen max-w-450 BorderRight"
                style={{ width: "42%" }}
              >
                <SocialMedia url={MINE_SOCIAL_MEDIA} />
                <Advertisments
                  url={MY_ADVERTISE_LIST}
                  title={`آگهی‌های ${user.fullName}`}
                  disableSubmitAdvertise
                  showProduct
                />
                <RecommendedProducts />
                <SideBanner />
              </div>
            )}
          </div>
        </div>
      </UnreadMessagesProvider>
    </Suspense>
  );
}
