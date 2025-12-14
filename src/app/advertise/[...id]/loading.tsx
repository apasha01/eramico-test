import React from "react";
import LoaderComponent from "@/Components/LoaderComponent";
import PageHeader from "@/Components/common/page-header";

export default async function page() {
  return (
    <div className="mainStyle">
      <PageHeader title="آگهی فروش ..." />
      <div className="dividerStyle" dir="rtl">
        <div className="listStyle px-2 px-lg-4" style={{ gap: "40px" }}>
          <div className="mt-4">
            <LoaderComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
