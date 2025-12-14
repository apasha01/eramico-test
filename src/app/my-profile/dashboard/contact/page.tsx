import React, { Suspense } from "react";
import ContactInfo from "../@pages/contact-info";
import LoaderComponent from "@/Components/LoaderComponent";
export default function Page() {
  return (
    <Suspense fallback={<LoaderComponent />}>
      <ContactInfo />
    </Suspense>
  );
}
