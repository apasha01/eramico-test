"use client";

import React, { useEffect, useState } from "react";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { Data } from "@/Helpers/Interfaces/Feed_interface";
import FeedItem from "@/Components/Home/Main/FeedItem";
import { USER_FEED } from "@/lib/urls";
import LoaderComponent from "@/Components/LoaderComponent";

interface Feed_res extends IAPIResult<any> {}

const OverView = ({ id }: { id: number }) => {
  const [items, setItems] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Feed_res>(`${USER_FEED}/${id}`);
      if (response.data.success) {
        setItems(response.data.data);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
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
          <span>پستی توسط این کاربر ثبت نشده است.</span>
        ) : (
          <>
            {items.map((item: Data, index) => (
              <React.Fragment key={`${item.id}_${index}_preload`}>
                <FeedItem item={item} />
                {index % 5 !== 4 &&
                  item?.entityTypeIdentity !== "Advertise" && <Divider />}
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default OverView;
