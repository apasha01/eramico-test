import React, { cache } from "react";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { notFound } from "next/navigation";
import { COMPANY_DETAILS, COMPANY_LIST_USER } from "@/lib/urls";
import { saveEntityVisit } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";
import { Company } from "../companiesInterface";
import CompanyPageClient from "./company-page-client";
import { CompanyUserInterface } from "./@componenets/CompanyUserInterface";

interface CompanyRes extends IAPIResult<Company> {}
interface IdProps {
  params: {
    id: string;
  };
}

const getData = cache(async (id: string): Promise<Company | null> => {
  const config = await getServerAxiosConfig();
  try {
    let initialUrl = Number.isInteger(Number(id))
      ? `${COMPANY_DETAILS}/${id}`
      : `${COMPANY_DETAILS}?code=${id}`;

    let response = await axiosInstance.get<CompanyRes>(initialUrl, config);
    let companyData: Company | null = response.data.data ?? null;

    if (
      !Number.isInteger(Number(id)) &&
      !companyData?.avatar &&
      companyData?.id
    ) {
      const detailUrl = `${COMPANY_DETAILS}/${companyData.id}`;
      const detailResponse = await axiosInstance.get<CompanyRes>(
        detailUrl,
        config
      );

      if (!detailResponse?.data?.success) {
        return null;
      }
      companyData = detailResponse.data.data ?? null;
    }

    return companyData;
  } catch (error) {
    console.error("Error in getData (Server Component):", error);
    return null;
  }
});

export async function generateMetadata(props: IdProps): Promise<Metadata> {
  const item = await getData(props.params.id);
  if (!item) return GetMetadata("شرکت یافت نشد");
  return GetMetadata(item.title, item.introduction);
}

export default async function Page({ params }: IdProps) {
  const id = params?.id ?? undefined;

  const item = await getData(id);

  if (!item) {
    notFound();
  }
  let users: CompanyUserInterface[] = [];
  try {
    const userResponse = await axiosInstance.get<
      IAPIResult<CompanyUserInterface[]>
    >(`${COMPANY_LIST_USER}/${item.id}`, await getServerAxiosConfig());
    if (userResponse.data.success && userResponse.data.data) {
      users = userResponse.data?.data ?? [];
    }
  } catch (error) {
    console.error("Error fetching company users:", error);
    users = [];
  }
  await saveEntityVisit(item.id, EntityTypeEnum.Company);

  return <CompanyPageClient company={item} users={users} />;
}
