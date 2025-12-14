"use client";

import { CommentInterface } from "@/Helpers/Interfaces/CommentInterface";
import SimplePost from "../Home/Main/Post/simple-post";
import Pagination from "../common/pagination";

interface NewsCommentListProps {
  data: CommentInterface[];
  total: number;
  newsId?: string | number;
  page: number;
}

export default function NewsCommentList(props: NewsCommentListProps) {
  if (props.data.length === 0) return null;
  return (
    <>
      {props.data.map((comment: CommentInterface) => (
        <div className="BorderBottom w-100" key={comment.id}>
          <SimplePost
            showFullPost
            username={comment.senderName || ""}
            description={comment.userFullName || ""}
            createdDate={comment.timePast || comment?.createdDatePersian || ""}
            text={comment.body || ""}
            avatar={comment.userAvatar || null}
            disablePostOption={true}
            isLiked={false}
            entityId={comment.entityId}
            entityTypeId={comment.entityTypeId}
            entityTypeIdentity="Post"
            userCompanyId={comment.userCompanyId}
            userCompanyTitle={comment.userCompanyTitle || undefined}
            userPositionTitle={comment.userPositionTitle || undefined}
            verified={comment.userIsVerified}
            id={comment.id}
          />
        </div>
      ))}

      <Pagination
        currentPage={props.page}
        count={props.total}
        url={`/news/${props.newsId}`}
        searchParams={{ page: props.page.toString() }}
      />
    </>
  );
}
