import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import React, { Suspense } from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { Typography } from "@mui/material";
import LoaderComponent from "@/Components/LoaderComponent";
import SortOptions from "@/Components/common/sort-options";
import Pagination from "@/Components/common/pagination";
import { CATEGORY_LOOKUP_TREE, INQUIRY_LIST } from "@/lib/urls";
import CategoryFilters from "@/Components/common/category-filters";
import VerificationFilters from "@/Components/common/verification-filters";
import AdvertiseItem from "@/Components/common/advertise-item";
import { AdvertisementTypes } from "@/Helpers/Interfaces/Enums";
import { MyCustomBuildUrl } from "@/Helpers/Utilities";
import SearchParamsInterface from "@/Helpers/Interfaces/SearchParamsInterface";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";
import PageHeader from "@/Components/common/page-header";
import SortProps from "@/Helpers/Interfaces/SortProps";

export const metadata: Metadata = GetMetadata("استعلام‌ها");
interface Advertise_res extends IAPIResult<any> {}
interface SearchParamsProps {
  searchParams: Promise<SearchParamsInterface>;
}
export default async function page(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  const pageNumber = Number(searchParams?.page ?? 1);

  const url = MyCustomBuildUrl(INQUIRY_LIST, searchParams, true);
  const response = await axiosInstance.get<Advertise_res>(
    url,
    await getServerAxiosConfig()
  );

  const categoryResponse = await axiosInstance.get<Advertise_res>(
    CATEGORY_LOOKUP_TREE,
    await getServerAxiosConfig()
  );
  const sortProps: SortProps = {
    url: "/inquiries",
    searchParams: searchParams,
    defaultSelected: "eranico",
    hasLastModifiedDateOption: true,
    hasSuggestionOption: true,
    hasMostVisitedOption: true,
  };
  return (
    <Suspense fallback={<LoaderComponent />}>
      <div className="mainStyle">
        <PageHeader
          title="استعلام‌ها"
          total={response?.data?.total ?? 0}
          singleTitle="استعلام"
          sortProps={sortProps}
          filterUrl="/inquiries/filters"
        />
        <div className="dividerStyle" dir="rtl">
          <div className="listCategoryStyle">
            <CategoryFilters
              categories={categoryResponse?.data?.data}
              title="انتخاب دسته‌بندی استعلام‌ها"
              url="/inquiries"
              searchParams={searchParams}
            >
              <VerificationFilters
                url="/inquiries"
                title="اعتبار استعلام‌دهنده"
                searchParams={searchParams}
              />
            </CategoryFilters>
          </div>

          {response.data?.data.length > 0 ? (
            <div className="listStyle px-2 px-lg-4">
              <SortOptions {...sortProps} />
              {response?.data?.data?.map((item: any) => {
                return (
                  <AdvertiseItem
                    isPinSeller={item.isPinSeller}
                    isMine={item.isMine}
                    isSpecialOffer={item.isSpecialOffer}
                    key={item.id}
                    advertiseStatusTitle={
                      item.isMine ? item.advertiseStatusTitle : null
                    }
                    id={item?.id?.toString()}
                    faTitle={item.productTitle || ""}
                    enTitle={item.productEngTitle || ""}
                    name={item.companyTitle || item.userFullName || ""}
                    subscriptionAvatar={item.subscriptionAvatar}
                    verified={
                      item.companyId
                        ? item.companyIsVerified
                        : item.userIsVerified
                    }
                    date={item.expirationRemained}
                    amount={item.amount}
                    amountUnit={item.amountUnitPropertyTitle}
                    isSafe={item.companyIsSafe}
                    userId={item.userId}
                    companyId={item.companyId}
                    productId={item.productId}
                    advertiseTypeId={
                      item?.advertiseTypeId || AdvertisementTypes.Inquiry
                    }
                  />
                );
              })}

              <Pagination
                currentPage={pageNumber}
                count={response.data.total}
                url="/inquiries"
                searchParams={searchParams}
              />
            </div>
          ) : (
            <div className="listStyle px-2 px-lg-4">
              <div
                className="container px-0 rounded-4 p-0 AdvertisementBgSell buyAdvertisement align-items-center"
                style={{
                  minHeight: "150px",
                  maxWidth: "864px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Typography className="fs-24 fw-500">
                  متأسفانه استعلام پیدا نشد
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
