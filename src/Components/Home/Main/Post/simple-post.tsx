"use client";

import React from "react";
import PostCard, { Post } from "./post-card";

interface SimplePostProps extends Post {
  text?: string;
  title?: string;
  isMine?: boolean;
  lead?: string;
  showFullPost: boolean;
  media?: string;
}
export default function SimplePost({
  id,
  text,
  title,
  isMine = false,
  showFullPost = false,
  lead,
  media,
  ...rest
}: SimplePostProps) {
  return (
    <PostCard
      title={title}
      {...rest}
      isMine={isMine}
      id={id}
      showFullPost={showFullPost}
      lead={lead}
      media={media}
    ></PostCard>
  );
}
