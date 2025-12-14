import SideBanner from "@/Components/Home/Sidebar/SideBanner/SideBanner";
import TodayMarket from "@/Components/Home/Sidebar/today-market/today-market";
import SponsoringCompanies from "@/Components/Home/Sidebar/sponsoring-companies/sponsoring-companies";
import Footer from "@/Components/Shared/Footer/Footer";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { ADVERTISE_LIST, INQUIRY_LIST, REPOST_DETAILS } from "@/lib/urls";
import Inquiries from "../../../Components/common/inquiries";
import RepostDetails from "./repost-details";
import { notFound } from "next/navigation";
import Advertisments from "@/Components/common/advertisments";
import { saveEntityVisit } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";

export default async function Page(props: any) {
  const params = await props.params;
  const id = params?.id ?? undefined;

  const postDetails = await axiosInstance.get<any>(`${REPOST_DETAILS}/${id}`);
  if (!postDetails.data.success || !postDetails.data.data) {
    return notFound();
  }
  const post = postDetails.data.data;
  await saveEntityVisit(id, EntityTypeEnum.Repost);
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
        <RepostDetails
          repost={post}
          vote={post?.vote}
          post={post?.post}
          content={post?.content}
        />
      </div>
    </>
  );
}
