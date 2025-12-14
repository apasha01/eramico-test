import React, { cache } from "react";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import Related from "./related";
import { AdvertiseDetail } from "../inquiriesInterface";
import Info from "./info";
import { notFound } from "next/navigation";
import { INQUIRY_DETAILS } from "@/lib/urls";
import { saveEntityVisit } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";
import { IAPIResult } from "@/Helpers/IAPIResult";

interface InqueryId_res extends IAPIResult<AdvertiseDetail> {}
interface IdProps {
  params: {
    id: string;
  };
}

const getData = cache(async (id: string) => {
  const response = await axiosInstance.get<InqueryId_res>(
    `${INQUIRY_DETAILS}/${id}`,
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
      return GetMetadata("استعلام یافت نشد");
    }
    const engTitle = item.productEngTitle ? ` (${item.productEngTitle})` : "";
    const title = `آگهی خرید (استعلام) ${item.productTitle}${engTitle} - شماره ${item.id}`;
    const description = `آگهی خرید (استعلام) ${item.productTitle} (${
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
  const id = params?.id ?? undefined;
  const res = await getData(id);
  const item = res.data.success && res.data.data ? res.data.data : null;
  if (!res.data.success || !item) {
    notFound();
  }
  await saveEntityVisit(item.id, EntityTypeEnum.Advertise);

  return (
    <div className="row mx-0 mobileFlex">
      <div
        className="col-lg-4 hideInMobileScreen"
        style={{ background: "#FB8C0008" }}
      >
        <Related
          productId={item.productId}
          id={item.id.toString()}
          title={item.productTitle || ""}
        />
      </div>
      <div className="col-lg-8 BorderLeft">
        <Info response={item} />
      </div>
    </div>
  );
}
