import { unstable_noStore as noStore } from "next/cache";
import { Button, Divider } from "@mui/material";
import Link from "next/link";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { FEED_COMPANIES } from "@/lib/urls";
import TableItem from "./table-item";

interface CompanyResponse extends IAPIResult<any> {}

export default async function SponsoringCompanies() {
  noStore();
  const response = await axiosInstance.get<CompanyResponse>(FEED_COMPANIES);

  if (!response.data.success) {
    return null;
  }

  const companies = response?.data?.data.map((company: any) => ({
    id: company?.id,
    title: company?.title,
    shortIntroduction: company?.shortIntroduction,
    isVerified: company?.isVerified,
    avatar: company?.avatar,
    code: company?.code,
  }));

  return (
    <>
      <section className="row px-3 pb-4">
        <div className="container AdvertisementBG rounded-4 p-3 pb-0">
          <h6 className="col-12 rtl mt-1">شرکت‌ها</h6>
          {companies.map((company: any, index: number) => (
            <TableItem
              key={index}
              companyLogo={company.avatar}
              companyName={company.title}
              companyUserName={company.code}
              description={company.shortIntroduction}
              to={company.code ? company.code : company.id.toString()}
              id={company.id.toString()}
              verified={company.isVerified}
            />
          ))}
          <div className="col-12 text-center pb-4 pt-2">
            <Button
              size="small"
              variant="outlined"
              LinkComponent={Link}
              href="/companies"
            >
              مشاهده همه
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
