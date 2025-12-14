"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Divider, Typography, CircularProgress, Button } from "@mui/material";
import { Data } from "@/Helpers/Interfaces/Feed_interface";
import LoaderComponent from "@/Components/LoaderComponent";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { MY_POSTS } from "@/lib/urls";
import FeedItem from "@/Components/Home/Main/FeedItem";
import { PAGE_SIZE } from "@/lib/constants";
import { useUserState } from "@/Hooks/useUserState";
import SubmitPostForm from "@/Components/submit-post-form";

interface Post_res extends IAPIResult<Data[]> {}

const Posts = () => {
  const [items, setItems] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const hasFetched = useRef(false);
  const isLoadingRef = useRef(false); // Prevent concurrent requests
  const pageSize = PAGE_SIZE;

  const fetchData = useCallback(
    async (page: number = 1, isLoadMore: boolean = false) => {
      if (isLoadingRef.current) return; // guard
      isLoadingRef.current = true;
      try {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        const params = new URLSearchParams({
          Size: pageSize.toString(),
          Page: page.toString(),
        });
        const response = await axiosInstance.get<Post_res>(
          `${MY_POSTS}?${params}`
        );

        if (response?.data?.success && response.data.data) {
          const newData = response.data.data;
          const total = response.data.total || 0;

          if (isLoadMore) {
            setItems((prev) => {
              const updated = [...prev, ...newData];
              setHasMoreData(updated.length < total);
              return updated;
            });
          } else {
            setItems(newData);
            setHasMoreData(newData.length < total);
          }

          setCurrentPage(page);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        isLoadingRef.current = false;
        if (isLoadMore) setLoadingMore(false);
        else setLoading(false);
      }
    },
    [pageSize]
  );

  // Initial fetch - only run once
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchData(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Removed scroll-based infinite loading; using explicit Load More button now.

  if (loading && !items.length) {
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
          <Typography className="fs-19 fw-500 mb-3">پُست‌ها‌ی من</Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setSelectedOption("post")}
          >
            پست جدید
          </Button>
        </div>
        {selectedOption == "post" && (
          <SubmitPostForm onModalClose={() => setSelectedOption(null)} />
        )}
        <div className="col BorderBottom w-100 p-4 mb-3">
          {items.length > 0 ? (
            <>
              {items.map((item: Data, index: number) => (
                <React.Fragment key={`${item.id}_${index}_preload`}>
                  <FeedItem item={item} markRead={false} showFullPost={false} isMine={true} />
                  {index % 5 !== 4 &&
                    item?.entityTypeIdentity !== "Advertise" && <Divider />}
                </React.Fragment>
              ))}

              <div style={{ textAlign: "center", padding: 20 }}>
                {hasMoreData ? (
                  <Button
                    variant="outlined"
                    onClick={() => fetchData(currentPage + 1, true)}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <CircularProgress size={20} />
                    ) : (
                      <span>نمایش بیشتر</span>
                    )}
                  </Button>
                ) : (
                  items.length > 0 && (
                    <span style={{ color: "#666" }}>
                      همه پست‌های شما نمایش داده شد.
                    </span>
                  )
                )}
              </div>
            </>
          ) : (
            !loading && <span>پستی توسط شما ثبت نشده است.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
