"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { Alert, Pagination, Typography } from "@mui/material";
import LoaderComponent from "@/Components/LoaderComponent";
import {
  ADVERTISE_MODE_LOOKUP,
  MY_ADVERTISE_LIST,
  PRODUCT_GRADE_LOOKUP,
  PRODUCT_TYPE_LOOKUP,
  PROPERTY_LOOKUP_COUNTRY,
  PROPERTY_LOOKUP_DEAL_TYPE,
  PROPERTY_LOOKUP_DELIVERY,
  PROPERTY_LOOKUP_MONEY_UNIT,
  PROPERTY_LOOKUP_PACKING,
  PROPERTY_LOOKUP_PRICE_BASE,
  PROPERTY_LOOKUP_UNIT,
  SUBMIT_ADVERTISE_COMPANIES,
} from "@/lib/urls";
import ProfileAdvertiseItem from "../@componenets/profile-advertise-item";
import { PAGE_SIZE } from "@/lib/constants";
import SubmitNewAdvertise from "@/Components/Home/Sidebar/Advertisements/submit-new-advertise";
import { GetMetadata } from "@/lib/metadata";
interface Advertise_res extends IAPIResult<any> {}

const Advertise = () => {
  var md = GetMetadata("آگهی‌های من");
  document.title = md.title;
  const [data, setData] = useState<any[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const url = `${MY_ADVERTISE_LIST}?Size=${PAGE_SIZE}&Page=${pageNumber}`;
      const response = await axiosInstance.get<Advertise_res>(url);

      setData(response.data.data || []);
      setTotalCount(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setShouldUpdate(false);
    }
  }, [pageNumber]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData, shouldUpdate, pageNumber]);

  const [options, setOptions] = useState<any>({
    ProductTypeId: [],
    ProducerCountryPropertyId: [],
    DealTypePropertyId: [],
    PackingTypePropertyId: [],
    DeliveryLocationPropertyId: [],
    PriceBasePropertyId: [],
    ProductGradeId: [],
    AmountUnitPropertyId: [],
    PriceUnitPropertyId: [],
    AdvertiseModeId: [],
    CompanyId: [],
  });
  // Fetch options only once
  useEffect(() => {
    const fetchOptions = async () => {
      // Prevent duplicate calls in Strict Mode

      try {
        const results = await Promise.allSettled([
          axiosInstance.get(PRODUCT_TYPE_LOOKUP),
          axiosInstance.get(PROPERTY_LOOKUP_COUNTRY),
          axiosInstance.get(PROPERTY_LOOKUP_DEAL_TYPE),
          axiosInstance.get(PROPERTY_LOOKUP_PACKING),
          axiosInstance.get(PROPERTY_LOOKUP_DELIVERY),
          axiosInstance.get(PROPERTY_LOOKUP_PRICE_BASE),
          axiosInstance.get(PRODUCT_GRADE_LOOKUP),
          axiosInstance.get(PROPERTY_LOOKUP_UNIT),
          axiosInstance.get(PROPERTY_LOOKUP_MONEY_UNIT),
          axiosInstance.get(ADVERTISE_MODE_LOOKUP),
          axiosInstance.get(SUBMIT_ADVERTISE_COMPANIES),
        ]);

        const optionKeys = [
          "ProductTypeId",
          "ProducerCountryPropertyId",
          "DealTypePropertyId",
          "PackingTypePropertyId",
          "DeliveryLocationPropertyId",
          "PriceBasePropertyId",
          "ProductGradeId",
          "AmountUnitPropertyId",
          "PriceUnitPropertyId",
          "AdvertiseModeId",
          "CompanyId",
        ];

        // Build the new options object in one go to avoid multiple state updates
        const newOptions = {
          ProductTypeId: [],
          ProducerCountryPropertyId: [],
          DealTypePropertyId: [],
          PackingTypePropertyId: [],
          DeliveryLocationPropertyId: [],
          PriceBasePropertyId: [],
          ProductGradeId: [],
          AmountUnitPropertyId: [],
          PriceUnitPropertyId: [],
          AdvertiseModeId: [],
          CompanyId: [],
        };

        results.forEach((result, index) => {
          const optionKey = optionKeys[index];
          if (result.status === "fulfilled") {
            newOptions[optionKey] = result.value.data.success
              ? result.value.data.data
              : [];
          } else {
            newOptions[optionKey] = [];
          }
        });

        // Single state update instead of multiple
        setOptions(newOptions);
        // if (newOptions.CompanyId.length > 0) {
        //   setSelectedCompanyId(newOptions.CompanyId[0].id);
        // }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []); // Empty dependency array

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <div className="mainStyle">
      <div className="d-flex p-4">
        <Alert severity="info">
          در این بخش آگهی هایی که به صورت شخصی ثبت کرده اید را می توانید مدیریت
          کنید. درصورتیکه آگهی هایتان را به صورت شرکتی ثبت کرده اید از منو شرکت
          های من که لیست شرکت هایی که عضو آن هستید را نمایش میدهد مشاهده شرکت را
          بزنید و وارد پروفایل شرکت شوید و از آنجا می توانید آگهی های شرکت مورد
          نظر را مدیریت نمایید.
        </Alert>
      </div>
      <div className="d-flex align-items-center justify-content-between mb-3 w-100 p-4">
        <Typography className="fs-19 fw-500 mb-3">آگهی‌های من</Typography>
        <SubmitNewAdvertise />
      </div>

      {data.length > 0 ? (
        <div className="listStyle  px-2 px-md-5">
          {data?.map((ad: any) => (
            <ProfileAdvertiseItem
              key={ad.id.toString()}
              item={ad}
              options={options} // چون دیگه گزینه شرکت لازم نداری
              setData={setData}
              setShouldUpdate={setShouldUpdate}
            />
          ))}

          <Suspense fallback={<LoaderComponent />}>
            <Pagination
              count={Math.ceil(Number(totalCount) / PAGE_SIZE)}
              page={pageNumber}
              onChange={(e, page) => setPageNumber(page)}
              className="mt-3"
            />
          </Suspense>
        </div>
      ) : (
        <div
          className="listStyle  px-2 px-md-5"
          style={{ minHeight: "70vh", justifyContent: "flex-start" }}
        >
          <div
            className="container px-0 rounded-4 p-0 AdvertisementBG sellAdvertisement"
            style={{
              minHeight: "150px",
              maxWidth: "760px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography dir="rtl" className="fs-24 fw-500">
              متأسفانه آگهی پیدا نشد.
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};
export default Advertise;
