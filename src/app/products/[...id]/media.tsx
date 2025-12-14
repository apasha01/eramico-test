"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { HeaderProps } from "./product-details";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import LoaderComponent from "@/Components/LoaderComponent";
import { CONTENT_LIST } from "@/lib/urls";
import NewsItem from "@/app/news/news-item";

interface Media_res extends IAPIResult<any> {}

const Media: React.FC<HeaderProps> = (props) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<Media_res>(
          `${CONTENT_LIST}?ProductId=${props.id}`
        );
        const items = response.data.data;

        setData(items);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [props.id]);

  if (loading) {
    return (
      <div>
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className="mainStyle">
      <div className="listStyle">
        {data.length !== 0 ? (
          data.map((item) => (
            <NewsItem
              key={item.id}
              id={item.id}
              title={item.title}
              lead={item.lead}
              image={item.image}
              publishDatePersian={
                item.publishDatePersian ||
                item.lastModifiedDatePersian ||
                item.createdDatePersian ||
                "تاریخ نامشخص"
              }
            />
          ))
        ) : (
          <span className="text-nowrap p-4">
            اخباری برای این محصول یافت نشد.
          </span>
        )}
      </div>
    </div>
  );
};
export default Media;
