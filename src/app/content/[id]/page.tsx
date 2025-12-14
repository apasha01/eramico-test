import React from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { Typography } from "@mui/material";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { notFound } from "next/navigation";
import styles from "./styles.module.css";
import NewsCard from "@/Components/NewsCards/newsCard";
import { CONTENT_COMMENTS, CONTENT_DETAILS } from "@/lib/urls";
import BackButton from "@/Components/common/back-button";
import ContentDetails from "./content-details";

interface NewsId_res extends IAPIResult<any> {}
interface IdProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function page(props: IdProps) {
  const params = await props.params;
  const id = params?.id ?? undefined;
  if (!id) {
    return;
  }
  const response = await axiosInstance.get<NewsId_res>(
    `${CONTENT_DETAILS}/${id}`,
    await getServerAxiosConfig()
  );
  const content = response.data.data;
  const commentResponse = await axiosInstance.get<NewsId_res>(
    `${CONTENT_COMMENTS}/${id}`,
    await getServerAxiosConfig()
  );

  if (!response.data.success || !commentResponse.data.success) {
    return notFound();
  }

  return (
    <div className={styles.postDetailMainStyle}>
      <div className={styles.postBoxButtonStyle}>
        <Typography variant="body2" className={styles.postBoxButtonTextStyle}>
          خبر
        </Typography>
        <BackButton />
      </div>
      <div className="BorderBottom w-100">
        <NewsCard
          source={content?.source || ""}
          lead={content?.lead || ""}
          body={content?.body || ""}
          replyNumber={content?.commentCount || 0}
          recommendNumber={content?.repostCount || 0}
          likeNumber={content?.likeCount || 0}
          title={content?.title || ""}
          // link={content?.sourceURL || ""}
          // postContain={content?.source || ""}
          lastModifiedDatePersian={content?.lastModifiedDatePersian || ""}
          image={content?.image || null}
          tags={content?.tags || []}
          medias={content?.medias || []}
          id={content?.id}
        />
      </div>
      <ContentDetails content={content} />
    </div>
  );
}
