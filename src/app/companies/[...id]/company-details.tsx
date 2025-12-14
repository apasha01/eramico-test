/* eslint-disable react/jsx-key */
"use client";

import React, { useEffect } from "react";
import styles from "./styles.module.css";
import OverView from "./OverView";
import Advertise from "./advertise";
import Inquires from "./Inquires";
import Media from "./media";
import Posts from "./posts";
import Inquiries from "@/Components/common/inquiries";
import SideBanner from "@/Components/Home/Sidebar/SideBanner/SideBanner";
import MenuIcon from "@/Components/Icons/MenuIcon";
import {
  TbNews,
  TbMailOpened,
  TbSpeakerphone,
  TbFileUpload,
} from "react-icons/tb";
import { FiPlay } from "react-icons/fi";
import SideBar from "@/Components/common/sidebar";
import Followers from "@/Components/common/followers";
import {
  ADVERTISE_LIST,
  COMPANY_FOLLOWERS,
  COMPANY_SOCIAL_MEDIA,
  INQUIRY_LIST,
} from "@/lib/urls";
import SocialMedia from "@/Components/common/social-media";
import Advertisments from "@/Components/common/advertisments";
import { Box } from "@mui/material";
import { CompanyUserInterface } from "./@componenets/CompanyUserInterface";
import CompanyDocument from "./@componenets/company-document";
import TopTabs from "@/Components/common/top-tabs";

export interface HeaderProps {
  id: number;
  title: string;
  IsFollowed: boolean;
  isMine: boolean;
  IsConfirmedCompany: boolean;
  shortIntroduction: string;
  avatar: string | null;
  followerCount: number;
  webpage: string | null;
  telephone: string | null;
  address: string | null;
  categoryIds: any[];
  province: string | null;
  city: string | null;

  economyCode: string | null;
  registrationCode: string | null;
  nationalCode: string | null;
  membershipPeriod: string | null;

  selectedView: number;
  setSelectedView: (view: number) => void;
  users: CompanyUserInterface[];
  loggedinUserId: number;
}

const CompanyDetails = (props: HeaderProps) => {
  const handleViewChange = (selectedItem: number) => {
    setSelectedView(selectedItem);
  };

  const { selectedView, setSelectedView, id, title, isMine , loggedinUserId } = props;
  const isMemeber = props.users?.some(user => user.userId === loggedinUserId)
  const isAllowed = isMine || isMemeber

  const sidebarList = [
    {
      id: 0,
      name: "نگاه کلی",
      icon: <MenuIcon color={selectedView === 0 ? "#fb8c00" : "#000"} />,
    },
    {
      id: 1,
      name: "رسانه‌ها",
      icon: (
        <FiPlay size={22} color={selectedView === 1 ? "#fb8c00" : "#000"} />
      ),
    },
    {
      id: 2,
      name: "پُست‌ها",
      icon: (
        <TbNews size={22} color={selectedView === 2 ? "#fb8c00" : "#000"} />
      ),
    },
    {
      id: 3,
      name: "آگهی‌ها",
      icon: (
        <TbSpeakerphone
          size={22}
          color={selectedView === 3 ? "#fb8c00" : "#000"}
        />
      ),
    },
    {
      id: 4,
      name: "استعلام‌ها",
      icon: (
        <TbMailOpened
          size={22}
          color={selectedView === 4 ? "#fb8c00" : "#000"}
        />
      ),
    },
    ...(isAllowed ?[{
      id: 5,
      name: " مدارک شرکت ",
      icon: (
        <TbFileUpload
          size={22}
          color={selectedView === 5 ? "#fb8c00" : "#000"}
        />
      ),
    }] : []),
  ];

  const renderContent = () => {
    switch (selectedView) {
      case 0:
        return (
          <OverView
            onSelect={handleViewChange}
            props={props}
            users={props.users}
          />
        );
      case 1:
        return <Media {...props} />;
      case 2:
        return <Posts id={id} isMine={isAllowed}/>;
      case 3:
        return <Advertise id={id} isMine={isAllowed} />;
      case 4:
        return <Inquires id={id} isMine={isAllowed} />;
      case 5:
        return <CompanyDocument id={id} isMine={isAllowed} />;
      case 6:
        return <Followers url={`${COMPANY_FOLLOWERS}/${id}`} type="follower" />;
      default:
        return (
          <OverView
            onSelect={handleViewChange}
            props={props}
            users={props.users}
          />
        );
    }
  };

  return (
    <>
      {selectedView < 3 && (
        <Box
          className="pt-4 pe-4 ps-2 hideInMobileScreen BorderRight"
          sx={{
            maxWidth: 600,
            minWidth: 500,
          }}
        >
          <SocialMedia url={`${COMPANY_SOCIAL_MEDIA}/${id}`} />
          <Advertisments
            url={`${ADVERTISE_LIST}?companyId=${id}`}
            title={`آگهی‌های ${title}`}
            showProduct
            disableSubmitAdvertise
          />
          <Inquiries
            url={`${INQUIRY_LIST}?companyId=${id}`}
            title={`استعلام‌های ${title}`}
            showProduct
            disableSubmitInquiry
          />
          <SideBanner />
        </Box>
      )}

  
      <div className={styles.listCompanyStyle} dir="rtl">
        <TopTabs
          sidebarList={sidebarList}
          selectedView={selectedView}
          onSelect={setSelectedView}
        />
        <div
          className={`${styles.listCategoryStyle} BorderLeft hideInMobileScreen`}
        >
          <SideBar
            onSelect={handleViewChange}
            selectedView={selectedView}
            sidebarList={sidebarList}
          />
        </div>
        <div
          className="mainStyle"
          style={{
            borderLeft: "1px solid #EEEEEE",
            borderRight: "1px solid #EEEEEE",
            height: "100%",
          }}
        >
          {renderContent()}
        </div>
      </div>
    </>
  );
};
export default CompanyDetails;
