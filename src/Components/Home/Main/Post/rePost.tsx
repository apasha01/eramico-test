"use client";

import { Typography } from "@mui/material";
import Link from "next/link";
import PostCard, { Post } from "./post-card";
import SimplePost from "./simple-post";
import { SINGLE_CONTENT, SINGLE_POST } from "@/lib/internal-urls";
import VotingPost from "./voting-post";
import Image from "next/image";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { saveEntityClick } from "@/Helpers/Utilities";
import { APP_NAME } from "@/lib/metadata";

interface SimplePostProps extends Post {
  text?: string;
  title?: string;
  lead?: string;
  post?: any;
  repost?: any;
  vote?: any;
  content?: any;
  media?: any;
  showFullPost: boolean;
  repostedEntityTypeIdentity?: string;
  repostedEntityTypeId?: number;
}
export default function Repost({
  text,
  title,
  lead,
  media,
  showFullPost = true,
  ...rest
}: SimplePostProps) {
  const sanitizedHtml = text?.replace(/\r?\n|\\r\\n|\\n/g, "<br />");   
  const {
    post,
    repostedEntityTypeIdentity,
    repostedEntityTypeId,
    vote,
    content,
    repost,
  } = rest;

  const handleVisit = async (entityTypeId?: number, id?: number) => {
    try {
      await saveEntityClick(id || 0, entityTypeId || EntityTypeEnum.Repost);
    } catch {
      console.error("Error in Submitting visit");
    }
  };

  const handleVisitUser = async (userType: string, id?: number) => {
    const entityType =
      userType === "user" ? EntityTypeEnum.User : EntityTypeEnum.Company;
    try {
      await saveEntityClick(id ?? 0, entityType);
    } catch {
      console.error("Error in Submitting visit");
    }
  };

  const renderComponent = () => {
    switch (repostedEntityTypeIdentity) {
      case "Post":
        return (
          <SimplePost
            showFullPost={showFullPost}
            to={`${SINGLE_POST(post?.id, post?.title)}`}
            avatar={
              post?.companyAvatar || post?.userAvatar
                ? post?.companyId
                  ? post?.companyAvatar
                  : post?.userAvatar
                : null
            }
            username={post?.userName || ""}
            companyId={post?.companyId}
            userId={post?.userId}
            name={
              post?.companyId || post?.userId
                ? post?.companyId
                  ? post?.companyTitle
                  : post?.userFullName
                : APP_NAME
            }
            isLiked={post?.isLiked}
            description={post?.context || ""}
            createdDate={post?.timePast || post?.createdDatePersian || ""}
            userCompanyId={post?.userCompanyId}
            userCompanyTitle={post?.userCompanyTitle}
            userPositionTitle={post?.userPositionTitle}
            entityId={post?.id}
            entityTypeIdentity={repostedEntityTypeIdentity}
            entityTypeId={repostedEntityTypeId}
            disablePostOption
            media={
              post?.medias?.length > 0
                ? post?.medias[0].mediaSourceFileName
                : ""
            }
            handleClick={() => handleVisit(repostedEntityTypeId, post.id)}
            handleUserClick={() =>
              handleVisitUser(
                post?.companyId ? "company" : "user",
                post?.companyId || post?.userId
              )
            }
            verified={
              post?.companyId ? post?.companyIsVerified : post?.userIsVerified
            }
          />
        );

      case "Vote":
        return (
          <VotingPost
            showFullPost={showFullPost}
            to={`/vote/${vote.id}`}
            avatar={
              vote.companyAvatar || vote.userAvatar
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
            entityId={vote?.id || 0}
            entityTypeIdentity={repostedEntityTypeIdentity}
            entityTypeId={repostedEntityTypeId}
            isLiked={vote?.isLiked}
            userCompanyId={vote?.userCompanyId}
            userCompanyTitle={vote?.userCompanyTitle}
            userPositionTitle={vote?.userPositionTitle}
            disablePostOption
            verified={
              vote?.companyId ? vote?.companyIsVerified : vote?.userIsVerified
            }
          />
        );

      case "Content":
        return (
          <SimplePost
            showFullPost={showFullPost}
            id={content?.id}
            to={SINGLE_CONTENT(content?.id?.toString())}
            createdDate={content?.timePast || content?.createdDatePersian || ""}
            commentCount={content?.commentCount || 0}
            repostCount={content?.repostCount || 0}
            likeCount={content?.likeCount || 0}
            text={content?.body || ""}
            title={content?.title || ""}
            lead={content?.lead || ""}
            entityId={content?.id || 0}
            entityTypeIdentity={repostedEntityTypeIdentity}
            entityTypeId={repostedEntityTypeId}
            isLiked={content.isLiked}
            userCompanyId={content?.userCompanyId}
            userCompanyTitle={content?.userCompanyTitle}
            userPositionTitle={content?.userPositionTitle}
            disablePostOption
            handleClick={() => handleVisit(repostedEntityTypeId, content.id)}
          />
        );

      case "Repost":
        return (
          <Repost
            to={`/repost/${repost.id}`}
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
            isLiked={repost.isLiked}
            description={repost?.context || ""}
            createdDate={repost?.timePast || repost?.createdDatePersian || ""}
            repostCount={repost?.repostCount || 0}
            commentCount={repost?.commentCount || 0}
            likeCount={repost?.likeCount || 0}
            entityId={repost.entityId || 0}
            entityTypeIdentity={repost.entityTypeIdentity}
            entityTypeId={repost.entityTypeId || 0}
            userCompanyId={repost?.userCompanyId}
            showFullPost={showFullPost}
            userCompanyTitle={repost?.userCompanyTitle}
            userPositionTitle={repost?.userPositionTitle}
            repostedEntityTypeIdentity={repost?.repostedEntityTypeIdentity}
            repostedEntityTypeId={repost?.repostedEntityTypeId}
            disablePostOption
            handleClick={() =>
              handleVisit(repost.entityTypeId, repost.entityId)
            }
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
          />
        );

      default:
        break;
    }
  };

  return (
    <PostCard showFullPost={showFullPost} {...rest}>
      <>
        <Link
          href={rest.to || "javascript:void(0)"}
          className="text-decoration-none"
          passHref
        >
          <div style={{ padding: "5px 75px 15px 10px" }}>
            {title && (
              <Typography variant="body1" className=" fs-14 fw-500 pb-1">
                {title}
              </Typography>
            )}

            {sanitizedHtml && (
              <Typography
                variant="body1"
                className="fs-14 fw-500"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
            )}
            {media && (
              <Image
                alt="عکس پست"
                src={media}
                width={0}

                height={0}
                sizes="100vw"
                style={{ height: "auto", width: "60%" }}
                loading="lazy"
              />
            )}
          </div>
        </Link>
        {(post || vote || content || repost) && (
          <div
            className="border mx-4 px-3 mb-3"
            style={{ borderRadius: "25px" }}
          >
            {renderComponent()}
          </div>
        )}
      </>
    </PostCard>
  );
}
