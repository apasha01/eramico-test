"use client";

import React, { useEffect, useState } from "react";
import { Data } from "@/Helpers/Interfaces/Feed_interface";
import SimplePost from "./Post/simple-post";
import VotingPost from "./Post/voting-post";
import { SINGLE_CONTENT, SINGLE_POST } from "@/lib/internal-urls";
import Repost from "./Post/rePost";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { FEED_SET_READ } from "@/lib/urls";
import useIntersectionObserver from "@/Helpers/CustomHooks/intersection-observer ";
import { getToken_Localstorage } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import AdvertiseItem from "@/Components/common/advertise-item";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { saveEntityClick } from "@/Helpers/Utilities";
import { APP_NAME } from "@/lib/metadata";

interface FeedItemProps {
  item: Data;
  handleLoadMore?: any;
  showFullPost?: boolean;
  isSmall?: boolean;
  markRead?: boolean;
  isMine?: boolean;
}

const FeedItem = ({
  item,
  handleLoadMore,
  showFullPost = false,
  isSmall,
  markRead = true,
  isMine = false,
}: FeedItemProps) => {
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    if (getToken_Localstorage()) {
      setHasToken(true);
    }
  }, [item, markRead]);

  const [marked, setMarked] = useState(false);
  const markAsRead = async () => {
    if (handleLoadMore) handleLoadMore();
    if (marked || item.isRead || !hasToken) return;
    if (item.entityTypeId != EntityTypeEnum.Content) {
      setMarked(true);
      try {
        await axiosInstance.post(
          `${FEED_SET_READ}?EntityTypeId=${item.entityTypeId}&entityId=${item.entityId}`
        );
      } catch (error) {
        console.error("Failed to mark post as read:", error);
      }
    }
    if (handleLoadMore) handleLoadMore();
  };

  const handleVisit = async (entityTypeId?: number, id?: number) => {
    if (id && entityTypeId && markRead != true) {
      try {
        await saveEntityClick(id || 0, entityTypeId || 0);
      } catch {
        console.error("Error in Submitting visit");
      }
    }
  };

  const handleVisitUser = async (userType: string, id?: number) => {
    if (markRead != true) {
      const entityType =
        userType === "user" ? EntityTypeEnum.User : EntityTypeEnum.Company;
      try {
        await saveEntityClick(id ?? 0, entityType);
      } catch {
        console.error("Error in Submitting visit");
      }
    }
  };

  const ref = useIntersectionObserver(markAsRead, {
    threshold: 0.9,
  });

  const renderComponent = (item: Data) => {
    const { post, repost, content, vote, advertise } = item;
    switch (item?.entityTypeIdentity) {
      case "Post":
        return (
          <SimplePost
            id={item?.entityId || ""}
            to={`${SINGLE_POST(item?.entityId?.toString() || "", post?.title)}`}
            avatar={
              post?.companyAvatar || post?.userAvatar
                ? post?.companyId
                  ? post?.companyAvatar
                  : post?.userAvatar
                : null
            }
            companyId={post?.companyId}
            userId={post?.userId}
            isMine={isMine}
            username={
              post?.companyId ? post?.companyCode : post?.userName || ""
            }
            name={
              post?.companyId || post?.userId
                ? post?.companyId
                  ? post?.companyTitle
                  : post?.userFullName
                : APP_NAME
            }
            isLiked={item?.isLiked}
            description={post?.context || ""}
            createdDate={post?.timePast || post?.createdDatePersian || ""}
            repostCount={post?.repostCount || 0}
            commentCount={post?.commentCount || 0}
            likeCount={post?.likeCount || 0}
            entityId={item?.entityId || 0}
            entityTypeIdentity={item?.entityTypeIdentity}
            entityTypeId={item?.entityTypeId || 0}
            userCompanyId={post?.userCompanyId}
            showFullPost={showFullPost}
            userCompanyTitle={post?.userCompanyTitle}
            userPositionTitle={post?.userPositionTitle}
            media={
              post?.medias?.length > 0
                ? post?.medias[0].mediaSourceFileName
                : ""
            }
            lead={content?.lead || ""}
            handleClick={() => handleVisit(item.entityTypeId, item.entityId)}
            handleUserClick={() =>
              handleVisitUser(
                post?.companyId ? "company" : "user",
                post?.companyId || post?.userId
              )
            }
            verified={
              post?.companyId ? post?.companyIsVerified : post?.userIsVerified
            }
            createdDatePersian={item?.createdDatePersian}
          />
        );

      case "Repost":
        return (
          <Repost
            id={item?.entityId || ""}
            isMine={isMine}
            to={`/repost/${item?.entityId}`}
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
            isLiked={item?.isLiked}
            description={repost?.context || ""}
            createdDate={repost?.timePast || repost?.createdDatePersian || ""}
            repostCount={repost?.repostCount || 0}
            commentCount={repost?.commentCount || 0}
            likeCount={repost?.likeCount || 0}
            entityId={item?.entityId || 0}
            entityTypeIdentity={item?.entityTypeIdentity}
            entityTypeId={item?.entityTypeId || 0}
            userCompanyId={repost?.userCompanyId}
            userCompanyTitle={repost?.userCompanyTitle}
            userPositionTitle={repost?.userPositionTitle}
            showFullPost={showFullPost}
            post={repost?.post}
            vote={repost?.vote}
            content={repost?.content}
            repost={repost?.repost}
            repostedEntityTypeIdentity={repost?.repostedEntityTypeIdentity}
            media={
              repost?.medias?.length > 0
                ? item?.post?.medias[0].mediaSourceFileName
                : ""
            }
            repostedEntityTypeId={repost?.repostedEntityTypeId}
            handleClick={() => handleVisit(item.entityTypeId, item.entityId)}
            handleUserClick={() =>
              handleVisitUser(
                repost?.companyId ? "company" : "user",
                repost?.companyId || repost?.userId
              )
            }
            verified={
              repost?.companyId
                ? repost?.companyIsVerified
                : repost?.userIsVerified
            }
            createdDatePersian={item?.createdDatePersian}
          />
        );

      case "Content":
        return (
          <SimplePost
            id={item?.entityId || 0}
            to={SINGLE_CONTENT(item?.entityId || 0)}
            createdDate={content?.timePast || content?.createdDatePersian || ""}
            commentCount={content?.commentCount || 0}
            repostCount={content?.repostCount || 0}
            likeCount={content?.likeCount || 0}
            text={content?.body || ""}
            title={content?.title || ""}
            lead={content?.lead || ""}
            entityId={item?.entityId || 0}
            showFullPost={showFullPost}
            isMine={isMine}
            entityTypeIdentity={item?.entityTypeIdentity}
            entityTypeId={item?.entityTypeId || 0}
            avatar={content?.image || null}
            isLiked={item.isLiked}
            userCompanyId={content?.userCompanyId}
            userCompanyTitle={content?.userCompanyTitle}
            userPositionTitle={content?.userPositionTitle}
            handleClick={() => handleVisit(item.entityTypeId, item.entityId)}
            createdDatePersian={item?.createdDatePersian}
          />
        );

      case "Vote":
        return (
          <VotingPost
            showFullPost={showFullPost}
            id={item?.entityId}
            isMine={isMine}
            to={`/vote/${item?.entityId}`}
            avatar={
              vote?.companyAvatar || vote?.userAvatar
                ? vote?.companyId
                  ? vote?.companyAvatar
                  : vote?.userAvatar
                : null
            }
            username={
              vote?.companyId ? vote?.companyCode : vote?.userName || ""
            }
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
            entityId={item?.entityId}
            entityTypeIdentity={item?.entityTypeIdentity}
            entityTypeId={item?.entityTypeId || 0}
            isLiked={item.isLiked}
            userCompanyId={vote?.userCompanyId}
            userCompanyTitle={vote?.userCompanyTitle}
            userPositionTitle={vote?.userPositionTitle}
            handleClick={() => handleVisit(item.entityTypeId, item.entityId)}
            handleUserClick={() =>
              handleVisitUser(
                vote?.companyId ? "company" : "user",
                vote?.companyId || vote?.userId
              )
            }
            verified={
              vote?.companyId ? vote?.companyIsVerified : vote?.userIsVerified
            }
            createdDatePersian={item?.createdDatePersian}
            isParticipated={vote?.isParticipated}
          />
        );

      case "Advertise":
        return (
          <AdvertiseItem
            id={item?.entityId}
            isSmall={isSmall}
            faTitle={advertise?.productTitle || ""}
            enTitle={advertise?.productEngTitle || ""}
            date={advertise?.expirationRemained || ""}
            name={
              advertise?.companyId
                ? advertise?.companyTitle
                : advertise?.userFullName
            }
            subscriptionAvatar={advertise?.subscriptionAvatar}
            verified={
              advertise?.companyId
                ? advertise?.companyIsVerified
                : advertise?.userIsVerified
            }
            isSafe={advertise?.companyIsSafe}
            amount={advertise?.amount}
            amountUnit={advertise?.amountUnitPropertyTitle}
            wrapperClassName={`${isSmall ? "small" : ""}`}
            advertiseTypeId={advertise?.advertiseTypeId}
            price={advertise?.price}
            companyId={advertise?.companyId}
            priceUnit={advertise?.priceUnitPropertyTitle}
            userId={advertise?.userId}
            productId={advertise?.productId}
            advertiseStatusTitle={""}
          />
        );
      default:
        return null;
    }
  };

  return <div ref={ref}>{renderComponent(item)}</div>;
};

export default React.memo(FeedItem);
