/* eslint-disable react/jsx-key */
"use client";

import React from "react";
import styles from "./styles.module.css";
import OverView from "./OverView";
import Advertise from "./advertise";
import Inquires from "./Inquires";
import Posts from "./posts";
import MenuIcon from "@/Components/Icons/MenuIcon";
import { TbMailOpened, TbNews, TbSpeakerphone } from "react-icons/tb";
import { USER_FOLLOWERS, USER_FOLLOWS } from "@/lib/urls";
import SideBar from "@/Components/common/sidebar";
import Followers from "@/Components/common/followers";

export interface HeaderProps {
  id: number;
  title: string;
  IsFollowed: boolean;
  IsConfirmedCompany: boolean;
  shortIntroduction: string;
  avatar: string | null;
  followerCount: number;
  webpage: string | null;
  telephone: string | null;
  address: string | null;
  selectedView: number;
  setSelectedView: (view: number) => void;
}

const ProfileDetails = (props: HeaderProps) => {
  const { selectedView, setSelectedView, id, title } = props;
  const handleViewChange = (selectedItem: number) => {
    setSelectedView(selectedItem);
  };

  const sidebarList = [
    {
      id: 0,
      name: "نگاه کلی",
      icon: <MenuIcon color={selectedView === 0 ? "#fb8c00" : "#000"} />,
    },
    {
      id: 1,
      name: "پُست‌ها",
      icon: (
        <TbNews size={22} color={selectedView === 1 ? "#fb8c00" : "#000"} />
      ),
    },
    {
      id: 2,
      name: "آگهی‌ها",
      icon: (
        <TbSpeakerphone
          size={22}
          color={selectedView === 2 ? "#fb8c00" : "#000"}
        />
      ),
    },
    {
      id: 3,
      name: "استعلام‌ها",
      icon: (
        <TbMailOpened
          size={22}
          color={selectedView === 3 ? "#fb8c00" : "#000"}
        />
      ),
    },
  ];

  const componenets = [
    <OverView id={id} />,
    <Posts id={id} />,
    <Advertise id={id} />,
    <Inquires id={id} />,
    <Followers url={`${USER_FOLLOWERS}/${id}`} type="follower" />,
    <Followers url={`${USER_FOLLOWS}/${id}`} type="follow" />,
  ];

  return (
    <div className={styles.listCompanyStyle} dir="rtl">
      <div className={styles.listCategoryStyle}>
        <SideBar
          onSelect={handleViewChange}
          selectedView={selectedView}
          sidebarList={sidebarList}
        />
      </div>
      <div
        className="mainStyle"
        style={{
          borderLeft: " 1px solid #EEEEEE",
          borderRight: " 1px solid #EEEEEE",
          height: "100%",
        }}
      >
        {componenets[selectedView]}
      </div>
    </div>
  );
};

export default ProfileDetails;
