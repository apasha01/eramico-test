"use client";

import { Divider, Typography } from "@mui/material";
import styles from "../../content/[id]/styles.module.css";
import SimplePost from "@/Components/Home/Main/Post/simple-post";
import { Vote } from "@/Helpers/Interfaces/Feed_interface";
import BackButton from "@/Components/common/back-button";
import VotingPost from "@/Components/Home/Main/Post/voting-post";
import LoaderComponent from "@/Components/LoaderComponent";
import { useEffect, useState } from "react";
import { VOTE_COMMENTS } from "@/lib/urls";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { toast } from "react-toastify";
import ReplyToPost from "@/Components/common/reply-to-post";
import { APP_NAME } from "@/lib/metadata";

interface VoteDetailsProps {
  vote?: Vote;
}

export default function VoteDetails({ vote }: VoteDetailsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<any>(
        `${VOTE_COMMENTS}/${vote?.id}`
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
  }, []);

  return (
    <div className={styles.postDetailMainStyle}>
      <div className={styles.postBoxButtonStyle}>
        <Typography variant="body2" className={styles.postBoxButtonTextStyle}>
          پست
        </Typography>
        <BackButton />
      </div>
      <VotingPost
        avatar={
          vote?.companyAvatar || vote?.userAvatar
            ? vote?.companyId
              ? vote?.companyAvatar
              : vote?.userAvatar
            : null
        }
        username={vote?.companyId ? vote?.companyCode : vote?.userName || ""}
        userId={vote?.userId}
        companyId={vote?.companyId}
        name={
          vote?.companyId || vote?.userId
            ? vote?.companyId
              ? vote?.companyTitle
              : vote?.userFullName
            : APP_NAME
        }
        createdDate={vote?.timePast || vote?.createdDatePersian || ""}
        text={vote?.title || ""}
        options={vote?.options || []}
        totalVisit={vote?.participantCount}
        commentCount={vote?.commentCount || 0}
        repostCount={vote?.repostCount || 0}
        likeCount={vote?.likeCount || 0}
        entityId={vote?.id || 0}
        entityTypeIdentity={vote?.entityTypeIdentity}
        entityTypeId={vote?.entityTypeId}
        isLiked={vote?.isLiked}
        userCompanyId={vote?.userCompanyId}
        userCompanyTitle={vote?.userCompanyTitle}
        userPositionTitle={vote?.userPositionTitle}
        disableComment
        isParticipated={vote?.isParticipated}
      />
      <div className="w-100 pt-5">
        <Typography variant="body2" className={styles.postBoxButtonTextStyle}>
          پاسخ‌ها ({comments.length || 0})
        </Typography>
      </div>

      <div className="w-100 pt-5">
        <ReplyToPost
          name={
            vote?.companyId || vote?.userId
              ? vote?.companyId
                ? vote?.companyTitle
                : vote?.userFullName
              : APP_NAME
          }
          username={vote?.companyId ? vote?.companyCode : vote?.userName || ""}
          entityId={vote?.id || 0}
          entityTypeId={vote?.entityTypeId}
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
              showFullPost
              key={item.id}
              avatar={
                item?.companyAvatar || item?.userAvatar
                  ? item?.companyId
                    ? item?.companyAvatar
                    : item?.userAvatar
                  : null
              }
              userId={vote?.userId}
              username={item?.userName || ""}
              name={item?.userFullName}
              description={item?.body || ""}
              createdDate={item?.timePast || item?.createdDatePersian || ""}
              entityId={item?.id || 0}
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
