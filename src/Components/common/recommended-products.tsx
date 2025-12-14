"use client";

import React, { useEffect, useState } from "react";
import { Button, Divider } from "@mui/material";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { SUGGESTION_PRODUCTS } from "@/lib/urls";
import RecommendedProductItem from "./recommended-product-item";

interface Advertise_res extends IAPIResult<any> {}

export default function RecommendedProducts() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await axiosInstance.get<Advertise_res>(
          `${SUGGESTION_PRODUCTS}`
        );

        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };

    fetchRecommendedProducts();
  }, []);

  return (
    <section className="row px-3 pb-4">
      <div className="container p-0 recommended-bg rounded-4">
        <h6 className="col-12 blue rtl p-3 mt-1 d-flex gap-2 align-items-center justify-content-between">
          <span className="d-flex gap-2">ممکنه علاقه‌مند باشید</span>
        </h6>
        {data.length !== 0 ? (
          <>
            {data.map(
              (
                { id, title, engTitle, avatar, code, isFollowed },
                index: number
              ) => (
                <React.Fragment key={`${id}-${index}-${code}-recommended`}>
                  <RecommendedProductItem
                    id={id}
                    faTitle={title}
                    enTitle={engTitle}
                    avatar={avatar}
                    code={code}
                    isFollowed={isFollowed}
                  />
                  {index !== data.length - 1 && <Divider className="mx-3" />}
                </React.Fragment>
              )
            )}
            {data.length > 3 && (
              <div className="col-12 pb-4 text-center">
                <Button variant="outlined" href="/product">
                  مشاهده همه
                </Button>
              </div>
            )}
          </>
        ) : (
          <span className="text-center w-100 d-block pb-3">
            .محصولی یافت نشد
          </span>
        )}
      </div>
    </section>
  );
}
