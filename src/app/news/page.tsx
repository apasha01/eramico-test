import React from "react";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { NewsArticle } from "./newsInterface";
import Pagination from "@/Components/common/pagination";
import { PAGE_SIZE } from "@/lib/constants";
import NewsItem from "./news-item";
import NewsFilter from "./filter/news-filter";
import notFoundImage from "../img/404.png";
import SortOptions from "@/Components/common/sort-options";
import { MyCustomBuildUrl } from "@/Helpers/Utilities";
import { CATEGORY_LOOKUP_TREE, CONTENT_LIST } from "@/lib/urls";
import SearchParamsInterface from "@/Helpers/Interfaces/SearchParamsInterface";
import Image from "next/image";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";
import PageHeader from "@/Components/common/page-header";
import SortProps from "@/Helpers/Interfaces/SortProps";

interface News_res extends IAPIResult<any> {}
interface SearchParamsProps {
  searchParams: Promise<SearchParamsInterface>;
}

export const metadata: Metadata = GetMetadata("اخبار و مقالات");

export default async function page(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  const pageNumber = Number(searchParams?.page ?? 1);
  const url = MyCustomBuildUrl(CONTENT_LIST, {
    Size: PAGE_SIZE,
    Page: pageNumber,
    Title: searchParams.title,
    ContentTypeId: searchParams.contentTypeId,
    LastModifiedFrom: searchParams.from,
    LastModifiedTo: searchParams.to,
    OrderType: "desc",
    OrderField: searchParams?.sort == "visit" ? "VisitCount" : null,
    CategoryId: searchParams?.category || null,
    ProductId: searchParams?.product || null,
  });
  const response = await axiosInstance.get<News_res>(
    url,
    await getServerAxiosConfig()
  );

  const categoryResponse = await axiosInstance.get<any>(
    CATEGORY_LOOKUP_TREE,
    await getServerAxiosConfig()
  );
  const categories = categoryResponse.data.data;
  const news = response.data.data;
  const total = response.data.total || 0;

  const sortProps: SortProps = {
    url: "/news",
    searchParams: searchParams,
    defaultSelected: "newest",
    hasLastModifiedDateOption: true,
    hasSuggestionOption: false,
    hasMostVisitedOption: true,
  };

  return (
    <div className="mainStyle" dir="rtl">
      <PageHeader
        total={total}
        sortProps={sortProps}
        title="اخبار و مقالات"
        singleTitle="خبر و مقاله"
        filterUrl="/news/filter"
      />
      <div className="dividerStyle">
        <div className="listCategoryStyle">
          <NewsFilter categories={categories} searchParams={searchParams} />
        </div>
        <div className="listStyle">
          {!news || news.length === 0 ? (
            <div className="text-center w-100 p-5 gap-3 d-flex flex-column justify-content-center align-items-center">
              <Image
                src={notFoundImage.src}
                alt="No data available"
                width={200}
                height={100}
                
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSUuJSEwLjUrLi0tLi0tLS0uLi4uLS0tLS0tLS0tLTctLS03Li0tLTctLS3/2wBDAR"
              />
              <p className="noDataText">
                خبر/مقاله‌ای متناسب با جستجوی شما پیدا نشد
              </p>
            </div>
          ) : (
            <div className="listStyle px-2 px-lg-4">
              <SortOptions {...sortProps} />
              {news.map((item: NewsArticle) => {
                return (
                  <NewsItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    lead={item.lead}
                    image={item.image}
                    publishDatePersian={
                      item.publishDatePersian ||
                      item.lastModifiedDatePersian ||
                      item.createdDatePersian ||
                      ""
                    }
                  />
                );
              })}
              <Pagination
                currentPage={pageNumber}
                count={total}
                url="/news"
                searchParams={searchParams}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
