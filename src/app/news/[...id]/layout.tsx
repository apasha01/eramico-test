import React from "react";
import PageHeader from "@/Components/common/page-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="mainStyle rtl">
      {children}
    </div>
  );
}
