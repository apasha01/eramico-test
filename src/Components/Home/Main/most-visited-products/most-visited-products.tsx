"use client";

import React, { useEffect, useState } from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { LeftArrow, RightArrow } from "./arrow";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { Chip, Skeleton } from "@mui/material";
import { MOST_VISITED_PRODUCTS } from "@/lib/urls";
import Link from "next/link";
import { PRODUCT } from "@/lib/internal-urls";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";

interface MostVisitedProduct {
  id: number;
  title: string;
  code: string;
  visitCount: number;
}

function MostVisitedProducts() {
  const [items, setItems] = useState<MostVisitedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostVisitedProducts = async () => {
      try {
        const response = await axiosInstance.get<{
          success: boolean;
          data: MostVisitedProduct[];
        }>(MOST_VISITED_PRODUCTS);
        if (response?.data?.data?.length > 0) {
          setItems(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching most visited products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMostVisitedProducts();
  }, []);

  if (loading) {
    return (
      <div className="BorderBottom pt-3 pb-3 hideInMobileScreen">
        <ScrollMenu
          LeftArrow={LeftArrow}
          RightArrow={RightArrow}
          options={{
            ratio: 0.9,
            rootMargin: "5px",
            threshold: [0.5, 1],
          }}
          RTL={true}
          noPolyfill={true}
        >
          <div className="w-100 d-flex gap-3 justify-content-center">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} variant="text" width="80px" height={40} />
            ))}
          </div>
        </ScrollMenu>
      </div>
    );
  }

  return (
    <div className="BorderBottom pt-3 pb-3 hideInMobileScreen">
      <ScrollMenu
        LeftArrow={LeftArrow}
        RightArrow={RightArrow}
        options={{
          ratio: 0.9,
          rootMargin: "5px",
          threshold: [0.5, 1],
        }}
        RTL={true}
        noPolyfill={true}
      >
        {items.map(({ id, title }) => (
          <Chip
            clickable
            component={Link}
            href={PRODUCT(id.toString(), title)}
            onClick={async () => {
              await saveEntityClick(id, EntityTypeEnum.Product);
            }}
            key={id.toString()}
            label={title}
            style={{ background: "#F5F5F5", margin: "6px 6px" }}
          />
        ))}
      </ScrollMenu>
    </div>
  );
}
export default MostVisitedProducts;
