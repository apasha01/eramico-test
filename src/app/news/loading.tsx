import LoaderComponent from "@/Components/LoaderComponent";
import React from "react";
import PageHeader from "@/Components/common/page-header";

export default function Loading() {
  return (
    <div className="mainStyle rtl">
      <PageHeader title="اخبار و مقالات" total={0} />
      <br />
      <LoaderComponent />
    </div>
  );
}
