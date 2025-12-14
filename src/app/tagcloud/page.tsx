import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import React, { cache } from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { notFound } from "next/navigation";
import Footer from "@/Components/Shared/Footer/RowFooter";
import { TAG_CLOUD } from "@/lib/urls";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";
import Link from "next/link";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import BackButton from "@/Components/common/back-button";

interface TagCloudItem {
  tagId: number;
  tagTitle: string;
  count: number;
}
interface Page_res extends IAPIResult<TagCloudItem[]> {}

const getData = cache(async (size: number) => {
  const response = await axiosInstance.get<Page_res>(TAG_CLOUD, {
    ...(await getServerAxiosConfig()),
    params: { size },
  });
  return response;
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await getData(30);
    if (!response.data.success) {
      return GetMetadata("خطا در بارگذاری برچسب‌ها");
    }
    return GetMetadata("ابر برچسب‌ها");
  } catch (error) {
    return GetMetadata();
  }
}

export default async function page({
  searchParams,
}: {
  searchParams: { size?: string };
}) {
  const size = searchParams.size ? parseInt(searchParams.size, 10) : 30;
  const response = await getData(size);
  const items = response?.data.data;

  if (!response.data.success) {
    return notFound();
  }

  return (
    <div dir="rtl">
      <div className="headerStyle">
        <div className="headerTitleBoxStyle">
          <div className="headerBackRowStyle">
            <BackButton />
            <div>
              <Typography sx={{ fontSize: "28px", fontWeight: 500 }}>
                ابر برچسب‌ها
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="mainStyle">
        <div className={styles.circleContainer}>
          <div className={styles.circleBorder}>
            <div className={styles.tagsWrapper}>
              {items?.map((item) => (
                <Link
                  key={item.tagId}
                  href={`/tag/${item.tagTitle}`}
                  className={styles.tagItem}
                  style={{
                    fontSize: `${Math.max(12, 12 + item.count * 0.002)}px`,
                  }}
                >
                  {item.tagTitle}{" "}
                  <span className={styles.tagCount}>
                    ({item.count.toLocaleString("fa-IR")})
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
