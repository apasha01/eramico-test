import React from "react";
import { Typography } from "@mui/material";
import Link from "next/link";
import styles from "./styles.module.css";
import TheAvatar from "@/Components/common/the-avatar";

interface NewsItemProps {
  id: number;
  title: string;
  lead: string;
  publishDatePersian: string;
  image: string;
}

export default function NewsItem({
  id,
  title,
  lead,
  image,
  publishDatePersian,
}: NewsItemProps) {
  return (
    <div className="row w-100 p-3 mb-2 BorderBottom align-items-center news-item">
      {/* 🖼 ستون تصویر */}
      <div className="col-3 col-lg-2 d-flex justify-content-center align-self-start">
        <Link
          href={`/news/${id}`}
          passHref
          className="text-decoration-none d-inline-block text-center"
        >
          <TheAvatar
            name={title}
            src={image || ""}
            height={90}
            width={90}
            variant="square"
          />
        </Link>
      </div>

      {/* 📰 ستون متن */}
      <div className="col-9 col-lg-10 p-2 d-flex flex-column justify-content-between">
        <Link
          href={`/news/${id}`}
          passHref
          className="text-decoration-none d-flex align-items-center row justify-content-start"
        >
          <Typography
            className={`fs-26 ms-2 fw-500 ${styles.newsItemBoxTitle}`}
          >
            {title}
          </Typography>

          <div className="col-12 text-justify mt-3">
            {lead && (
              <Typography
                sx={{ fontSize: { md: "14px", sm: "12px" } }}
                variant="body2"
                className="fw-500"
              >
                {lead.length > 280 ? lead.slice(0, 280) + " ..." : lead}
              </Typography>
            )}
            {publishDatePersian && (
              <div className="d-flex justify-content-end mt-2">
                <Typography
                  sx={{ fontSize: { md: "14px", sm: "12px" } }}
                  variant="body2"
                  className="fw-500"
                >
                  {publishDatePersian.replace("00:00", "").trim()}
                </Typography>
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
