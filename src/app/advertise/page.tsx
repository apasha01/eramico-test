import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import React from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { Divider, Typography } from "@mui/material";
import {
  ADVERTISE_LIST,
  ADVERTISE_SPECIAL_OFFER,
  CATEGORY_LOOKUP_TREE,
} from "@/lib/urls";
import { ADVERTISE } from "@/lib/internal-urls";
import { TbSpeakerphone } from "react-icons/tb";
import IndividualBuyAdvertisement from "@/Components/Home/Sidebar/IndividualBuyAdvertisement";
import SortOptions from "@/Components/common/sort-options";
import Pagination from "@/Components/common/pagination";
import CategoryFilters from "@/Components/common/category-filters";
import VerificationFilters from "@/Components/common/verification-filters";
import { AdvertisementTypes } from "@/Helpers/Interfaces/Enums";
import AdvertiseItem from "@/Components/common/advertise-item";
import { MyCustomBuildUrl } from "@/Helpers/Utilities";
import SearchParamsInterface from "@/Helpers/Interfaces/SearchParamsInterface";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";
import PageHeader from "@/Components/common/page-header";
import SortProps from "@/Helpers/Interfaces/SortProps";

export const metadata: Metadata = GetMetadata("آگهی‌ها");

interface Advertise_res extends IAPIResult<any> {}
interface SearchParamsProps {
  searchParams: Promise<SearchParamsInterface>;
}

export default async function page(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  const pageNumber = Number(searchParams?.page ?? 1);
  const url = MyCustomBuildUrl(ADVERTISE_LIST, searchParams, true);

  const response = await axiosInstance.get<Advertise_res>(
    url,
    await getServerAxiosConfig()
  );
  const categoryResponse = await axiosInstance.get<Advertise_res>(
    CATEGORY_LOOKUP_TREE,
    await getServerAxiosConfig()
  );
  const specialAdvertises = await axiosInstance.get<Advertise_res>(
    ADVERTISE_SPECIAL_OFFER,
    await getServerAxiosConfig()
  );

  const specialAds = specialAdvertises.data.data.map(
    (item: {
      id: number;
      companyId: number;
      userFullName: string;
      companyTitle: string;
      productTitle: string;
      productEngTitle?: string;
      amount: number;
      amountUnitPropertyTitle: string;
      price: number;
      priceUnitPropertyTitle: string;
      userIsVerified: boolean;
      companyIsVerified: boolean;
      subscriptionAvatar: string | null;
      companyIsSafe: boolean;
    }) => ({
      id: item.id,
      companyId: item.companyId,
      userFullName: item.userFullName,
      companyTitle: item.companyTitle,
      productTitle: item.productTitle,
      productEngTitle: item.productEngTitle,
      amount: item.amount,
      amountUnit: item.amountUnitPropertyTitle,
      price: item.price,
      priceUnit: item.priceUnitPropertyTitle,
      userIsVerified: item.userIsVerified,
      companyIsVerified: item.companyIsVerified,
      subscriptionAvatar: item.subscriptionAvatar,
      isSafe: item.companyIsSafe,
    })
  );

  if (
    !categoryResponse.data.success ||
    categoryResponse.data.data.length === 0 ||
    !response.data.success
  ) {
    return null;
  }
  const sortProps: SortProps = {
    url: "/advertise",
    searchParams: searchParams,
    defaultSelected: "eranico",
    hasLastModifiedDateOption: true,
    hasSuggestionOption: true,
    hasMostVisitedOption: true,
  };
  return (
    <div className="mainStyle">
      <PageHeader
        title="آگهی‌ها"
        singleTitle="آگهی"
        total={response?.data?.total ?? 0}
        sortProps={sortProps}
        filterUrl="advertise/filters"
      />
      <div className="dividerStyle" dir="rtl">
        <div className="listCategoryStyle">
          <CategoryFilters
            categories={categoryResponse?.data?.data}
            url="/advertise"
            color="#0d47a1"
            title="انتخاب دسته‌بندی آگهی‌ها"
            searchParams={searchParams}
          >
            <VerificationFilters
              color="#0d47a1"
              url="/advertise"
              title="اعتبار آگهی‌دهنده"
              searchParams={searchParams}
            />
          </CategoryFilters>
        </div>
        <div className="listStyle px-2 px-lg-4">
          {response?.data?.data.length > 0 && <SortOptions {...sortProps} />}
          {specialAds.length > 0 && (
            <div
              className="w-100 p-3 radius-16"
              style={{
                backgroundImage: `url(/images/SuggestionBG.svg)`,
                backgroundSize: "cover",
              }}
            >
              <h6 className="col-12 rtl mt-1 d-flex gap-2 align-items-center justify-content-between pb-4">
                <span className="d-flex gap-2 red">
                  <TbSpeakerphone className="red mirror-horizontal" size={24} />
                  پیشنهاد ویژه
                </span>
              </h6>
              {specialAds.map((ad: any, index: number) => (
                <React.Fragment key={ad.id}>
                  <IndividualBuyAdvertisement
                    id={ad.id.toString()}
                    to={ADVERTISE(ad.id.toString(), ad.productTitle)}
                    faTitle={ad.productTitle}
                    enTitle={ad.productEngTitle}
                    name={ad.companyId ? ad.companyTitle : ad.userFullName}
                    subscriptionAvatar={ad.subscriptionAvatar}
                    verified={
                      ad.companyId ? ad.companyIsVerified : ad.userIsVerified
                    }
                    Amount={ad.amount}
                    Price={ad.price}
                    advertismentType="special-offer"
                    amountUnit={ad.amountUnit}
                    priceUnit={ad.priceUnit}
                    isSafe={ad.isSafe}
                  />
                  {index !== specialAds.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </div>
          )}
          {response.data?.data.length > 0 ? (
            <>
              {response?.data?.data?.map((item: any) => {
                return (
                  <AdvertiseItem
                    advertiseStatusTitle={item.advertiseStatusTitle}
                    key={item.id}
                    id={item?.id?.toString()}
                    faTitle={item.productTitle || ""}
                    enTitle={item.productEngTitle || ""}
                    name={
                      item.companyId
                        ? item.companyTitle
                        : item.userFullName || ""
                    }
                    price={item?.price}
                    priceUnit={item?.priceUnitPropertyTitle}
                    amount={item?.amount}
                    amountUnit={item?.amountUnitPropertyTitle}
                    subscriptionAvatar={item.subscriptionAvatar}
                    verified={
                      item.companyId
                        ? item.companyIsVerified
                        : item.userIsVerified
                    }
                    isSafe={item.companyIsSafe}
                    userId={item.userId}
                    companyId={item.companyId}
                    productId={item.productId}
                    advertiseTypeId={AdvertisementTypes.Advertisement}
                  />
                );
              })}

              <Pagination
                currentPage={pageNumber}
                count={response.data.total}
                url="/advertise"
                searchParams={searchParams}
              />
            </>
          ) : (
            <div className="listStyle px-2 px-lg-4">
              <div
                className="container px-0 rounded-4 p-0 AdvertisementBG sellAdvertisement align-items-center"
                style={{
                  minHeight: "150px",
                  maxWidth: "864px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography className="fs-24 fw-500">
                  متأسفانه آگهی پیدا نشد
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
