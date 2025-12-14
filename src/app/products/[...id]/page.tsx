import React, { cache } from "react";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { notFound } from "next/navigation";
import { PRODUCTS_DETAILS } from "@/lib/urls";
import { saveEntityVisit } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import ProductPageClient from "./product-page-client";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";

interface ProductRes extends IAPIResult<any> {}
interface IdProps {
  params: {
    id: string;
  };
}

interface IdProps {
  params: {
    id: string;
  };
}

const getData = cache(async (id: string) => {
  const url = Number.isInteger(Number(id))
    ? `${PRODUCTS_DETAILS}/${id}`
    : `Products/get?code=${id}`;
  const response = await axiosInstance.get<ProductRes>(
    url,
    await getServerAxiosConfig()
  );
  return response;
});

export async function generateMetadata(props: IdProps): Promise<Metadata> {
  const params = props.params;
  const id = params?.id ?? undefined;

  try {
    const response = await getData(id);
    const item = response?.data.data;
    if (!item || !response.data.success) {
      return GetMetadata("شرکت یافت نشد");
    }
    return GetMetadata(item.title, item.introduction);
  } catch (error) {
    return GetMetadata();
  }
}

export default async function Page({ params }: IdProps) {
  const id = params?.id ?? undefined;

  const res = await getData(id);
  const item = res.data.success && res.data.data ? res.data.data : null;
  if (!res.data.success || !item) {
    notFound();
  }
  await saveEntityVisit(item.id, EntityTypeEnum.Company);

  return <ProductPageClient product={item} />;
}
