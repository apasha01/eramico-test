"use client";

import { Button, Typography } from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { LeftArrow, RightArrow } from "./arrow";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { COMPANY_MEDIA } from "@/lib/urls";
import { useEffect, useState } from "react";
import MediaItem from "./media-item";

interface MediaProps {
  onSelect: any;
  id: number;
}

export default function Media({ onSelect, id }: MediaProps) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const response = await axiosInstance.get<any>(`${COMPANY_MEDIA}/${id}`);
    if (response.data.success === false) {
      return null;
    }

    const items = response.data.data
      .slice(0, 5)
      .map(
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
      <div className="col BorderBottom w-100 p-4">
        <Typography className="fs-19 fw-500 mb-2">رسانه‌ها</Typography>
        {items.length !== 0 ? (
          <>
            <div className="position-relative">
              <ScrollMenu
                LeftArrow={LeftArrow}
                RightArrow={RightArrow}
                options={{
                  ratio: 0.9,
                  rootMargin: "5px",
                  threshold: [0.5, 1],
                }}
                RTL={true}
                noPolyfill={true}
              >
                {items.map((item: any) => (
                  <MediaItem {...item} key={item.id} />
                ))}
              </ScrollMenu>
            </div>
            <div style={{ marginBottom: "8px", marginTop: "24px" }}>
              <Button
                variant="outlined"
                endIcon={
                  <IoArrowBack size={18} style={{ marginLeft: "-8px" }} />
                }
                className="d-flex align-items-center justify-content-center fs-13 border-0 flex-nowrap"
                style={{
                  color: "#424242",
                  background: "#FAFAFA",
                  height: "42px",
                  gap: "10px",
                  fontSize: "13px",
                  width: "fit-content",
                }}
                onClick={() => onSelect(1)}
              >
                مشاهده همه
              </Button>
            </div>
          </>
        ) : (
          <span>رسانه‌ای برای این شرکت یافت نشد.</span>
        )}
      </div>
    </div>
  );
}
