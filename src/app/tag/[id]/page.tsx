import React, { Suspense } from "react";
import PageComponent from "@/app/tag/@page/PageComponent";
import LoaderComponent from "@/Components/LoaderComponent";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { TAG_FEED } from "@/lib/urls";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { TagFeedItem } from "@/Helpers/Interfaces/Feed_interface";
import { GetMetadata } from "@/lib/metadata";
import { Metadata } from "next";

interface TagFeedResponse extends IAPIResult<TagFeedItem[]> {}

interface PageProps {
  params: { id: string };
  searchParams: { page?: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const isNumeric = !isNaN(Number(params.id)) && params.id.trim() !== "";
  const tagTitle = isNumeric ? "" : decodeURIComponent(params.id);

  if (tagTitle) {
    return GetMetadata(`برچسب ${tagTitle}`) || {};
  }

  return GetMetadata("برچسب") || {};
}

async function fetchTagFeed(
  id?: number,
  title?: string,
  page: number = 1
): Promise<TagFeedResponse> {
  try {
    const response = await axiosInstance.get<TagFeedResponse>(
      `${TAG_FEED}?${
        id ? `tagId=${id}` : `tagTitle=${title}`
      }&page=${page}&size=10`,
      await getServerAxiosConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tag feed:", error);
    return {
      success: false,
      data: [],
      total: 0,
      message: "Failed to load tag feed",
    };
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const isNumeric = !isNaN(Number(params.id)) && params.id.trim() !== "";
  const id = isNumeric ? Number(params.id) : undefined;
  const title = isNumeric ? undefined : decodeURIComponent(params.id);
  const currentPage = Number(searchParams.page) || 1;

  const data = await fetchTagFeed(id, title, currentPage);

  return (
    <Suspense fallback={<LoaderComponent />}>
      <PageComponent
        id={id}
        title={title}
        initialData={data.data || []}
        totalCount={data.total || 0}
        currentPage={currentPage}
        error={data.success ? null : data.message || "Failed to load tag feed"}
      />
    </Suspense>
  );
}
