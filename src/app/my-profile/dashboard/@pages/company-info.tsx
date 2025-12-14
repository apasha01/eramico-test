"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles.module.css";
import { Button, Typography } from "@mui/material";
import { FiPlusCircle } from "react-icons/fi";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { MY_DASHBOARD_COMPANIES } from "@/lib/urls";
import LoaderComponent from "@/Components/LoaderComponent";
import Company from "../@componenets/setCompanyComponents/company";
import CreateNewCompany from "./create-new-company";

export default function CompanyInfo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openNewCompanyModal, setOpenNewCompanyModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get<any>(MY_DASHBOARD_COMPANIES);
      if (response?.data?.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div
      className={styles.personalInfoMainDiv}
      style={{ gap: "24px", minHeight: "50vh" }}
    >
      {openNewCompanyModal ? (
        <CreateNewCompany onClose={() => setOpenNewCompanyModal(false)} />
      ) : (
        <>
          <div
            className={styles.rowSpaceBetween}
            style={{ marginBottom: "8px" }}
          >
            <Typography className="fs-24 fw-500">اطلاعات شرکت</Typography>
            <Button
              className="py-2"
              variant="outlined"
              sx={{
                border: "1px solid #E0E0E0",
                color: "#212121",
                "&:hover": {
                  backgroundColor: "transparent",
                  borderColor: "#FB8C00",
                },
              }}
              startIcon={<FiPlusCircle style={{}} />}
              onClick={() => setOpenNewCompanyModal(true)}
            >
              افزودن شرکت جدید
            </Button>
          </div>
          {data.map((item: any) => (
            <Company
              key={item.companyId + item.id}
              id={item.id}
              companyId={item.companyId}
              positionId={item.positionId}
              demandTypeId={item.companyUserDemandTypeId}
              position={item.positionTitle}
              isOwner={item.isOwner}
              isMember={item.isMember}
              avatar={item.companyAvatar || ""}
              name={item.companyTitle}
              introduction={item.shortIntroduction}
              subscriptionAvatar={item.subscriptionAvatar || ""}
              isSafe={item.companyIsSafe}
              isVerified={item.companyIsVerified}
              onReload={fetchData}
            />
          ))}
        </>
      )}
    </div>
  );
}
