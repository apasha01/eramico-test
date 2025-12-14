import React from "react";
import { Chip, Link, Typography } from "@mui/material";
import styles from "./styles.module.css";
import { GrShare } from "react-icons/gr";
import Image from "next/image";
import { mainUrl } from "@/Helpers/axiosInstance/constants";
import NewsOptions from "./newsOptions";
import FallbackImage from "./FallbackImage";

interface NewsProps {
  id: number;
  source: string;
  lead: string;
  body: string;
  replyNumber?: number;
  recommendNumber?: number;
  likeNumber?: number;
  shareNumber?: number;
  lastModifiedDatePersian: string;
  title: string;
  link?: string;
  postContain?: string;
  image?: string | null;
  tags: { tagId: number; tagTitle: string }[];
  medias: {
    mediaModeIdentity: "TitleImage" | "BodyImage" | "Attachment";
    mediaSourceFileName: string;
  }[];
}

export default function NewsCard(props: NewsProps) {
  // replace src="/UserUpload with src="https://eranico.com/UserUpload/
  // and replace \r\n with <br />
    const sanitizedHtml = props?.body
      .replace(/\r\n/g, "<br />")
      .replace(/src="\/UserUpload\//g, 'src="https://eranico.com/UserUpload/');
  const fallbackImage = "/images/fallback.png";

  // Filter media objects that have a length and mediaModeIdentity is "TitleImage"
  const filteredMediasTitle = props?.medias.filter(
    (media) =>
      media.mediaModeIdentity === "TitleImage" && media.mediaSourceFileName
  );

  const filteredMediasContent = props?.medias.filter(
    (media) =>
      media.mediaModeIdentity === "Attachment" && media.mediaSourceFileName
  );

  // Render images for filtered media objects
  const renderedTitleImages = filteredMediasTitle.map((media, index) => {
    if (!media?.mediaSourceFileName) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <FallbackImage
        key={index}
        src={media.mediaSourceFileName}
        alt="link picture2"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 796px, 448px"
        style={{ borderRadius: "12px", margin: "36px auto" }}
        fallbackSrc={fallbackImage}
      />
    );
  });

  // Render images for filtered media objects
  const renderedMediasContent = filteredMediasContent.map((media, index) => {
    // Check if the media source is an image (jpeg, png)
    const isImage =
      media.mediaSourceFileName.endsWith(".jpeg") ||
      media.mediaSourceFileName.endsWith(".jpg") ||
      media.mediaSourceFileName.endsWith(".png");

    // If it's an image, render the img tag, otherwise return null
    if (isImage) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <FallbackImage
          key={index} // Key should be unique, use a proper identifier if available
          src={media.mediaSourceFileName}
          alt="link pictures"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 796px, 448px"
          style={{ borderRadius: "12px", margin: "36px auto" }}
          fallbackSrc={fallbackImage}
        />
      );
    } else {
      return null;
    }
  });

  return (
    <div className="row p-3 pt-0">
      <div className="container p-0">
        <div className="col-12 px-0 p-3 pb-0 rtl mt-1 d-flex gap-2 align-items-start justify-content-between">
          <div className="d-flex gap-3 align-items-start">
            <div className="px-0">
              <Typography variant="h5" className="pt-3 pb-2 fw-500">
                {props.lead}
              </Typography>
              <div className="d-flex gap-2 align-items-center justify-content-end">
                {props.source && (
                  <Typography variant="body2" className="fs-14 fw-500">
                    به نقل از {props.source}
                  </Typography>
                )}
                <Typography variant="body2" className="fs-14 fw-500">
                  {props.lastModifiedDatePersian}
                </Typography>
              </div>
              <div className="content-images">{renderedTitleImages}</div>
              <div
                className=" mt-2 fs-15 fw-500"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
              <div>{renderedMediasContent}</div>
            </div>
          </div>
        </div>
        {props.link ? (
          <div className="w-100 rtl">
            <div style={{ padding: "0px 0px 15px 10px" }}>
              <Link href={props.link} className={styles.rePostContainer}>
                <div className="d-flex gap-4 align-items-center">
                  <Image
                    src={props.medias[0]?.mediaSourceFileName}
                    alt="link picture"
                    width={60}
                    loading="lazy"
                    height={60}
                    style={{ borderRadius: "12px" }}
                  />
                  <div>
                    <Typography variant="body1" className=" fs-18 fw-500">
                      {props.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{
                        color: "#0068FF",
                        marginTop: "10px",
                      }}
                      className=" fs-16 fw-500"
                    >
                      {props.postContain}
                    </Typography>
                  </div>
                </div>

                <GrShare style={{ color: "#424242" }} />
              </Link>
            </div>
          </div>
        ) : null}
        {props?.tags.length > 0 ? (
          <div
            className=" w-100 rtl "
            style={{ padding: "10px 0px 10px 10px" }}
          >
            {props?.tags.map(({ tagId, tagTitle }) => (
              <Chip
                clickable
                component={Link}
                href={"/news?id=" + tagId + "&title=" + tagTitle}
                key={tagId}
                label={tagTitle}
                style={{
                  background: "#FFF",
                  margin: "6px 6px",
                  border: " 1px solid #E0E0E0",
                  padding: "16px 8px",
                  fontSize: "14px",
                }}
              />
            ))}
          </div>
        ) : null}
        <div className="d-flex w-100 rtl p-3 justify-content-between align-items-center">
          <NewsOptions
            recommendNumber={props.recommendNumber}
            likeNumber={props.likeNumber}
            shareNumber={0}
          />
        </div>
      </div>
    </div>
  );
}
