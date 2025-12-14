import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import React, { cache } from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";
import styles from "./styles.module.css";
import { notFound } from "next/navigation";
import Footer from "@/Components/Shared/Footer/RowFooter";
import { PAGE_WITH_CODE } from "@/lib/urls";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";

interface Page_res extends IAPIResult<any> {}
interface IdProps {
  params: Promise<{
    id: string;
  }>;
}

const getData = cache(async (id: string) => {
  const response = await axiosInstance.get<Page_res>(
    PAGE_WITH_CODE + id,
    await getServerAxiosConfig()
  );
  return response;
});

export async function generateMetadata(props: IdProps): Promise<Metadata> {
  try {
    const params = await props.params;
    const id = params?.id ?? undefined;
    const response = await getData(id);
    const item = response?.data.data;
    if (!item || !response.data.success) {
      return GetMetadata("صفحه یافت نشد");
    }
    return GetMetadata(item.title, item.lead || item.title);
  } catch (error) {
    return GetMetadata();
  }
}

export default async function page(props: IdProps) {
  const params = await props.params;
  const id = params?.id ?? undefined;
  const response = await getData(id);
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
