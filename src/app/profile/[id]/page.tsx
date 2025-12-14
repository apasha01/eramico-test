"use client";

import { axiosInstance } from "@/Helpers/axiosInstance";
import React, { Suspense, useEffect, useState } from "react";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { notFound } from "next/navigation";
import LoaderComponent from "@/Components/LoaderComponent";
import { USER_DETAILS, USER_SOCIAL_MEDIA } from "@/lib/urls";
import ProfileName from "./profile-name";
import ProfileDetails from "./profile-details";
import SideBanner from "@/Components/Home/Sidebar/SideBanner/SideBanner";
import RecommendedProducts from "@/Components/common/recommended-products";
import SocialMedia from "@/Components/common/social-media";
import { saveEntityVisit } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";

interface User_res extends IAPIResult<any> {}
interface IdProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: IdProps) {
  const { id } = params;
  return (
    <Suspense fallback={<LoaderComponent />}>
      <FetchCompany id={id} />
    </Suspense>
  );
}

interface FetchCompanyProps {
  id: string;
}

function FetchCompany({ id }: FetchCompanyProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedView, setSelectedView] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get<User_res>(
          `${USER_DETAILS}/${id}`
        );

        if (!response?.data?.success) {
          setError(true);
          setLoading(false);
          return;
        }
        const u = response.data.data;
        setUser(u);
        try {
          await saveEntityVisit(u.id, EntityTypeEnum.User);
        } catch {} // do nothing for now, but log it later if needed
        setLoading(false);
      } catch (err) {
        console.error("Error fetching company data:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <LoaderComponent />;
  }

  if (error || !user) {
    notFound();
  }

  return (
    <Suspense fallback={<LoaderComponent />}>
      <div className="mainStyle">
        <ProfileName
          id={user.id}
          title={user.fullName}
          isFollowed={user.isFollowed}
          isVerified={user.isVerified}
          membershipPeriod={user.membershipPeriod}
          followerCount={user.followerCount}
          followCount={user.followCount}
          avatar={user?.avatar}
          code={user.userName}
          setSelectedView={setSelectedView}
          isSafe={user.isSafe}
          subscriptionAvatar={user.subscriptionAvatar}
        />
        <div className="dividerStyle">
          <div className="pt-4 pe-4 ps-2 hideInMobileScreen min-w-350 max-w-450">
            <SocialMedia url={`${USER_SOCIAL_MEDIA}/${id}`} />
            <RecommendedProducts />
            <SideBanner />
          </div>
          <ProfileDetails
            {...user}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          />
        </div>
      </div>
    </Suspense>
  );
}
