import PageHeader from "@/Components/common/page-header";
import LoaderComponent from "@/Components/LoaderComponent";
import React from "react";

export default function Loading() {
  return (
    <>
      <PageHeader title="در حال دریافت خبر" />
      <LoaderComponent />
    </>
  );
}
