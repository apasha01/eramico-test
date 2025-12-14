import SideBanner from "@/Components/Home/Sidebar/SideBanner/SideBanner";
import SponsoringCompanies from "@/Components/Home/Sidebar/sponsoring-companies/sponsoring-companies";
import Footer from "@/Components/Shared/Footer/Footer";
import Inquiries from "@/Components/common/inquiries";
import TodayMarket from "@/Components/Home/Sidebar/today-market/today-market";
import { FEED_ADVERTISMENTS, FEED_INQUIRIES } from "@/lib/urls";
import Advertisments from "@/Components/common/advertisments";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="row mx-0 mobileFlex ">
        <div className="col-lg-4 pt-3 hideInMobileScreen">
          <Advertisments
            url={FEED_ADVERTISMENTS}
            title="آگهی‌های فروش"
            showProduct
            showUsername
          />
          <Inquiries
            url={FEED_INQUIRIES}
            title="استعلام‌ها"
            showProduct
            showUsername
          />
          <SideBanner />
          <TodayMarket />
          <SideBanner />
          <SponsoringCompanies />
          <SideBanner />
          <Footer />
        </div>
        <div className="col-lg-8 BorderLeft">{children}</div>
      </div>
    </>
  );
}
