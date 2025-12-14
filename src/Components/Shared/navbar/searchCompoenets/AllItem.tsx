import { Typography } from "@mui/material";
import React from "react";
import Advertise from "./advertise";
import InquiresList from "./InquiresList";
import CompanyList from "./companiesList";
import ArticleList from "./articleList";
import NothingFound from "./nothingFound";

export default function AllItem({ response }: any) {
  const {
    company = [],
    advertise = [],
    inquiry = [],
    content = [],
  } = response ?? {};

  if (
    company.length === 0 &&
    advertise.length === 0 &&
    inquiry.length === 0 &&
    content.length === 0
  ) {
    return <NothingFound />;
  }

  return (
    <div>
      {advertise.length > 0 && (
        <>
          <Typography className="fs-12 fw-700 px-4 pt-4 pb-2">
            آگهی ها
          </Typography>
          <Advertise advertise={advertise} />
        </>
      )}

      {inquiry.length > 0 && (
        <>
          <Typography className="fs-12 fw-700 px-4 pt-4 pb-2">
            استعلام ها
          </Typography>
          <InquiresList inquires={inquiry} />
        </>
      )}

      {company.length > 0 && (
        <>
          <Typography className="fs-12 fw-700 px-4 pt-4 pb-2">
            شرکت ها
          </Typography>
          <CompanyList Company={company} />
        </>
      )}

      {content.length > 0 && (
        <>
          <Typography className="fs-12 fw-700 px-4 pt-4 pb-2">
            اخبار و مقالات
          </Typography>
          <ArticleList articles={content} />
        </>
      )}
    </div>
  );
}
