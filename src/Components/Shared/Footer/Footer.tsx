import { Button, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { HOME_SOCIAL_MEDIA } from "@/lib/urls";
import { APP_NAME } from "@/lib/metadata";
import moment, { Moment } from "moment-jalaali";

interface SocialMediaResponse {
  success: boolean;
  message: string | null;
  token: string | null;
  data: SocialMedia[];
  total: number;
}

interface SocialMedia {
  id: number;
  companyId: number;
  socialMediaTypeId: number;
  link: string;
  socialMediaTitle: string;
  socialMediaCode: string;
  socialMediaIconId: number;
  socialMediaIcon: string;
  socialMediaOrderNo: number;
}

export default async function Footer() {
  const response = await axiosInstance.get<SocialMediaResponse>(
    HOME_SOCIAL_MEDIA
  );

  if (!response.data.success) {
    return null;
  }

  return (
    <section dir="rtl">
      <div className="col-12 d-flex gap-4">
        {response?.data?.data?.map((media, index) => (
          <Link key={media.id + index + "footer"} href={media.link}>
            <Image
              alt={media?.socialMediaTitle}
              src={media?.socialMediaIcon}
              loading="lazy"
              width={24}
              height={24}
            />
          </Link>
        ))}
      </div>
      <div className="row col-12 mt-3">
        <div className="col-3 mx-0 px-0">
          <Button
            LinkComponent={Link}
            href="/policy"
            variant="text"
            className="col-12 px-0"
          >
            قوانین و مقررات
          </Button>
        </div>
        <div className="col-3 mx-0 px-0">
          <Button
            LinkComponent={Link}
            href="/privacy"
            variant="text"
            className="col-12 px-0"
          >
            حریم خصوصی
          </Button>
        </div>
        <div className="col-3 mx-0 px-0">
          <Button
            LinkComponent={Link}
            href="/about-us"
            variant="text"
            className="col-12 px-0"
          >
            درباره ما
          </Button>
        </div>
        <div className="col-3 mx-0 px-0">
          <Button
            LinkComponent={Link}
            href="/contact-us"
            variant="text"
            className="col-12 px-0"
          >
            تماس با ما
          </Button>
        </div>
        <div className="col-3 mx-0 px-0">
          <a
            referrerPolicy="origin"
            target="_blank"
            rel="noopener"
            href="https://trustseal.enamad.ir/?id=10312&Code=rkJbYl0S1odHbRCstpw2"
          >
            <img
              alt="نماد اعتماد الکترونیکی"
              src="https://trustseal.enamad.ir/logo.aspx?id=10312&Code=rkJbYl0S1odHbRCstpw2"
              referrerPolicy="origin"
              style={{ cursor: "pointer", width: 100, height: "auto" }}
            />
          </a>
        </div>
      </div>
      <Typography variant="body2" className="col-12 mt-3">
        © {APP_NAME} {moment().format("jYYYY")} - 1389 | تمام حقوق محفوظ است.
      </Typography>
    </section>
  );
}
