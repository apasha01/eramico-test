import React, { Suspense } from "react";
import ChangePassword from "../@pages/change-password";
import LoaderComponent from "@/Components/LoaderComponent";

export default function Page() {
  return (
    <Suspense fallback={<LoaderComponent />}>
      <ChangePassword />
    </Suspense>
  );
}
