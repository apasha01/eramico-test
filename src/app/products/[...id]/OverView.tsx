"use client";

import { useEffect, useState } from "react";
import { Divider, CircularProgress } from "@mui/material";
import FeedItem from "@/Components/Home/Main/FeedItem";
import { Data } from "@/Helpers/Interfaces/Feed_interface";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { PRODUCTS_FEED } from "@/lib/urls";
import LoaderComponent from "@/Components/LoaderComponent";

interface Feed_res extends IAPIResult<any> {}

export default function OverViewPostList({ id }: { id: number }) {
  const [items, setItems] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Feed_res>(
        `${PRODUCTS_FEED}/${id}`
      );
      if (response.data.success) {
        setItems(response.data.data);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainStyle">
      <div className="col BorderBottom w-100 p-4 mb-3">
        {loading ? (
          <LoaderComponent />
        ) : items.length === 0 ? (
          <span>پستی در رابطه با این محصول ثبت نشده است.</span>
        ) : (
          <>
            {items.map((item: Data, index) => (
              <div key={`${item.id}_${index}`}>
                <FeedItem item={item} isSmall={true} />
                {index % 5 !== 4 &&
                  item?.entityTypeIdentity !== "Advertise" && <Divider />}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
