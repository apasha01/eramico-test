import React from "react";
import Verify from "./@components/verfiy";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";

export const metadata: Metadata = GetMetadata("تأیید پرداخت");

const page = async ({
  searchParams,
}: {
  searchParams: { s?: string; code?: string; msg?: string };
}) => {
  const { s, code, msg } = searchParams;
  return <Verify s={s} code={code} msg={msg} />;
};

export default page;
