import { CircularProgress, Divider, Typography } from "@mui/material";
import FeedItem from "@/Components/Home/Main/FeedItem";
import { Data } from "@/Helpers/Interfaces/Feed_interface";
import { IAPIResult } from "@/Helpers/IAPIResult";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { COMPANY_FEED } from "@/lib/urls";

interface Feed_res extends IAPIResult<any> {}

export default function OverViewPostList({ id }: { id: number }) {
  const [items, setItems] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPosts();
  }, [id]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Feed_res>(
        `${COMPANY_FEED}/${id}`
      );
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
        <Typography className="fs-19 fw-500 mb-3">آخرین پُست‌ها‌</Typography>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <CircularProgress />
          </div>
        ) : items.length === 0 ? (
          <span>پستی توسط این شرکت ثبت نشده است.</span>
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
}
