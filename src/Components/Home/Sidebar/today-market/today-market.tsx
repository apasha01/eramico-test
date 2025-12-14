import { Divider } from "@mui/material";
import React from "react";
import IndividualTodayMarket from "./table-item";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { TODAY_MARKET } from "@/lib/urls";

interface MarketItem {
  productId: number;
  productTitle: string;
  price: number;
  priceChangePercent: number;
  priceUnitPropertyTitle: string;
}

interface MarketResponse {
  success: boolean;
  data: MarketItem[];
}

export default async function TodayMarket() {
  const response = await axiosInstance.get<MarketResponse>(TODAY_MARKET);

  if (!response.data.success || response.data.data.length === 0) {
    return null;
  }

  const data = response.data.data.map((item) => ({
    id: item.productId,
    productTitle: item.productTitle,
    price: item.price,
    priceChangePercent: item.priceChangePercent.toFixed(2),
    priceUnitTitle: item.priceUnitPropertyTitle,
  }));

  return (
    <>
      <section className="row px-3 pb-4">
        <div className="container AdvertisementBG rounded-4 p-3">
          <h6 className="col-12 rtl mt-1" style={{ color: "#616161" }}>
            بازار امروز
          </h6>
          {data.map(
            (_, i) =>
              i % 2 === 0 && (
                <React.Fragment key={`row-${i}`}>
                  <div className="row gap-5 mx-0 rtl py-2 px-0">
                    <IndividualTodayMarket
                      id={data[i]?.id}
                      title={data[i]?.productTitle}
                      price={data[i]?.price?.toString() || "0"}
                      persent={
                        data[i]?.priceChangePercent?.startsWith("-")
                          ? data[i].priceChangePercent
                          : `+${data[i]?.priceChangePercent || "0.00"}`
                      }
                      priceUnitTitle={data[i]?.priceUnitTitle}
                    />
                    {data[i + 1] && (
                      <IndividualTodayMarket
                        id={data[i + 1]?.id}
                        title={data[i + 1]?.productTitle}
                        price={data[i + 1]?.price?.toString() || "0"}
                        persent={
                          data[i + 1]?.priceChangePercent?.startsWith("-")
                            ? data[i + 1].priceChangePercent
                            : `+${data[i + 1]?.priceChangePercent || "0.00"}`
                        }
                        priceUnitTitle={data[i + 1]?.priceUnitTitle}
                      />
                    )}
                  </div>
                  {i !== data.length - 1 && <Divider />}
                </React.Fragment>
              )
          )}
        </div>
      </section>
    </>
  );
}
