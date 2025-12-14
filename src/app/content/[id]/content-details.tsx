"use client";

import { Divider } from "@mui/material";
import styles from "../../content/[id]/styles.module.css";
import SimplePost from "@/Components/Home/Main/Post/simple-post";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { CONTENT_COMMENTS } from "@/lib/urls";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import LoaderComponent from "@/Components/LoaderComponent";
import Comment from "@/Components/NewsCards/newsComment";
import ReplyToContent from "./reply-to-content";

interface ContentDetailsProps {
  content: any;
}

export default function ContentDetails({ content }: ContentDetailsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<any>(
        `${CONTENT_COMMENTS}/${content?.id}`
      );
      if (response.data.success) {
        setComments(response.data.data);
      } else {
        toast.error("Failed to load comments.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [content?.id]);

  return (
    <div className={styles.postDetailMainStyle}>
      <div className="BorderBottom w-100">
        <ReplyToContent
          commentCount={comments.length || 0}
          entityId={content.id}
          entityTypeId={content.entityTypeId}
          reloadComments={fetchComments}
        />
      </div>

      <Divider className="mt-3" />
      {loading ? (
        <div className="d-flex justify-content-center mt-4">
          <LoaderComponent />
        </div>
      ) : (
        comments.map((item: any) => (
          <SimplePost
          showFullPost={true}
            key={item.id}
            avatar={item?.userAvatar}
            userId={item?.userId}
            username={item?.userName || ""}
            name={item?.userFullName}
            description={item?.body || ""}
            createdDate={item?.timePast || item?.createdDatePersian || ""}
            userCompanyId={item?.userCompanyId}
            userCompanyTitle={item?.userCompanyTitle}
            userPositionTitle={item?.userPositionTitle}
            disablePostOption
          />
        ))
      )}
    </div>
  );
}
