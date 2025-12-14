"use client";

import { Divider, Typography } from "@mui/material";
import styles from "../../content/[id]/styles.module.css";
import SimplePost from "@/Components/Home/Main/Post/simple-post";
import { Post } from "@/Helpers/Interfaces/Feed_interface";
import BackButton from "@/Components/common/back-button";
import ReplyToPost from "@/Components/common/reply-to-post";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { POST_COMMENTS } from "@/lib/urls";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import LoaderComponent from "@/Components/LoaderComponent";
import { APP_NAME } from "@/lib/metadata";

interface PostDetailsProps {
  post: Post;
}

export default function PostDetails({ post }: PostDetailsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<any>(
        `${POST_COMMENTS}/${post.id}`,
        await getServerAxiosConfig()
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
  }, [post.id]);

  return (
    <div className={styles.postDetailMainStyle}>
      <div className={styles.postBoxButtonStyle}>
        <Typography variant="body2" className={styles.postBoxButtonTextStyle}>
          پست
        </Typography>
        <BackButton />
      </div>
      <div className="BorderBottom w-100">
        <SimplePost
          showFullPost={true}
          to={undefined}
          companyId={post?.companyId}
          avatar={
            post?.companyAvatar || post?.userAvatar
              ? post?.companyId
                ? post?.companyAvatar
                : post?.userAvatar
              : null
          }
          username={post?.companyId ? post?.companyCode : post?.userName || ""}
          name={
            post?.companyId || post?.userId
              ? post?.companyId
                ? post?.companyTitle
                : post?.userFullName
              : APP_NAME
          }
          userId={post?.userId}
          isLiked={post?.isLiked}
          description={post?.context || ""}
          createdDate={post?.timePast || post?.createdDatePersian || ""}
          commentCount={post?.commentCount || 0}
          repostCount={post?.repostCount || 0}
          likeCount={post?.likeCount || 0}
          entityId={post?.id || 0}
          entityTypeIdentity={post?.entityTypeIdentity}
          entityTypeId={post?.entityTypeId}
          userCompanyId={post?.userCompanyId || undefined}
          userCompanyTitle={post?.userCompanyTitle || undefined}
          userPositionTitle={post?.userPositionTitle || undefined}
          media={
            post?.medias?.length > 0 ? post?.medias[0].mediaSourceFileName : ""
          }
          disableComment
        />
      </div>
      <div className="w-100 pt-5">
        <Typography variant="body2" className={styles.postBoxButtonTextStyle}>
          پاسخ‌ها ({comments.length || 0})
        </Typography>
      </div>
      <div className="w-100 pt-5">
        <ReplyToPost
          name={
            post?.companyId || post?.userId
              ? post?.companyId
                ? post?.companyTitle
                : post?.userFullName
              : APP_NAME
          }
          username={post?.companyId ? post?.companyCode : post?.userName || ""}
          entityId={post?.id || 0}
          entityTypeId={post?.entityTypeId}
          reloadComments={fetchComments}
        />
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
    </div>
  );
}
