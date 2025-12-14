import React from "react";
import { Button } from "@mui/material";
import styles from "./styles.module.css";
import { FaCheck, FaRegBuilding } from "react-icons/fa";
import MenuIcon from "@/Components/Icons/MenuIcon";
import { TbMailOpened, TbSpeakerphone } from "react-icons/tb";
import { PiArticleBold, PiChartLineBold } from "react-icons/pi";
import SideBar from "@/Components/common/sidebar";
import PageHeader from "@/Components/common/page-header";

export default function Loading() {
  const sidebarList = [
    {
      id: 0,
      name: "نگاه کلی",
      icon: <MenuIcon />,
    },
    {
      id: 1,
      name: "آگهی‌ها",
      icon: <TbSpeakerphone size={22} />,
    },
    {
      id: 2,
      name: "استعلام‌ها",
      icon: <TbMailOpened size={22} />,
    },
    {
      id: 3,
      name: "شرکت‌ها",
      icon: <FaRegBuilding size={22} />,
    },
    {
      id: 4,
      name: "قیمت و نمودار",
      icon: <PiChartLineBold size={22} />,
    },
    {
      id: 5,
      name: "اخبار و مقالات",
      icon: <PiArticleBold size={22} />,
    },
  ];
  return (
    <div className="mainStyle">
      <div className={styles.headerStyle}>
        <div className="headerBackRowStyle"></div>
        <PageHeader title="محصول">
          <Button
            className={"wantToFollowButtonStyle"}
            variant="outlined"
            type="button"
            endIcon={
              <>
                <FaCheck
                  size={13}
                  style={{
                    color: "#616161",
                  }}
                  color="#616161"
                />
              </>
            }
          >
            دنبال کردن
          </Button>
        </PageHeader>
      </div>
      <div className="dividerStyle">
        <div className={styles.listCompanyStyle} dir="rtl">
          <div className="listCategoryStyle">
            <SideBar sidebarList={sidebarList} />
          </div>
          <div
            className="mainStyle"
            style={{
              borderLeft: "1px solid #EEEEEE",
              borderRight: "1px solid #EEEEEE",
              height: "100%",
            }}
          >
            در حال دریافت اطلاعات محصول...
          </div>
        </div>
      </div>
    </div>
  );
}
