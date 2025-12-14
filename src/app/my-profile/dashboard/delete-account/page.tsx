import React, { Suspense } from "react";
import LoaderComponent from "@/Components/LoaderComponent";
import DeleteAccountWrapper from "./delete-account-wrapper";

export default function Page() {
  return (
    <Suspense fallback={<LoaderComponent />}>
      <DeleteAccountWrapper />
    </Suspense>
  );
}
