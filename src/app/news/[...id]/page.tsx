import React from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { notFound } from "next/navigation";
import styles from "../styles.module.css";
import Comment from "@/Components/NewsCards/newsComment";
import CommentList from "@/Components/NewsCards/newsCommentList";
import { CONTENT_COMMENTS, CONTENT_DETAILS } from "@/lib/urls";
import SideBanner from "@/Components/Home/Sidebar/SideBanner/SideBanner";
import SponsoringCompanies from "@/Components/Home/Sidebar/sponsoring-companies/sponsoring-companies";
import Footer from "@/Components/Shared/Footer/Footer";
import Inquiries from "@/Components/common/inquiries";
import TodayMarket from "@/Components/Home/Sidebar/today-market/today-market";
import { FEED_ADVERTISMENTS, FEED_INQUIRIES } from "@/lib/urls";
import Advertisments from "@/Components/common/advertisments";
import Image from "next/image";
import FallbackImage from "@/Components/NewsCards/FallbackImage";
import TheAvatar from "@/Components/common/the-avatar";
import ShareButton from "@/app/advertise/[...id]/share-button";
import { mainUrl } from "@/Helpers/axiosInstance/constants";
import { NewsArticle } from "../newsInterface";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import { Chip } from "@mui/material";
import { IoDownload } from "react-icons/io5";
import { saveEntityVisit } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { CommentInterface } from "@/Helpers/Interfaces/CommentInterface";
import { Metadata } from "next";
import { cache } from "react";
import { GetMetadata } from "@/lib/metadata";
import PageHeader from "@/Components/common/page-header";

interface NewsId_res extends IAPIResult<NewsArticle> {}
interface CommentApi_res extends IAPIResult<CommentInterface[]> {}
interface IdProps {
  params: Promise<{
    id: string;
    page?: string;
  }>;
}

const getData = cache(async (id: string) => {
  const response = await axiosInstance.get<NewsId_res>(
    `${CONTENT_DETAILS}/${id}`,
    await getServerAxiosConfig()
  );
  return response;
});

export async function generateMetadata(props: IdProps): Promise<Metadata> {
  const params = await props.params;
  const id = params?.id ?? undefined;

  try {
    const response = await getData(id);
    const item = response?.data.data;
    if (!item || !response.data.success) {
      return GetMetadata("خبر یافت نشد");
    }
    return GetMetadata(item.title, item.lead || item.title);
  } catch (error) {
    return GetMetadata();
  }
}

