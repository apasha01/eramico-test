import SponsoringCompanies from "@/Components/Home/Sidebar/sponsoring-companies/sponsoring-companies";
import Footer from "@/Components/Shared/Footer/Footer";
import Inquiries from "@/Components/common/inquiries";
import SpecialOffer from "@/Components/Home/Sidebar/special-offer/special-offer";
import TodayMarket from "@/Components/Home/Sidebar/today-market/today-market";
import dynamic from "next/dynamic";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import {
  BANNER_HOME_SUGGESTION,
  FEED_ADVERTISMENTS,
  FEED_INQUIRIES,
} from "@/lib/urls";
import Advertisments from "@/Components/common/advertisments";
import LatestNews from "@/Components/Home/Sidebar/LatestNews/latest-news";

const MainHome = dynamic(() => import("@/Components/Home/Main/main-home"), {
  ssr: false,
});

const SideBanner = dynamic(
  () => import("@/Components/Home/Sidebar/SideBanner/SideBanner"),
  { ssr: false }
);

export default async function page() {
  const response = await axiosInstance.get<any>(
    BANNER_HOME_SUGGESTION,
    await getServerAxiosConfig()
  );

  if (!response.data.success || !response.data.data) {
    return null;
  }
  const banners = response.data.data;

  return (
    <div className="row mx-0 mobileFlex">
      <div className="col-lg-4 pt-3 hideInMobileScreen">
        <div className="w-100 pt-4 pe-4 ps-2 hideInMobileScreen  BorderRight">
          <SpecialOffer />
          <SideBanner banner={banners[0]} />
          <Advertisments
            url={FEED_ADVERTISMENTS}
            title="آگهی‌ها"
            showProduct
            showUsername
          />
          <Inquiries
            url={FEED_INQUIRIES}
            title="استعلام‌ها"
            showProduct
            showUsername
          />
        </div>

        <TodayMarket />
        <LatestNews />
        <SideBanner banner={banners[1]} />
        <SponsoringCompanies />
        <SideBanner banner={banners[2]} />
        <Footer />
      </div>
      <div className="col-lg-8">
        <MainHome />
      </div>
    </div>
  );
}
