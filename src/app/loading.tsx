import React from "react";
import LoaderComponent from "@/Components/LoaderComponent";

export default function loading() {
  return (
    <div className="d-flex h-100 w-full justify-center align-items-center">
      <LoaderComponent />
    </div>
  );
}
