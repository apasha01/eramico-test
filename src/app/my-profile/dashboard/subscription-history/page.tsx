import React, { Suspense } from "react";
import TransactionInfo from "../@pages/transaction-info";
import LoaderComponent from "@/Components/LoaderComponent";

export default function Page() {
  return (
    <Suspense fallback={<LoaderComponent />}>
      <TransactionInfo />
    </Suspense>
  );
}
