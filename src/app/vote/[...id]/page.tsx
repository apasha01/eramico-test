import SideBanner from "@/Components/Home/Sidebar/SideBanner/SideBanner";
import TodayMarket from "@/Components/Home/Sidebar/today-market/today-market";
import SponsoringCompanies from "@/Components/Home/Sidebar/sponsoring-companies/sponsoring-companies";
import Footer from "@/Components/Shared/Footer/Footer";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { ADVERTISE_LIST, INQUIRY_LIST, VOTE_DETAILS } from "@/lib/urls";
import { notFound } from "next/navigation";
import Inquiries from "../../../Components/common/inquiries";
import VoteDetails from "./vote-details";
import Advertisments from "@/Components/common/advertisments";
import { cache } from "react";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";

interface IdProps {
  params: Promise<{
    id: string;
    page?: string;
  }>;
}

const getData = cache(async (id: string) => {
  const response = await axiosInstance.get<any>(
    `${VOTE_DETAILS}/${id}`,
    await getServerAxiosConfig()
  );
  return response;
});

export async function generateMetadata(props: IdProps): Promise<Metadata> {
  const params = await props.params;
  const id = params?.id ?? undefined;

  try {
    const response = await getData(id);
    const item = response?.data.data;
    if (!item || !response.data.success) {
      return GetMetadata("نظرسنجی یافت نشد");
    }

    return GetMetadata(`${item.title}`, item.lead || item.title);
  } catch (error) {
    return GetMetadata();
  }
}

export default async function Page(props: any) {
  const params = await props.params;
  const id = params?.id ?? undefined;

  const postDetails = await getData(id);
  if (!postDetails.data.success || !postDetails.data.data) {
    return notFound();
  }
  const post = postDetails.data.data;

  return (
    <>
      <div className="col-lg-4 pt-3 hideInMobileScreen">
        <Advertisments
          url={`${ADVERTISE_LIST}?${post?.companyId ? "companyId" : "userId"}=${
            post?.companyId ? post?.companyId : post?.userId
          }`}
          title={`آگهی‌های ${
            post?.companyId ? post?.companyTitle : post?.userFullName
          }`}
          showProduct
          disableSubmitAdvertise
        />
        <Inquiries
          url={`${INQUIRY_LIST}?${post?.companyId ? "companyId" : "userId"}=${
            post?.companyId ? post?.companyId : post?.userId
          }`}
          title={`استعلام‌های ${
            post?.companyId ? post?.companyTitle : post?.userFullName
          }`}
          showProduct
          disableSubmitInquiry
        />
        <SideBanner />
        <TodayMarket />
        <SideBanner />
        <SponsoringCompanies />
        <SideBanner />
        <Footer />
      </div>
      <div className="col-lg-8 BorderLeft">
        <VoteDetails vote={post} />
      </div>
    </>
  );
}
