import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { COMPANY_MEDIA } from "@/lib/urls";
import MediaItem from "./@componenets/media-item";
import { useEffect, useState } from "react";

export default function Media({ id }: { id: number }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const response = await axiosInstance.get<any>(`${COMPANY_MEDIA}/${id}`);
    if (response.data.success === false) {
      return null;
    }

    const items = response.data.data.map(
      (item: {
        mediaId: any;
        mediaSourceFileName: string;
        note: string | null;
        mediaTitle: string | null;
        timePast: string | null;
        visitCount: number;
      }) => ({
        id: item.mediaId,
        image: item.mediaSourceFileName,
        text: item.note ? item.note : item.mediaTitle,
        timePast: item.timePast,
        visitCount: item.visitCount,
      })
    );

    setItems(items);
  };

  return (
    <div className="mainStyle">
      <div className="col w-100 p-4">
        <Typography className="fs-19 fw-500 ">رسانه‌ها</Typography>
      </div>
      <div className={`${styles.mediaList} d-grid px-4 w-100`}>
        {items.length !== 0 ? (
          items.map((item: any) => <MediaItem {...item} key={item.id} />)
        ) : (
          <span>رسانه‌ای برای این شرکت یافت نشد.</span>
        )}
      </div>
    </div>
  );
}
