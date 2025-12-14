"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { Alert, Pagination, Typography } from "@mui/material";
import LoaderComponent from "@/Components/LoaderComponent";
import {
  ADVERTISE_MODE_LOOKUP,
  MY_INQUIRY_LIST,
  PRODUCT_GRADE_LOOKUP,
  PRODUCT_TYPE_LOOKUP,
  PROPERTY_LOOKUP_COUNTRY,
  PROPERTY_LOOKUP_DEAL_TYPE,
  PROPERTY_LOOKUP_MONEY_UNIT,
  PROPERTY_LOOKUP_UNIT,
  SUBMIT_INQUIRY_COMPANIES,
} from "@/lib/urls";
import { PAGE_SIZE } from "@/lib/constants";
import ProfileInquiryItem from "../@componenets/profile-inquiry-item";
import SubmitNewInquiry from "@/Components/Home/Sidebar/inquiries/submit-new-inqiry";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { GetMetadata } from "@/lib/metadata";

interface Inquires_res extends IAPIResult<any> {}

const Inquires = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const [options, setOptions] = useState({
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

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const results = await Promise.allSettled([
          axiosInstance.get(PRODUCT_TYPE_LOOKUP),
          axiosInstance.get(PROPERTY_LOOKUP_COUNTRY),
          axiosInstance.get(PROPERTY_LOOKUP_DEAL_TYPE),
          axiosInstance.get(PRODUCT_GRADE_LOOKUP),
          axiosInstance.get(PROPERTY_LOOKUP_UNIT),
          axiosInstance.get(PROPERTY_LOOKUP_MONEY_UNIT),
          axiosInstance.get(ADVERTISE_MODE_LOOKUP),
          axiosInstance.get(SUBMIT_INQUIRY_COMPANIES),
        ]);

        results.forEach((result, index) => {
          const optionKeys = [
            "ProductTypeId",
            "ProducerCountryPropertyId",
            "DealTypePropertyId",
            "ProductGradeId",
            "AmountUnitPropertyId",
            "PriceUnitPropertyId",
            "AdvertiseModeId",
            "CompanyId",
          ];

          const optionKey = optionKeys[index];

          if (result.status === "fulfilled") {
            setOptions((prev) => ({
              ...prev,
              [optionKey]: result.value.data.success
                ? result.value.data.data
                : [],
            }));
          } else {
            setOptions((prev) => ({
              ...prev,
              [optionKey]: [],
            }));
          }
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Fetch data فقط برای استعلام‌های خودم
  const fetchData = useCallback(async () => {
    try {
      const url = `${MY_INQUIRY_LIST}?Size=${PAGE_SIZE}&Page=${pageNumber}`;
      const response = await axiosInstance.get<Inquires_res>(url);
      setData(response.data.data || []);
      setTotalCount(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setShouldUpdate(false);
    }
  }, [pageNumber]);

  useEffect(() => {
    fetchData();
    var md = GetMetadata("استعلام‌های من");
    document.title = md.title;
  }, [fetchData, pageNumber, shouldUpdate]);

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <div className="mainStyle">
      <div className="d-flex">
        <Alert severity="warning" icon={<InfoOutlinedIcon />}>
          در این بخش آگهی هایی که به صورت شخصی ثبت کرده اید را می توانید مدیریت
          کنید. درصورتیکه آگهی هایتان را به صورت شرکتی ثبت کرده اید از منو شرکت
          های من که لیست شرکت هایی که عضو آن هستید را نمایش میدهد مشاهده شرکت را
          بزنید و وارد پروفایل شرکت شوید و از آنجا می توانید آگهی های شرکت مورد
          نظر را مدیریت نمایید.
        </Alert>
      </div>
      <div className="d-flex align-items-center justify-content-between mb-3 w-100 p-4">
        <Typography className="fs-19 fw-500 mb-3">استعلام‌های من</Typography>
        <SubmitNewInquiry onSuccess={() => setShouldUpdate(true)} />
      </div>

      {data.length > 0 ? (
        <div className="listStyle  px-2 px-md-5">
          {data.map((item) => (
            <ProfileInquiryItem
              key={item.id}
              item={item}
              setData={setData}
              setShouldUpdate={setShouldUpdate}
              options={options} // چون گزینه شرکت نمی‌خوای
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
          className="listStyle px-2 px-lg-4"
          style={{ minHeight: "70vh", justifyContent: "flex-start" }}
        >
          <div
            className="container px-0 rounded-4 p-0 AdvertisementBgSell buyAdvertisement"
            style={{
              minHeight: "150px",
              maxWidth: "760px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Typography dir="rtl" className="fs-24 fw-500">
              متأسفانه استعلامی پیدا نشد.
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquires;
