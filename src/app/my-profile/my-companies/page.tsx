import React from "react";
import CompanyInfo from "../dashboard/@pages/company-info";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";

export const metadata: Metadata = GetMetadata("شرکت‌های من");
const page = () => {
  return <CompanyInfo />;
};

export default page;
