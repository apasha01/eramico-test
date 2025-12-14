import { Suspense, useEffect, useState } from "react";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { Pagination, Typography } from "@mui/material";
import LoaderComponent from "@/Components/LoaderComponent";
import { ADVERTISE_COMPANY, ADVERTISE_LIST } from "@/lib/urls";
import AdvertiseItem from "@/Components/common/advertise-item";
import { PAGE_SIZE } from "@/lib/constants";
import { AdvertisementTypes } from "@/Helpers/Interfaces/Enums";
import SubmitNewAdvertise from "@/Components/Home/Sidebar/Advertisements/submit-new-advertise";

interface Advertise_res extends IAPIResult<any> {}

const Advertise = ({ id, isMine }: { id: number; isMine: boolean }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  useEffect(() => {
    const fetchData = async (companyId: number, page: number) => {
      try {
        const response = await axiosInstance.get<Advertise_res>(
          `${
            isMine ? ADVERTISE_COMPANY : ADVERTISE_LIST
          }?CompanyId=${companyId}&Size=${PAGE_SIZE}&Page=${page}`
        );
        setData(response.data.data || []);
        setTotalCount(response.data.total || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData(id, pageNumber);
  }, [id, pageNumber, isMine]);

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
        <div className="d-flex align-items-center justify-content-between mb-3">
          <Typography className="fs-19 fw-500 mb-3">آگهی‌ها</Typography>
          {isMine && <SubmitNewAdvertise />}
        </div>

        {data.length > 0 ? (
          <div className="listStyle px-2 px-lg-4">
            {data?.map((item: any) => {
              return (
                <AdvertiseItem
                  advertiseStatusTitle={item?.advertiseStatusTitle}
                  item={item}
                  key={item.id}
                  id={item?.id}
                  userId={item.userId}
                  companyId={item.companyId}
                  productId={item.productId}
                  faTitle={item.productTitle || ""}
                  enTitle={item.productEngTitle || ""}
                  name={item.companyTitle || ""}
                  isMine={isMine}
                  isPinSeller={item.isPinSeller}
                  isSpecialOffer={item.isSpecialOffer}
                  price={item?.price}
                  priceUnit={item?.priceUnitPropertyTitle}
                  amount={item?.amount}
                  amountUnit={item?.amountUnitPropertyTitle}
                  subscriptionAvatar={item.subscriptionAvatar}
                  verified={item.companyIsVerified}
                  isSafe={item.companyIsSafe}
                  advertiseTypeId={AdvertisementTypes.Advertisement}
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
            className="listStyle px-2 px-lg-4"
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
              <Typography className="fs-24 fw-500">
                هیچ آگهی برای این شرکت پیدا نشد
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Advertise;
