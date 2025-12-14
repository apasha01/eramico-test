import { Suspense, useEffect, useState } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { Pagination, Typography } from "@mui/material";
import LoaderComponent from "@/Components/LoaderComponent";
import AdvertiseItem from "@/Components/common/advertise-item";
import { ADVERTISE_LIST } from "@/lib/urls";
import { PAGE_SIZE } from "@/lib/constants";

interface Advertise_res extends IAPIResult<any> {}

const Advertise = ({ id }: { id: number }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<Advertise_res>(
          `${ADVERTISE_LIST}?ProductId=${id}&Size=${PAGE_SIZE}&Page=${pageNumber}&OrderField=EranicoSuggestion`
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
    <div className="px-3 mainStyle">
      {data.length > 0 ? (
        <div className="listStyle">
          {data?.map((item: any) => {
            return (
              <AdvertiseItem
                key={item.id}
                id={item?.id?.toString()}
                userId={item.userId}
                companyId={item.companyId}
                productId={item.productId}
                faTitle={item.productTitle || ""}
                enTitle={item.productEngTitle || ""}
                name={
                  item.companyId ? item.companyTitle : item.userFullName || ""
                }
                price={item?.price}
                priceUnit={item?.priceUnitPropertyTitle}
                amount={item?.amount}
                amountUnit={item?.amountUnitPropertyTitle}
                subscriptionAvatar={item.subscriptionAvatar}
                verified={
                  item.companyId ? item.companyIsVerified : item.userIsVerified
                }
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
            <Typography dir="rtl" className="fs-24 fw-500 px-3">
              هیچ آگهی‌ای در رابطه با این محصول پیدا نشد.
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};
export default Advertise;
