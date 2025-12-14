"use client";

import LoaderComponent from "@/Components/LoaderComponent";
import { axiosInstance } from "@/Helpers/axiosInstance";
import {
  MY_NOTIFICATIONS,
  READ_NOTIFICATION,
  READ_NOTIFICATION_ALL,
  USER_CONFIG,
} from "@/lib/urls";
import { Button, Divider, Pagination, Typography } from "@mui/material";
import { Suspense, useEffect, useState } from "react";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { PAGE_SIZE } from "@/lib/constants";
import {
  clearNotificationCount,
  updateNotificationCount,
} from "@/Helpers/utils/notificationEvents";

const Notification = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [markAllLoading, setMarkAllLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<any>(
          `${MY_NOTIFICATIONS}?Size=${PAGE_SIZE}&Page=${pageNumber}`
        );
        if (!response.data.success) {
          return null;
        }

        setTotalCount(response.data.total);
        setItems(response.data.data);

        // Update the unread count based on items
        const unreadCount = response.data.data.filter(
          (item: any) => !item.isRead
        ).length;
        updateNotificationCount(unreadCount);
      } catch (e) {
        console.error("Error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageNumber]);

  const handleReadItem = async (notification: any) => {
    if (!notification.isRead && !expandedItems.has(notification.id)) {
      try {
        const configResponse = await axiosInstance.get<any>(USER_CONFIG);
        if (configResponse.data.success) {
          const currentUnreadCount =
            configResponse.data.data.countUnreadNotification;

          await axiosInstance.post(`${READ_NOTIFICATION}/${notification.id}`);

          setItems((prevItems) => {
            const newItems = prevItems.map((item) =>
              item.id === notification.id ? { ...item, isRead: true } : item
            );

            return newItems;
          });
          const newUnreadCount = Math.max(0, currentUnreadCount - 1);
          updateNotificationCount(newUnreadCount);
        } else {
          await axiosInstance.post(`${READ_NOTIFICATION}/${notification.id}`);
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === notification.id ? { ...item, isRead: true } : item
            )
          );
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  const handleReadAll = async () => {
    if (markAllLoading) return;
    try {
      setMarkAllLoading(true);
      await axiosInstance.post(`${READ_NOTIFICATION_ALL}`);
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setPageNumber(1);

      // Clear all unread notifications in the navbar
      clearNotificationCount();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    } finally {
      setMarkAllLoading(false);
    }
  };

  const toggleExpand = (notification: any) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(notification.id)) {
        newSet.delete(notification.id);
      } else {
        newSet.add(notification.id);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div>
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className="mainStyle">
      <div className="col w-100 p-4 mb-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <Typography className="fs-24 fw-500">اعلان‌ها</Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleReadAll}
            sx={{ mr: 1 }}
          >
            {markAllLoading ? "در حال ثبت..." : "خواندن همه"}
          </Button>
        </div>
        <div className="col BorderBottom w-100 pt-4 mb-3">
          {totalCount > 0 ? (
            <>
              {items.map((item: any, index: number) => {
                const isExpanded = expandedItems.has(item.id);
                const isRead = item.isRead;

                return (
                  <div
                    key={item.id}
                    className="mb-3 clickable"
                    style={{ opacity: isRead ? 0.6 : 1 }}
                    onClick={() => {
                      toggleExpand(item);
                      handleReadItem(item);
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="d-flex align-items-center">
                        <Typography className="fs-18 fw-500">
                          {item.subject}
                        </Typography>
                        <Typography
                          className="fs-12 fw-400 me-2"
                          style={{ color: "#616161" }}
                        >
                          {item.timePast}
                        </Typography>
                      </div>
                      {item.comment.length > 20 && (
                        <Button
                          variant="text"
                          style={{ color: "#fb8c00" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(item);
                          }}
                        >
                          {isExpanded ? "بستن" : "بیشتر"}
                          {isExpanded ? (
                            <KeyboardArrowUpOutlinedIcon
                              sx={{ color: "#fb8c00" }}
                            />
                          ) : (
                            <KeyboardArrowDownOutlinedIcon
                              sx={{ color: "#fb8c00" }}
                            />
                          )}
                        </Button>
                      )}
                    </div>
                    <Typography className="fs-14 fw-400 mb-2">
                      {isRead ? (
                        <DoneAllIcon
                          className="ms-2"
                          sx={{ color: "#1BA49D" }}
                          style={{ width: "12px" }}
                        />
                      ) : (
                        <CircleIcon
                          className="ms-2"
                          sx={{ color: "#fb8c00" }}
                          style={{ width: "9px" }}
                        />
                      )}
                      {isExpanded
                        ? item.comment
                        : item.comment.length > 20
                        ? `${item.comment.substring(0, 20)}...`
                        : item.comment}
                    </Typography>
                    {index !== items.length - 1 && <Divider />}
                  </div>
                );
              })}
              <Suspense fallback={<LoaderComponent />}>
                <Pagination
                  count={Math.ceil(Number(totalCount) / PAGE_SIZE)}
                  page={pageNumber}
                  onChange={(e, page) => setPageNumber(page)}
                  className="mt-3"
                  sx={{
                    "& .MuiPagination-ul": {
                      justifyContent: "center",
                    },
                  }}
                />
              </Suspense>
            </>
          ) : (
            <span>اعلانی برای شما وجود ندارد.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
