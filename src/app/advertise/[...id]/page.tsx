import React, { cache } from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { notFound } from "next/navigation";
import Related from "./related";
import { AdvertiseDetail } from "../advertiseInterface";
import Info from "./info";
import { ADVERTISE_DETAILS } from "@/lib/urls";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { saveEntityVisit } from "@/Helpers/Utilities";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";

interface AdvertiseId_res extends IAPIResult<AdvertiseDetail> {}
interface IdProps {
  params: {
    id: string;
    title: string;
  };
}

const getData = cache(async (id: string) => {
  const response = await axiosInstance.get<AdvertiseId_res>(
    `${ADVERTISE_DETAILS}/${id}`,
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
      return GetMetadata("آگهی یافت نشد");
    }
    const engTitle = item.productEngTitle ? ` (${item.productEngTitle})` : "";
    const title = `آگهی فروش ${item.productTitle}${engTitle} - شماره ${item.id}`;
    const description = `آگهی فروش ${item.productTitle} (${
      item.productEngTitle
    }) - توسط ${item.userFullName || item.companyTitle || ""} - شماره ${
      item.id
    }`;
    return GetMetadata(title, description);
  } catch (error) {
    return GetMetadata();
  }
}

export default async function Page({ params }: IdProps) {
  const id = params.id;
  const res = await getData(id);
  const item = res.data.success && res.data.data ? res.data.data : null;
  if (!res.data.success || !item) {
    notFound();
  }
  await saveEntityVisit(item.id, EntityTypeEnum.Advertise);

  return (
    <div className="row mx-0 mobileFlex ">
      <div className="col-lg-4 hideInMobileScreen AdvertisementBG">
        <Related
          id={item.id.toString()}
          title={item.productTitle}
          productId={item.productId}
        />
      </div>
      <div className="col-lg-8 BorderLeft">
        <Info response={item as AdvertiseDetail} />
      </div>
    </div>
  );
}
