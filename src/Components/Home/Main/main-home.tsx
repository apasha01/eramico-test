"use client";

import { axiosInstance } from "@/Helpers/axiosInstance";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";
import FeedItem from "./FeedItem";
import { Data } from "@/Helpers/Interfaces/Feed_interface";
import { notFound } from "next/navigation";
import Style from "./styles.module.css";
import LoaderComponent from "@/Components/LoaderComponent";
import { BANNER_HOME_FEED, FEED_LIST } from "@/lib/urls";
import { ClickAwayListener, Divider } from "@mui/material";
import Image from "next/image";
import { useAuthCheck } from "@/Hooks/useAuthCheck";
import { FaSpinner } from "react-icons/fa";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { PAGE_SIZE } from "@/lib/constants";
import dynamic from "next/dynamic";

const MostVisitedProducts = dynamic(
  () => import("./most-visited-products/most-visited-products"),
  { ssr: false }
);

const RecommendedProducts = dynamic(
  () => import("./SuggestionGoods/recommended-products"),
  { ssr: false }
);
const SubmitPostForm = dynamic(
  () => import("@/Components/submit-post-form"),
  { ssr: false }
);
const SubmitVoteForm = dynamic(
  () => import("@/Components/submit-vote-form"),
  { ssr: false }
);
const SideBanner = dynamic(
  () => import("@/Components/Home/Sidebar/SideBanner/SideBanner"),
  { ssr: false }
);

/** نتایج API */
interface Feed_res extends IAPIResult<any> {}

/** کلید یکتا برای هر آیتم فید جهت حذف آیتم‌های تکراری */
const getItemKey = (item: Data) => {
  // اگر API در سطح بالا id معنادار ندارد (در نمونه همه 0 بودند)
  // از ترکیب نوع موجودیت و entityId استفاده می‌کنیم
  // مثال‌ها: "Post:19", "Repost:10", "Content:192325", "Advertise:123"
  const type = item?.entityTypeIdentity || "";
  const id =
    item?.entityId ??
    item?.post?.id ??
    item?.repost?.id ??
    item?.content?.id ??
    item?.advertise?.id ??
    item?.id ??
    "";
  return `${type}:${id}`;
};