export default async function page(props: IdProps) {
  const params = await props.params;
  const id = params?.id ?? undefined;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const response = await getData(id);
  const commentResponse = await axiosInstance.get<CommentApi_res>(
    `${CONTENT_COMMENTS}/${id}`,
    await getServerAxiosConfig()
  );

  await saveEntityVisit(id, EntityTypeEnum.Content);

  const item = response?.data.data || null;
  if (!item || !response.data.success) {
    return notFound();
  }

  const body = item?.body || "";
  const medias = item?.medias || [];
  const tags = item?.tags || [];
  const image =
    item?.image ||
    medias.find((media: any) => media.mediaModeIdentity === "TitleImage")
      ?.mediaSourceFileName ||
    "/images/fallback.png";

  const sanitizedHtml = body
    .replace(/\r\n/g, "<br />")
    .replace(/src="\/UserUpload\//g, 'src="https://eranico.com/UserUpload/')
    .replace(/<img /g, '<img class="HTMLcontent" ');

  const filteredMediasContent =
    medias.filter(
      (media) =>
        media.mediaSourceFileName && media.mediaModeIdentity != "TitleImage"
    ) ?? [];

  // Render images for filtered media objects
  const renderedMediasContent = filteredMediasContent.map((media, index) => {
    if (media.mediaTypeIdentity.toLowerCase() === "image") {
      return (
        <>
          <FallbackImage
            key={index} // Key should be unique, use a proper identifier if available
            src={media.mediaSourceFileName}
            alt={media.mediaTitle || "News Image"}
            style={{
              height: "auto",
              width: "20%",
              borderRadius: "12px",
              margin: "36px auto",
            }}
            fallbackSrc={image}
            width={100}
            height={100}
            sizes="100vw"
          />
        </>
      );
    } else {
      return null;
    }
  });

  const attachments =
    (
      filteredMediasContent.filter(
        (media) => media.mediaTypeIdentity.toLowerCase() !== "image"
      ) ?? []
    ).map((media) => ({
      ...media,
      title:
        media.mediaTitle ||
        media.mediaSourceFileName.split("/").pop() ||
        "Attachment",
    })) || [];

  function useCurrentBreakpoint() {
    const theme = useTheme();

    // Call hooks in a fixed order (no loops) to satisfy React's Rules of Hooks
    const isXs = useMediaQuery(theme.breakpoints.only("xs"));
    const isSm = useMediaQuery(theme.breakpoints.only("sm"));
    const isMd = useMediaQuery(theme.breakpoints.only("md"));
    const isLg = useMediaQuery(theme.breakpoints.only("lg"));
    const isXl = useMediaQuery(theme.breakpoints.only("xl"));

    if (isXl) return "xl";
    if (isLg) return "lg";
    if (isMd) return "md";
    if (isSm) return "sm";
    if (isXs) return "xs";
    return "unknown";
  }

  return (
    <div dir="rtl" className={styles.newsDetailMainStyle}>
      <PageHeader title={item?.title || "خبر"} />
      <div className={`row ${styles.wrapper}`}>
        <div className="col-12 row px-4">
          <div className="col-12 col-lg-5 d-flex flex-column justify-content-center align-items-start px-4">
            <h1>{item?.title}</h1>
            <p>{item?.lead}</p>
            <div className="d-flex align-items-center gap-2">
              <TheAvatar
                src={""}
                name={
                  item?.creators[0]?.fullName ||
                  item?.guestCreatorName ||
                  item.title
                }
                width={32}
                height={32}
              />

              {item?.hasGuestCreator && (
                <>
                  <span className="text-muted">
                    نوشته‌شده توسط: {item?.guestCreatorName} |
                  </span>
                </>
              )}

              <span className="text-muted"> {item?.publishDatePersian}</span>
              <span className="text-muted border-end px-2">{item?.source}</span>
              <ShareButton link={`${mainUrl}/news/${id}`} size="32px" />
            </div>
          </div>
          <div
            className={`col-12 col-lg-7 d-flex justify-content-end align-items-center ${styles.imgWraper}`}
          >
            <Image
              loading="lazy"
              src={image}
              alt={item?.title || ""}
              className={`align-items-center w-100 rounded-3 ${styles.img}`}
              width={0}
              height={0}
              
              sizes="100vw"
              style={{ height: "auto", width: "60%" }}
            />
          </div>
        </div>
        <div className="col-12 col-lg-8 p-5 lh-lg BorderLeft">
          <div
            className={`mt-2 fs-15 fw-500 BorderBottom w-100 ${styles.HTMLcontent}`}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
          <div>{renderedMediasContent}</div>
          <div className="BorderBottom w-100">
            {attachments?.length > 0 && (
              <div className="w-100 d-flex flex-wrap gap-2 p-2" dir="rtl">
                {(attachments || []).map(
                  ({ id, mediaSourceFileName, title, mediaTypeIdentity }) => (
                    <Chip
                      clickable
                      component={Link}
                      href={mediaSourceFileName}
                      key={id}
                      dir="rtl"
                      label={title}
                      target="_blank"
                      style={{
                        background: "#FFF",
                        border: " 1px solid #E0E0E0",
                        padding: "16px 8px",
                        fontSize: "14px",
                      }}
                      icon={
                        <IoDownload
                          style={{
                            color: "#424242",
                            fontSize: "20px",
                          }}
                        />
                      }
                    />
                  )
                )}
              </div>
            )}

            {tags?.length > 0 && (
              <div className="w-100 d-flex flex-wrap gap-2 p-2" dir="rtl">
                {(tags || []).map(({ tagId, tagTitle }) => (
                  <Chip
                    clickable
                    component={Link}
                    href={`/tag/${encodeURIComponent(tagTitle)}`}
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
            )}
          </div>
          <div className="BorderBottom w-100">
            <Comment
              commentCount={commentResponse?.data.data?.length || 0}
              entityId={id}
            />
          </div>

          <CommentList
            data={commentResponse?.data.data || []}
            total={commentResponse?.data.total || 0}
            newsId={id}
            page={page}
          />
        </div>
        <div className="d-none d-lg-flex flex-column col-lg-4 pt-3">
          <Advertisments
            url={FEED_ADVERTISMENTS}
            title="آگهی‌های فروش"
            showProduct
            showUsername
          />
          <Inquiries
            url={FEED_INQUIRIES}
            title="استعلام‌ها"
            showProduct
            showUsername
          />
          <SideBanner />
          <TodayMarket />
          <SideBanner />
          <SponsoringCompanies />
          <SideBanner />
          <Footer />
        </div>
      </div>
    </div>
  );
}
