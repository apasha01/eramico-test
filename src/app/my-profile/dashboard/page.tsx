import { Suspense } from "react";
import PersonalInfo from "./@pages/personal-info";
import LoaderComponent from "@/Components/LoaderComponent";

export default function Page() {
  return (
    <Suspense fallback={<LoaderComponent />}>
      <PersonalInfo />
    </Suspense>
  );
}
