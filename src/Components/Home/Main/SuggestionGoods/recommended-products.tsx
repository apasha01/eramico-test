"use client";

import React, { useEffect, useState } from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { LeftArrow, RightArrow } from "./arrow";
import { Cards } from "./card";
import { Divider, Typography } from "@mui/material";
import { axiosInstance } from "@/Helpers/axiosInstance";
import LoaderComponent from "@/Components/LoaderComponent";
import { RELATED_PRODUCTS, SUGGESTION_PRODUCTS } from "@/lib/urls";
import { RelatedCards } from "./related-card";

interface Product {
  id: number;
  title: string;
  avatar: string | null;
  code: string;
  isFollowed: boolean;
  engTitle: string | null;
}

const RecommendedProducts = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(SUGGESTION_PRODUCTS);
        if (response.data?.success) {
          setItems(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (items.length === 0) {
    return null;
  }

  const fetchRelatedProoducts = async (id: number) => {
    try {
      const response = await axiosInstance.get(`${RELATED_PRODUCTS}/${id}`);
      if (response.data?.success) {
        setRelatedProducts(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="col pt-3 mobilePadding">
        <Typography className="fw-500 fs-4 mt">ممکنه علاقه‌مند باشید</Typography>
        <div className="BorderBottom py-3">
          {loading ? (
            <LoaderComponent />
          ) : (
            <ScrollMenu
              RightArrow={RightArrow}
              options={{
                ratio: 0.9,
                rootMargin: "5px",
                threshold: [0.5, 1],
              }}
              RTL={true}
              noPolyfill={true}
              
            >
              {items.map(
                ({ id, title, engTitle, avatar, code, isFollowed }, index) => (
                  <Cards
                    id={id}
                    index={index}
                    key={`${id}-${index}-${code}-recommended`}
                    faTitle={title}
                    enTitle={engTitle || ""}
                    image={avatar || null}
                    itemId={id.toString()}
                    code={code}
                    isFollowed={isFollowed}
                    handleClick={() => fetchRelatedProoducts(id)}
                  />
                )
              )}
            </ScrollMenu>
          )}
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <div
          className="p-4 related-products"
          style={{ backgroundColor: "#FAFAFA" }}
        >
          <Typography className="fw-500 fs-16">محصولات مشابه</Typography>
          <div className="py-3">
            {loading ? (
              <LoaderComponent />
            ) : (
              <ScrollMenu
                RightArrow={RightArrow}
                options={{
                  ratio: 0.9,
                  rootMargin: "5px",
                  threshold: [0.5, 1],
                }}
                RTL={true}
                noPolyfill={true}
              >
                {relatedProducts.map(
                  (
                    { id, title, engTitle, avatar, code, isFollowed },
                    index
                  ) => (
                    <RelatedCards
                      index={index}
                      key={id}
                      faTitle={title}
                      enTitle={engTitle || ""}
                      image={avatar || null}
                      itemId={id.toString()}
                      code={code}
                      isFollowed={isFollowed}
                    />
                  )
                )}
              </ScrollMenu>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendedProducts;
