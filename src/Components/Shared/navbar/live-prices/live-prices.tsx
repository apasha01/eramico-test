"use client";

import React, { useEffect, useState } from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { LeftArrow, RightArrow } from "./arrow";
import LivePriceItem from "./live-price-item";
import { Skeleton } from "@mui/material";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { LIVE_PRICES } from "@/lib/urls";

interface Market_res extends IAPIResult<any> {}
interface MarketItem {
  id: number;
  productTitle: string;
  price: number;
  priceChangePercent: number;
  priceUnit: string;
  supplierCompany: string | null;
  supplierCompanyId: number | null;
}

const LivePrices = () => {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axiosInstance.get<Market_res>(LIVE_PRICES);
        if (response.data?.success && response.data?.data?.length > 0) {
          const formattedItems = response.data.data.map((item: any) => ({
            id: item.productId,
            productTitle: item.productTitle,
            price: item.price,
            priceChangePercent: item.priceChangePercent,
            priceUnit: item.priceUnitPropertyTitle,
            supplierCompany: item.supplierCompanyTitle,
            supplierCompanyId: item.supplierCompanyId,
          }));
          setItems(formattedItems);
        }
      } catch (error) {
        console.error("Failed to fetch market data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  if (loading) {
    return (
      <div className="BorderBottom w-full hideInMobileScreen d-flex">
        <ScrollMenu
          LeftArrow={LeftArrow}
          RightArrow={RightArrow}
          options={{
            ratio: 0.9,
            rootMargin: "16px",
          }}
          RTL={true}
          noPolyfill={true}
          scrollContainerClassName="align-self-center"
        >
          <div
            style={{ maxWidth: "70vw" }}
            className="  d-flex gap-3 justify-content-center"
          >
            {Array.from({ length: 15 }).map((_, index) => (
              <Skeleton key={index} variant="text" width="80px" height={40} />
            ))}
          </div>
        </ScrollMenu>
      </div>
    );
  }

  return (
    <div className="BorderBottom hideInMobileScreen">
      <ScrollMenu
        LeftArrow={LeftArrow}
        RightArrow={RightArrow}
        options={{
          ratio: 0.9,
          rootMargin: "16px",
        }}
        RTL={true}
        noPolyfill={true}
        scrollContainerClassName="align-self-center"
      >
        {items.map(
          ({
            id,
            productTitle,
            price,
            priceChangePercent,
            priceUnit,
            supplierCompany,
          }: MarketItem) => (
            <LivePriceItem
              key={id}
              title={productTitle}
              price={price.toString()}
              percent={`${
                priceChangePercent > 0 ? "+" : ""
              }${priceChangePercent.toFixed(2)}`}
              itemId={id.toString()}
              priceUnit={priceUnit}
              supplierCompany={supplierCompany}
            />
          )
        )}
      </ScrollMenu>
    </div>
  );
};

export default LivePrices;
