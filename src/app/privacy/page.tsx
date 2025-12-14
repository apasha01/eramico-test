import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import React, { cache } from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";
import styles from "./styles.module.css";
import { notFound } from "next/navigation";
import Footer from "@/Components/Shared/Footer/RowFooter";
import { PRIVACY } from "@/lib/urls";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";

interface Privacy_res extends IAPIResult<any> {}

const getData = cache(async () => {
  const response = await axiosInstance.get<Privacy_res>(
    PRIVACY,
    await getServerAxiosConfig()
  );
  return response;
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await getData();
    const item = response?.data.data;
    if (!item || !response.data.success) {
      return GetMetadata("صفحه یافت نشد");
    }
    return GetMetadata(item.title, item.lead || item.title);
  } catch (error) {
    return GetMetadata();
  }
}

export default async function page() {
  const response = await getData();
  if (!response.data.success) {
    return notFound();
  }

  return (
    <div className={styles.mainStyle} dir="rtl">
      <div
        className={styles.mainStyle}
        dangerouslySetInnerHTML={{ __html: response?.data?.data?.body }}
      />
      <Footer />
    </div>
  );
}