/** حذف تکراری‌ها با حفظ ترتیب اولین وقوع */
const dedupeByKey = (list: Data[]) => {
  const seen = new Set<string>();
  return list.filter((it) => {
    const k = getItemKey(it);
    if (!k) return true; // اگر به هر دلیلی کلید نداشت، رد نکن
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};
interface MainHomeProps {
  entityTypeId?: EntityTypeEnum | null;
}

export default function MainHome({ entityTypeId }: MainHomeProps) {
  const [feedData, setFeedData] = useState<Data[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { checkAuth } = useAuthCheck();

  const [pageNumber, setPageNumber] = useState(1);
  const pageNumberRef = useRef(1);
  pageNumberRef.current = pageNumber;

  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  countRef.current = count;

  const [totalFeedData, setTotalFeedData] = useState<Data[]>([]);
  const totalFeedDataRef = useRef<Data[]>([]);
  totalFeedDataRef.current = totalFeedData;

  const [loading, setLoading] = useState<boolean>(true);
  const loadingRef = useRef<boolean>(false);
  loadingRef.current = loading;

  const loadMore = useCallback(() => {
    if (
      pageNumberRef.current < Math.ceil(countRef.current / 10) &&
      !loadingRef.current
    ) {
      const lastItemDate =
        totalFeedDataRef.current.length > 0
          ? totalFeedDataRef.current[totalFeedDataRef.current.length - 1]
              .createdDate
          : "";
      const next = pageNumberRef.current + 1;
      setPageNumber(next);
      fetchFeedData(next, lastItemDate);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
    fetchFeedData(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** بنرها */
  const fetchBanners = async () => {
    try {
      const banners = await axiosInstance.get<any>(BANNER_HOME_FEED);
      if (banners.data.success || banners.data.data.length !== 0) {
        setBanners(banners.data.data);
      }
    } catch (err) {
      setError("Failed to load data");
    }
  };

  const fetchFeedData = async (page = 1, date = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get<Feed_res>(
        `${FEED_LIST}?Size=${PAGE_SIZE}&Page=${page}${
          date ? `&date=${date}` : ""
        }${entityTypeId ? `&entityType=${entityTypeId}` : ""}`
      );

      const success = res?.data?.success;
      const data: Data[] = (res?.data?.data as Data[]) || [];
      const total = (res?.data as any)?.total ?? 0;

      if (!success || data.length === 0) {
        if (page === 1) {
          setFeedData([]);
          setTotalFeedData([]);
          setCount(0);
          setError("No data available");
        }
      } else {
        setFeedData(data);
        setCount(total);

        const merged =
          page === 1
            ? dedupeByKey([...data, ...totalFeedDataRef.current])
            : dedupeByKey([...totalFeedDataRef.current, ...data]);

        setTotalFeedData(merged);
      }
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  /** تازه‌سازی */
  const handleRefresh = () => {
    setPageNumber(1);
    // تاریخ را پاک می‌کنیم تا از ابتدا بارگذاری شود
    fetchFeedData(1, "");
    // اسکرول به بالا
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!checkAuth()) {
      return;
    }
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setAnchorEl(null);
  };

  /** وقتی کاربر به آیتم X رسید، اگر 3 تا مونده بود لود بیشتر */
  const handleLoadMore = (index: number) => {
    if (totalFeedDataRef.current.length - (index + 1) === 3) {
      loadMore();
    }
  };

  if (feedData?.length === 0 && !totalFeedDataRef.current.length && loading) {
    return (
      <div className="row mx-0 BorderLeft mobileFlex" dir="rtl">
        <div className="d-flex p-4 pb-0 justify-content-end w-100">
          <button
            type="button"
            className={Style.refresh}
            disabled={loading}
            onClick={handleRefresh}
          >
            تازه‌سازی آخرین مطالب
            {loading && <FaSpinner className={Style.spinnerIcon} />}
          </button>
        </div>
        <LoaderComponent />
      </div>
    );
  }

  if (error === "Failed to load data") {
    return notFound();
  }

  return (
    <div className="row mx-0 BorderLeft mobileFlex" dir="rtl">
      <MostVisitedProducts />
      <div className="d-flex p-4 pb-0 justify-content-between w-100">
        <Image
          src={anchorEl ? "/images/close.png" : "/images/plus.png"}
          alt="تعداد بازدید"
          width={50}
          loading="lazy"
          height={50}
          style={{ zIndex: "1000", bottom: "6%" } as any}
          onClick={handleButtonClick}
          className="position-fixed clickable"
        />
        {anchorEl && (
          <ClickAwayListener onClickAway={handleClose}>
            <div
              style={{
                position: "fixed",
                bottom: "10%",
                right: "2.5%",
                zIndex: 1000,
              }}
            >
              <div
                className="shadow mb-3 p-2 radius-30 d-flex justify-content-between clickable bg-white"
                style={{ width: "200px" }}
                onClick={() => handleOptionSelect("post")}
              >
                <Image
                  src="/images/pencil-minus.png"
                  alt="ارسال پست"
                  loading="lazy"
                  width={20}
                  height={20}
                  className="me-2"
                />
                <span className="w-100 text-center">ارسال پست</span>
              </div>
              <div
                className="shadow mb-3 p-2 radius-30 d-flex justify-content-between clickable bg-white"
                style={{ width: "200px" }}
                onClick={() =>
                  document.getElementById("submit-new-advertise")?.click()
                }
              >
                <Image
                  src="/images/speakerphone.png"
                  alt="ثبت آگهی"
                  loading="lazy"
                  width={20}
                  height={20}
                  className="me-2"
                />
                <span className="w-100 text-center">ثبت آگهی جدید</span>
              </div>
              <div
                className="shadow mb-3 p-2 radius-30 d-flex justify-content-between clickable bg-white"
                style={{ width: "200px" }}
                onClick={() =>
                  document.getElementById("submit-new-inquiry")?.click()
                }
              >
                <Image
                  src="/images/speakerphone.png"
                  alt="ثبت استعلام"
                  loading="lazy"
                  width={20}
                  height={20}
                  className="me-2"
                />
                <span className="w-100 text-center">ثبت استعلام جدید</span>
              </div>
              <div
                className="shadow mb-3 p-2 radius-30 d-flex justify-content-between clickable bg-white"
                style={{ width: "200px" }}
                onClick={() => handleOptionSelect("vote")}
              >
                <Image
                  src="/images/chart.png"
                  alt="ایجاد نظرسنجی"
                  loading="lazy"
                  width={20}
                  height={20}
                  className="me-2"
                />
                <span className="w-100 text-center">ایجاد نظرسنجی</span>
              </div>
            </div>
          </ClickAwayListener>
        )}

        <div className="w-100 d-flex justify-content-end">
          <button
            type="button"
            id="refresh-posts"
            className={Style.refresh}
            onClick={handleRefresh}
            disabled={loading}
          >
            تازه‌سازی آخرین مطالب
            {loading &&  <span className="spinner-border spinner-border-sm ms-2"/>}
          </button>
        </div>
      </div>

      {totalFeedDataRef.current.map((item: Data, index: number) => {
        const key = getItemKey(item) || `${index}`;
        return (
          <React.Fragment key={key}>
            <div id={`feed-item-${index + 1}`}>
              <FeedItem
                key={`${key}_preload`}
                showFullPost={false}
                item={item}
                handleLoadMore={() => handleLoadMore(index)}
              />
            </div>
            {index % 5 !== 4 &&
              item?.entityTypeId !== EntityTypeEnum.Advertise && <Divider />}
            {index === 9 && <RecommendedProducts />}
            {index % 5 === 4 && banners.length > 0 && (
              <SideBanner banner={banners[Math.floor(index / 5)]} zone={1} />
            )}
          </React.Fragment>
        );
      })}

      {totalFeedDataRef.current.length < 10 && <RecommendedProducts />}

      {selectedOption === "post" && (
        <SubmitPostForm onModalClose={() => setSelectedOption(null)} />
      )}
      {selectedOption === "vote" && (
        <SubmitVoteForm onModalClose={() => setSelectedOption(null)} />
      )}
    </div>
  );
}
