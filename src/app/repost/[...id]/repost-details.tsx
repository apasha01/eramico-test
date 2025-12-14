"use client";

import { Divider, Typography } from "@mui/material";
import styles from "../../content/[id]/styles.module.css";
import SimplePost from "@/Components/Home/Main/Post/simple-post";
import { Repost as IRepost } from "@/Helpers/Interfaces/Feed_interface";
import BackButton from "@/Components/common/back-button";
import Repost from "@/Components/Home/Main/Post/rePost";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { REPOST_COMMENTS } from "@/lib/urls";
import { toast } from "react-toastify";
import ReplyToPost from "@/Components/common/reply-to-post";
import LoaderComponent from "@/Components/LoaderComponent";
import { APP_NAME } from "@/lib/metadata";

interface RepostDetailsProps {
  repost?: IRepost;
  post: any;
  vote: any;
  content: any;
  showFullPost?: boolean;
}

export default function RepostDetails({
  repost,
  vote,
  post,
  content,
  showFullPost = false,
}: RepostDetailsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<any>(
        `${REPOST_COMMENTS}/${repost?.id}`
      );
      if (response.data.success) {
        setComments(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [repost?.id]);

  return (
    <div className={styles.postDetailMainStyle}>
      <div className={styles.postBoxButtonStyle}>
        <Typography variant="body2" className={styles.postBoxButtonTextStyle}>
          پست
        </Typography>
        <BackButton />
      </div>
      <Repost
        to={undefined}
        avatar={
          repost?.companyAvatar || repost?.userAvatar
            ? repost?.companyId
              ? repost?.companyAvatar
              : repost?.userAvatar
            : null
        }
        username={
          repost?.companyId ? repost?.companyCode : repost?.userName || ""
        }
        companyId={repost?.companyId}
        userId={repost?.userId}
        name={
          repost?.companyId || repost?.userId
            ? repost?.companyId
              ? repost?.companyTitle
              : repost?.userFullName
            : APP_NAME
        }
        isLiked={false}
        description={repost?.context || ""}
        createdDate={repost?.timePast || repost?.createdDatePersian || ""}
        commentCount={repost?.commentCount || 0}
        repostCount={repost?.repostCount || 0}
        showFullPost={showFullPost}
        likeCount={repost?.likeCount || 0}
        entityId={repost?.id || 0}
        entityTypeIdentity={repost?.entityTypeIdentity}
        entityTypeId={repost?.entityTypeId}
        userCompanyId={repost?.userCompanyId || undefined}
        userCompanyTitle={repost?.userCompanyTitle || undefined}
        userPositionTitle={repost?.userPositionTitle || undefined}
        post={post}
        vote={vote}
        content={content}
        repost={repost}
        repostedEntityTypeIdentity={repost?.repostedEntityTypeIdentity}
        repostedEntityTypeId={repost?.repostedEntityTypeId}
        disableComment
      />
      <div className="w-100 pt-5">
        <Typography variant="body2" className={styles.postBoxButtonTextStyle}>
          پاسخ‌ها ({comments.length || 0})
        </Typography>
      </div>
      <div className="w-100 pt-5">
        <ReplyToPost
          name={
            repost?.companyId || repost?.userId
              ? repost?.companyId
                ? repost?.companyTitle
                : repost?.userFullName
              : APP_NAME
          }
          username={
            repost?.companyId ? repost?.companyCode : repost?.userName || ""
          }
          entityId={repost?.id || 0}
          entityTypeId={repost?.entityTypeId}
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
              showFullPost={showFullPost}
              key={item.id}
              avatar={item?.userAvatar}
              userId={repost?.userId}
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
