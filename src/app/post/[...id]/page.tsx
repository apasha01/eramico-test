import SideBanner from "@/Components/Home/Sidebar/SideBanner/SideBanner";
import TodayMarket from "@/Components/Home/Sidebar/today-market/today-market";
import SponsoringCompanies from "@/Components/Home/Sidebar/sponsoring-companies/sponsoring-companies";
import Footer from "@/Components/Shared/Footer/Footer";
import PostDetails from "./post-details";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { ADVERTISE_LIST, INQUIRY_LIST, POST_DETAILS } from "@/lib/urls";
import { notFound } from "next/navigation";
import Inquiries from "../../../Components/common/inquiries";
import Advertisments from "@/Components/common/advertisments";

export default async function Page(props: any) {
  const params = await props.params;
  const id = params?.id ?? undefined;

  const postDetails = await axiosInstance.get<any>(
    `${POST_DETAILS}/${id}`,
    await getServerAxiosConfig()
  );
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
        <PostDetails post={post} />
      </div>
    </>
  );
}
