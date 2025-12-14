import React from "react";
import StoreProvider from "./StoreProvider";
import ClientLayout from "./ClientLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./css/globals.scss";
import "./css/common.scss";
import "./css/rules.scss";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";

export const metadata: Metadata = GetMetadata();



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <StoreProvider>
      <html lang="fa-IR" >
        <body>
          <ClientLayout>
            {children}
          </ClientLayout>
        </body>
      </html>
    </StoreProvider>

  );
}
