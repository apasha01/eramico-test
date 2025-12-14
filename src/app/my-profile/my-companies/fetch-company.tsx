import LoaderComponent from "@/Components/LoaderComponent";
import { axiosInstance } from "@/Helpers/axiosInstance";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { saveEntityVisit } from "@/Helpers/Utilities";
import { COMPANY_DETAILS } from "@/lib/urls";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import CompanyName from "./company-name";
import CompanyDetails from "./company-details";
import { on } from "events";
interface CompanyRes extends IAPIResult<any> {}

interface FetchCompanyProps {
  id: string;
  onClose?: () => void;
}

const FetchCompany = ({ id ,onClose}: FetchCompanyProps) => {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedView, setSelectedView] = useState(0);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const url = Number.isInteger(Number(id))
          ? `${COMPANY_DETAILS}/${id}`
          : `Company/get?code=${id}`;

        const response = await axiosInstance.get<CompanyRes>(url);
        if (!response?.data?.success) {
          setError(true);
          setLoading(false);
          return;
        }
        const c = response.data.data;

        setCompany(c);
        await saveEntityVisit(c.id, EntityTypeEnum.Company);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching company data:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  if (loading) {
    return <LoaderComponent />;
  }

  if (error || !company) {
    notFound();
  }

  return (
    <div className="mainStyle">
      <CompanyName
        id={company.id}
        title={company.title}
        isFollowed={company.isFollowed}
        isVerified={company.isVerified}
        membershipPeriod={company.membershipPeriod}
        followerCount={company.followerCount}
        avatar={company?.avatar}
        isMine={company.isMine}
        code={company.code}
        company={company}
        setSelectedView={setSelectedView}
      />
      <div className="dividerStyle">
        <CompanyDetails
          {...company}
          onClose={onClose}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
      </div>
    </div>
  );
};


export default FetchCompany