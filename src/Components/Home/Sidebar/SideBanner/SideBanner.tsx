"use client";

import { axiosInstance } from "@/Helpers/axiosInstance";
import { BANNER_REDIRECT } from "@/lib/urls";
import Image from "next/image";

interface SideBannerProps {
  zone?: number;
  banner?: {
    id: number;
    userId?: number;
    companyId?: number;
    title: string;
    bannerTypeId: number;
    bannerStatusId: number;
    startDate?: string;
    endDate?: string;
    sourceFileName?: string;
    htmlCode?: string;
    redirectURL?: string;
    maxClicks: number;
    maxImpressions: number;
    clicks: number;
    impressions: number;
    description?: string;
    createdDate?: string;
    lastModifiedDate?: string;
    cultureId?: number;
    bannerTypeTitle?: string;
    bannerStatusTitle?: string;
    image?: string;
    clickNo: number;
    bannerStatusIdentity?: string;
    startDatePersian?: string;
    endDatePersian?: string;
    createdDatePersian?: string;
    lastModifiedDatePersian?: string;
  };
}

export default function SideBanner({ banner, zone = 2 }: SideBannerProps) {
  interface BannerRedirectResponse {
    success: boolean;
    data: string | null;
  }

  const fetchBannerRedirectUrl = async (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    const response = await axiosInstance.post<BannerRedirectResponse>(
      `${BANNER_REDIRECT}${banner?.id}?zoon=${zone}`
    );
    if (response.data.success && response.data.data) {
      window.open(response.data.data, "_blank");
    }
  };
  if (!banner || !banner.image) {
    return null;
  }
  return (

    <a onClick={fetchBannerRedirectUrl} className="clickable" style={{ position: "relative", height:"200px" }}>
      <Image
      
        className="rounded pb-4 cursor-pointer space-banner"
        alt={banner?.title}
        src={banner?.image}
        loading="lazy"
        fill
      />
    </a>
  );
}
