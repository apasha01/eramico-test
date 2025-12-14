/* eslint-disable react/jsx-key */
"use client";

import React from "react";
import styles from "./styles.module.css";
import OverView from "./OverView";
import Advertise from "./advertise";
import Inquires from "./Inquires";
import Media from "./media";
import Posts from "./posts";
import Inquiries from "@/Components/common/inquiries";
import SideBanner from "@/Components/Home/Sidebar/SideBanner/SideBanner";
import MenuIcon from "@/Components/Icons/MenuIcon";
import { TbNews, TbMailOpened, TbSpeakerphone } from "react-icons/tb";
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
import CompanyEditInfo from "./company-info";
import { Apartment } from "@mui/icons-material";

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
}

const CompanyDetails = (props: HeaderProps) => {
  const handleViewChange = (selectedItem: number) => {
    setSelectedView(selectedItem);
  };

  const { selectedView, setSelectedView, id, title, isMine } = props;

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
    //  ...(isMine
    //   ? [
    //       {
    //         id: 6,
    //         name: "اطلاعات شرکت",
    //         icon: (
    //           <Apartment
    //           />
    //         ),
    //       },
    //     ]
    //   : []), // اضافه کردن منو فقط وقتی isMine برابر true باشد
  ];

  const componenets = [
    <OverView onSelect={handleViewChange} props={props} />,
    <Media {...props} />,
    <Posts id={id} />,
    <Advertise id={id} isMine={isMine} />,
    <Inquires id={id} isMine={isMine} />,
    <Followers url={`${COMPANY_FOLLOWERS}/${id}`} type="follower" />,
    ...(isMine ? [<CompanyEditInfo props={props} />] : []),
  ];

  return (
    <>
      {selectedView < 3 && (
        <div className="pt-4 pe-4 ps-2 hideInMobileScreen max-w-450 BorderRight">
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
        </div>
      )}
      <div className={styles.listCompanyStyle} dir="rtl">
        <div className={`${styles.listCategoryStyle} BorderLeft`}>
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
          {componenets[selectedView]}
        </div>
      </div>
    </>
  );
};
export default CompanyDetails;
