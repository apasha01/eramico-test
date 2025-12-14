"use client";

import { useEffect, useState } from "react";
import CompanyUser from "./company-user";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { COMPANIES_USERS } from "@/lib/urls";
import LoaderComponent from "@/Components/LoaderComponent";
import { Typography } from "@mui/material";

interface CompanyUsersProps {
  id: number;
}

const CompanyUsers = ({ id }: CompanyUsersProps) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCompanyUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<any>(`${COMPANIES_USERS}/${id}`);
      setData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyUsers();
  }, [id]);

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <div
      className="d-flex flex-column mt-4 company-users"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {data.length > 0 ? (
        data.map((item: any) => (
          <CompanyUser
            key={item.userId + item.companyId + item.id + ""}
            positionId={item.positionId}
            id={item.id}
            userId={item.userId}
            companyId={item.companyId}
            avatar={item.userAvatar}
            name={item.fullName}
            position={item.positionTitle}
            phoneNumber={item.phoneNumber}
            meIsOwner={data.some((user: any) => user.isOwner && user.isMe)}
            isMember={item.isMember}
            isOwner={item.isOwner}
            demandType={item.companyUserDemandTypeId}
            verified={item.userIsVerified}
            isMe={item.isMe}
            subscriptionAvatar={item.userSubscriptionAvatar}
            onReload={() => fetchCompanyUsers()}
          />
        ))
      ) : (
        <Typography className="fw-600 fs-18 text-center pb-3">
          عضوی برای این شرکت پیدا نشد.
        </Typography>
      )}
    </div>
  );
};

export default CompanyUsers;
