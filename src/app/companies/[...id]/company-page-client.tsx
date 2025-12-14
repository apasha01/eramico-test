"use client";

import React, { useState } from "react";
import CompanyName from "./company-name";
import CompanyDetails from "./company-details";
import { CompanyUserInterface } from "./@componenets/CompanyUserInterface";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface CompanyPageClientProps {
  company: any;
  users: CompanyUserInterface[];
}

export default function CompanyPageClient({
  company,
  users,
}: CompanyPageClientProps) {
  const [selectedView, setSelectedView] = useState(0);
  const loggedinUserId = useSelector((state: RootState) => state.user.userId);

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
        isSafe={company.isSafe}
        subscriptionAvatar={company.subscriptionAvatar}
        setSelectedView={setSelectedView}
      />
      <div className="dividerStyle">
        <CompanyDetails
          {...company}
          loggedinUserId={loggedinUserId}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          users={users}
        />
      </div>
    </div>
  );
}
