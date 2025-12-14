"use client";

import React from "react";
import NewsFilter from "./news-filter";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { CATEGORY_LOOKUP_TREE } from "@/lib/urls";
import BackButton from "@/Components/common/back-button";
import { Typography } from "@mui/material";
import SearchParamsInterface from "@/Helpers/Interfaces/SearchParamsInterface";

interface SearchParamsProps {
  searchParams: Promise<SearchParamsInterface>;
}
export default async function page(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  const categoryResponse = await axiosInstance.get<any>(CATEGORY_LOOKUP_TREE);
  const categories = categoryResponse.data.data;

  return (
    <div dir="rtl">
      <div className="headerStyle">
        <div className="headerTitleBoxStyle">
          <div className="headerBackRowStyle">
            <BackButton />
            <Typography sx={{ fontSize: "28px", fontWeight: 500 }}>
              جستجوی اخبار
            </Typography>
          </div>
        </div>
        <div></div>
      </div>
      <NewsFilter categories={categories} searchParams={searchParams} />
    </div>
  );
}
