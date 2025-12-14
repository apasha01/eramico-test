"use client";

import { useState, useEffect, Suspense } from "react";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { Pagination, Typography } from "@mui/material";
import LoaderComponent from "@/Components/LoaderComponent";
import IndividualCompany from "@/app/companies/individual-company";
import { HeaderProps } from "./product-details";
import styles from "./styles.module.css";
import { COMPANY_LIST_PRIVATE } from "@/lib/urls";
import { PAGE_SIZE } from "@/lib/constants";

interface Company_res {
  success: boolean;
  data: any[];
  total: number;
}

export default function Companies(props: HeaderProps) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get<Company_res>(
          `${COMPANY_LIST_PRIVATE}?ProductId=${props.id}&Size=${PAGE_SIZE}&Page=${pageNumber}`
        );
        if (response.data.success) {
          setCompanies(response.data.data);
          setTotalCount(response.data.total || 0);
        } else {
          console.error("Failed to fetch companies:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
    return () => {};
  }, []);

  if (loading) {
    return <LoaderComponent />;
  }

  if (!companies.length) {
    return (
      <div
        className="container px-0 rounded-4 p-0 AdvertisementBG sellAdvertisement"
        style={{
          minHeight: "150px",
          maxWidth: "864px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          marginTop: "60px",
        }}
      >
        <Typography dir="rtl" className="fs-24 fw-500">
          متأسفانه شرکتی پیدا نشد.
        </Typography>
      </div>
    );
  }

  return (
    <div className="mainStyle">
      {companies.map((item: any) => (
        <div className={styles.listCompanyStyle} key={item.id}>
          <IndividualCompany
            id={item.id}
            name={item.title}
            isFollowed={item.isFollowed}
            isVerified={item.isVerified}
            membershipPeriod={item.membershipPeriod}
            followerCount={item.followerCount}
            shortIntroduction={item.shortIntroduction || ""}
            avatar={item.avatar}
            code={item.code}
            isSafe={item.isSafe}
          />
        </div>
      ))}
      <Suspense fallback={<LoaderComponent />}>
        <Pagination
          count={Math.ceil(Number(totalCount) / PAGE_SIZE)}
          page={pageNumber}
          onChange={(_, page) => setPageNumber(page)}
          className="mt-3"
        />
      </Suspense>
    </div>
  );
}
