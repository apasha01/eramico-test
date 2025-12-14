"use client";

import React from "react";
import FeedItem from "@/Components/Home/Main/FeedItem";
import { Data, TagFeedItem } from "@/Helpers/Interfaces/Feed_interface";
import { Typography } from "@mui/material";
import Link from "next/link";
import BackButton from "@/Components/common/back-button";
import NotFound from "@/app/not-found";
import Pagination from "@/Components/common/pagination";
import { useSearchParams, usePathname } from "next/navigation";

interface TagPageProps {
  id?: number;
  title?: string;
  initialData: TagFeedItem[];
  totalCount: number;
  currentPage: number;
  error: string | null;
}

const PageComponent = ({
  id,
  title,
  initialData = [],
  totalCount = 0,
  currentPage = 1,
  error,
}: TagPageProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tagTitle = title || (initialData[0]?.tagTitle ?? "");

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div dir="rtl">
      <div className="headerStyle">
        <div className="headerTitleBoxStyle">
          <div className="headerBackRowStyle">
            <BackButton />
            <div>
              <Typography sx={{ fontSize: "28px", fontWeight: 500 }}>
                برچسب {tagTitle}
              </Typography>
            </div>
            {totalCount > 0 ? (
              <div>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#757575",
                  }}
                >
                  {" "}
                  ({totalCount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  مطلب)
                </Typography>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div>
          <Link
            href="/tagcloud"
            className="text-blue-500 hover:underline mb-4 inline-block"
          >
            ابر برچسب‌ها
          </Link>
        </div>
      </div>
      <div dir="rtl" className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {!initialData || initialData.length === 0 ? (
            <NotFound message={`مطلبی برای برچسب ${tagTitle} یافت نشد.`} />
          ) : (
            <>
              <div className="space-y-4">
                {initialData.map((item, index) => (
                  <FeedItem
                    key={`${item.entityId}-${item.entityTypeId}-${index}`}
                    item={item as unknown as Data}
                    handleLoadMore={null}
                    showFullPost={false}
                    markRead={true}
                  />
                ))}
              </div>

              <Pagination
                count={totalCount}
                currentPage={currentPage}
                url={pathname}
                searchParams={searchParams}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageComponent;
