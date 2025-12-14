import React, { cache } from "react";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { AdvertiseDetail } from "../../advertiseInterface";
import { notFound, redirect } from "next/navigation";
import { ADVERTISE_INQUIRY_OLD } from "@/lib/urls";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { ADVERTISE, PRODUCT } from "@/lib/internal-urls";

interface AdvertiseOldRes extends IAPIResult<AdvertiseDetail> {}
interface IdProps {
  params: {
    id: string;
  };
  searchParams: {
    productId?: string;
  };
}
const getData = cache(async (id: string) => {
  const response = await axiosInstance.get<AdvertiseOldRes>(
    `${ADVERTISE_INQUIRY_OLD}/${id}`,
    await getServerAxiosConfig()
  );
  return response;
});

export default async function Page({ params, searchParams }: IdProps) {
  const id = params?.id ?? undefined;
  if (!id) {
    if (searchParams.productId)
      redirect(`${PRODUCT}/${searchParams.productId}`);
    return notFound();
  }
  const res = await getData(id);
  const item = res.data.success && res.data.data ? res.data.data : null;
  if (!res.data.success || !item) {
    if (searchParams.productId)
      redirect(`${PRODUCT}/${searchParams.productId}`);
    return notFound();
  }
  redirect(ADVERTISE(item.id));
}
