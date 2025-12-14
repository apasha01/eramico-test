import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import React, { cache } from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";
import styles from "./styles.module.css";
import Footer from "@/Components/Shared/Footer/RowFooter";
import SendMessage from "./sendMessage";
import { notFound } from "next/navigation";
import { CONTACT_US } from "@/lib/urls";
import { Typography } from "@mui/material";
import MapComponent from "./map";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";

interface ContactUS_res extends IAPIResult<any> {}

const getData = cache(async () => {
  const response = await axiosInstance.get<ContactUS_res>(CONTACT_US, await getServerAxiosConfig());
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
    <div className="mainStyle" dir="rtl">
      <div className={styles.dividerDiv}>
        <div className={styles.informationDiv}>
          <Typography className="fw-500" style={{ fontSize: "32px" }}>
            تماس با ما
          </Typography>
          <div className={styles.col}>
            <div
              dangerouslySetInnerHTML={{ __html: response.data?.data?.body }}
            />
          </div>
          <div className={styles.col}>
            <MapComponent />
          </div>
        </div>
        <div className={styles.divider} />
        <SendMessage />
      </div>
      <Footer />
    </div>
  );
}
