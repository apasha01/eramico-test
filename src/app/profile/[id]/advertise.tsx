import React, { Suspense, useEffect, useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { Pagination, Typography } from "@mui/material";
import LoaderComponent from "@/Components/LoaderComponent";
import { PAGE_SIZE } from "@/lib/constants";
import { ADVERTISE_LIST } from "@/lib/urls";
import AdvertiseItem from "@/Components/common/advertise-item";
import { AdvertiseDetail } from "@/app/advertise/advertiseInterface";

interface Advertise_res extends IAPIResult<AdvertiseDetail[]> {}

const Advertise = ({ id }: { id: number }) => {
  const [data, setData] = useState<AdvertiseDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<Advertise_res>(
          `${ADVERTISE_LIST}?userId=${id}&Size=${PAGE_SIZE}&Page=${pageNumber}`
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

  return (
    <div className="mainStyle">
      {data.length > 0 ? (
        <div className="listStyle px-3">
          {data?.map((item: AdvertiseDetail) => {
            return (
              <AdvertiseItem
                key={item.id}
                id={item?.id.toString()}
                userId={item.userId}
                faTitle={item.productTitle || ""}
                enTitle={item.productEngTitle || ""}
                name={item.userFullName || ""}
                price={item?.price}
                priceUnit={item?.priceUnitPropertyTitle}
                date={item?.expirationRemained}
                amount={item?.amount}
                amountUnit={item?.amountUnitPropertyTitle}
                subscriptionAvatar={item.subscriptionAvatar}
                verified={item.userIsVerified}
                companyId={item.companyId}
                productId={item.productId}
                isSafe={item.companyIsSafe}
                advertiseTypeId={item.advertiseTypeId}
              />
            );
          })}
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
              هیچ آگهی‌ای برای این کاربر پیدا نشد.
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};
export default Advertise;
