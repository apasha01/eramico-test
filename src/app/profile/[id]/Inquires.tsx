import React, { useState, useEffect, Suspense } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { Pagination, Typography } from "@mui/material";
import LoaderComponent from "@/Components/LoaderComponent";
import { PAGE_SIZE } from "@/lib/constants";
import { INQUIRY_LIST } from "@/lib/urls";
import AdvertiseItem from "@/Components/common/advertise-item";
import { AdvertiseDetail } from "@/app/advertise/advertiseInterface";
import { AdvertisementTypes } from "@/Helpers/Interfaces/Enums";

interface Inquires_res extends IAPIResult<AdvertiseDetail[]> {}

const Inquires = ({ id }: { id: number }) => {
  const [data, setData] = useState<AdvertiseDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<Inquires_res>(
          `${INQUIRY_LIST}?userId=${id}&Size=${PAGE_SIZE}&Page=${pageNumber}`
        );
        setData(response.data.data || []);
        setTotalCount(response.data.total || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, pageNumber]);

  if (loading) {
    return (
      <div>
        <LoaderComponent />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className="mainStyle">
      <div className="col BorderBottom w-100 p-4 mb-3">
        <Typography className="fs-19 fw-500 mb-3">استعلام‌ها</Typography>
        {data.length > 0 ? (
          <div className="listStyle">
            {data.map((item) => (
              <AdvertiseItem
                key={item.id}
                id={item?.id?.toString()}
                faTitle={item.productTitle || ""}
                enTitle={item.productEngTitle || ""}
                name={item.userFullName}
                subscriptionAvatar={item.subscriptionAvatar}
                verified={
                  item.companyId ? item.companyIsVerified : item.userIsVerified
                }
                date={item.expirationRemained}
                amount={item.amount}
                amountUnit={item.amountUnitPropertyTitle}
                isSafe={item.companyIsSafe}
                advertiseTypeId={
                  item.advertiseTypeId || AdvertisementTypes.Inquiry
                }
                companyId={item.companyId}
                productId={item.productId}
                userId={item.userId}
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
            className="listStyle"
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
                هیچ استعلامی برای این کاربر پیدا نشد.
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inquires;
