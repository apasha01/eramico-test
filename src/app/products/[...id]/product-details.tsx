/* eslint-disable react/jsx-key */
"use client";

import React, { Suspense } from "react";
import styles from "./styles.module.css";
import OverView from "./OverView";
import Advertise from "./advertise";
import Inquires from "./Inquires";
import Media from "./media";
import Price from "./Price";
import Companies from "./companies";
import Inquiries from "@/Components/common/inquiries";
import { ADVERTISE_LIST, INQUIRY_LIST, PRODUCT_FOLLOWERS } from "@/lib/urls";
import MenuIcon from "@/Components/Icons/MenuIcon";
import {TbMailOpened, TbSpeakerphone } from "react-icons/tb";
import { FaRegBuilding } from "react-icons/fa";
import { PiArticleBold, PiChartLineBold } from "react-icons/pi";
import SideBar from "@/Components/common/sidebar";
import Followers from "@/Components/common/followers";
import Advertisments from "@/Components/common/advertisments";
import LoaderComponent from "@/Components/LoaderComponent";
import { Box } from "@mui/material";
import TopTabs from "@/Components/common/top-tabs";

export interface HeaderProps {
  id: number;
  title: string;
  IsFollowed: boolean;
  IsConfirmedCompany: boolean;
  shortIntroduction: string;
  avatar: string | null;
  followerCount?: number;
  webpage?: string;
  telephone?: string;
  address?: string;
  hasPrice: boolean;
  categories: any[];
  selectedView: number;
  setSelectedView: (view: number) => void;
}

const ProductDetails = (props: HeaderProps) => {
  const { selectedView, setSelectedView, id, hasPrice, categories } = props;

  const sidebarList = [
    {
      id: 0,
      name: "نگاه کلی",
      icon: <MenuIcon color={selectedView === 0 ? "#fb8c00" : "#000"} />,
    },
    {
      id: 1,
      name: "آگهی‌ها",
      icon: (
        <TbSpeakerphone
          size={22}
          color={selectedView === 1 ? "#fb8c00" : "#000"}
        />
      ),
    },
    {
      id: 2,
      name: "استعلام‌ها",
      icon: (
        <TbMailOpened
          size={22}
          color={selectedView === 2 ? "#fb8c00" : "#000"}
        />
      ),
    },
    {
      id: 3,
      name: "شرکت‌ها",
      icon: (
        <FaRegBuilding
          size={22}
          color={selectedView === 3 ? "#fb8c00" : "#000"}
        />
      ),
    },
    ...(hasPrice
      ? [
          {
            id: 4,
            name: "قیمت و نمودار",
            icon: (
              <PiChartLineBold 
                size={22}
                color={selectedView === 4 ? "#fb8c00" : "#000"}
              />
            ),
          },
        ]
      : []),
    {
      id: 5,
      name: "اخبار و مقالات",
      icon: (
        <PiArticleBold
          size={22}
          color={selectedView === 5 ? "#fb8c00" : "#000"}
        />
      ),
    },
  ];

  const handleViewChange = (selectedItem: number) => {
    setSelectedView(selectedItem);
  };

  const componenets = [
    <OverView id={id} />,
    <Advertise id={id} />,
    <Inquires {...props} />,
    <Companies {...props} />,
    <Price id={id} category={categories[0]?.title} />,
    <Media {...props} />,
    <Followers url={`${PRODUCT_FOLLOWERS}/${id}`} type="follower" />,
  ];

  return (
    <Suspense fallback={<LoaderComponent />}>
      <div className="dividerStyle">
        {selectedView === 0 || selectedView === 5 ? (
          <Box
            className="pt-4 px-3 hideInMobileScreen"
            sx={{
              maxWidth: 600,
              minWidth: 500,
            }}
          >
            <Advertisments
              url={`${ADVERTISE_LIST}?ProductId=${id}`}
              title={`آگهی‌های فروش ${props.title}`}
              disableSubmitAdvertise
              showUsername
              productId={id}
            />
            <Inquiries
              url={`${INQUIRY_LIST}?ProductId=${id}`}
              title={`استعلام‌های ${props.title}`}
              disableSubmitInquiry
              showUsername
              productId={id}
            />
          </Box>
        ) : null}
        <div className={styles.listCompanyStyle} dir="rtl">
        <TopTabs
          sidebarList={sidebarList}
          selectedView={selectedView}
          onSelect={setSelectedView}
        />
          <div className={`${styles.listCategoryStyle} hideInMobileScreen`}>
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
      </div>
    </Suspense>
  );
};
export default ProductDetails;
