import React, { Suspense } from "react";
import CompanyInfo from "../@pages/company-info";
import LoaderComponent from "@/Components/LoaderComponent";

export default function Page() {
  return (
    <Suspense fallback={<LoaderComponent />}>
      <CompanyInfo />
    </Suspense>
  );
}
