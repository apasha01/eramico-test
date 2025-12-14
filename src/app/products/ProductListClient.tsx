"use client";

import React from "react";
import { Typography } from "@mui/material";
import CategoryFilters from "../../Components/common/category-filters";
import OrderItem from "./orderItem";
import ProductItem from "./product-item";
import MobileCategoryPage from "./MobileCategoryPage";
import styles from "./styles.module.css";
import { ReadonlyURLSearchParams } from "next/navigation";
import PageHeader from "@/Components/common/page-header";

export default function ProductListClient({
  filteredCategories,
  categoryFilterCategories,
  total,
  isMobile,
  searchParams,
}: {
  filteredCategories: any[];
  categoryFilterCategories: any[];
  total: number;
  isMobile: boolean;
  searchParams: ReadonlyURLSearchParams | Record<string, string | string[]>;
}) {
  if (isMobile) {
    return (
      <MobileCategoryPage
        filteredCategories={filteredCategories}
        categoryResponse={{ data: { data: categoryFilterCategories } }}
      />
    );
  }

  return (
    <div className="mainStyle">
      <PageHeader title="بازار و کالاها" singleTitle="کالا" total={total} />
      <div className="dividerStyle" dir="rtl">
        <div className="listCategoryStyle">
          <CategoryFilters
            categories={categoryFilterCategories}
            url="/products"
            title="انتخاب دسته محصولات"
            searchParams={searchParams}
          />
        </div>
        <div className="pe-4 ps-2 listStyle">
          <OrderItem />
          {filteredCategories.length > 0 ? (
            filteredCategories.map(
              (item: any) =>
                item?.children &&
                item?.children?.length > 0 && (
                  <div className="w-100" key={item.id}>
                    <div className={styles.listOfTheMainCards}>
                      <Typography className="fs-22">{item.title}</Typography>
                      {item.children.map((category: any) => (
                        <div className="w-100" key={category.id}>
                          <div className={styles.listOfTheMainCards}>
                            <Typography
                              variant="h6"
                              className={styles.categoryTitle}
                            >
                              {category.title}
                            </Typography>
                            <div className={styles.listOfTheCards}>
                              {category.children &&
                                category.children.map((item: any) => (
                                  <ProductItem
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    iconUrl={item.icon || undefined}
                                    code={item.code}
                                  />
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )
          ) : (
            <div className="listStyle">
              <div
                className="container px-0 rounded-4 p-0 AdvertisementBG sellAdvertisement"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "150px",
                  maxWidth: "864px",
                  alignItems: "center",
                  marginInline: "auto",
                  marginTop: "150px",
                }}
              >
                <Typography dir="rtl" className="fs-24 fw-500">
                  متأسفانه محصولی پیدا نشد.
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
