"use client";

import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Social_res extends IAPIResult<any> {}

const SocialMedia = ({ url }: { url: string }) => {
  const [socialMedia, setSocialMedia] = useState<any>([]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axiosInstance.get<Social_res>(url);

        setSocialMedia(response.data.data);
      } catch (err) {
        console.error("Error fetching company data:", err);
      }
    };

    fetchCompanyData();
  }, [url]);
  if (!socialMedia || socialMedia.length === 0) {
    return <></>;
  } else {
    return (
      <div className="main-div-social" dir="rtl">
        <Typography className="fs-18 fw-500">شبکه‌های اجتماعی</Typography>

        <div className="col-12 d-flex gap-4 pb-1">
          {socialMedia.length > 0 ? (
            socialMedia.map((media: any) => (
              <Link key={media.socialMediaCode} href={media.link}>
                <Image
                  alt={media?.socialMediaTitle}
                  src={media?.socialMediaIcon}
                  loading="lazy"
                  width={24}
                  height={24}
                />
              </Link>
            ))
          ) : (
            <span className="text-center w-100">شبکه اجتماعی یافت نشد.</span>
          )}
        </div>
      </div>
    );
  }
};

export default SocialMedia;
