"use client";

import React, { useState } from "react";
import styles from "../styles.module.css";
import { Typography } from "@mui/material";
import AvatarChanger from "@/Components/Shared/AvatarChanger";
import LinearProgress from "../@componenets/LinearProgress";
import PersonalInfoGrid from "../@componenets/personalInfoGrid";
import Activity from "../@componenets/personalFollowActivity";
import IdCardPhoto from "../@componenets/idCardPhoto";
import { useAppSelector } from "@/lib/hooks";

export default function PersonalInfo() {
  const user = useAppSelector((state) => state.user);
  const [image, setImage] = useState("");

  return (
    <div className={styles.personalInfoMainDiv}>
      <div className={styles.rowSpaceBetween}>
        <Typography className="fs-24 fw-500">اطلاعات شخصی</Typography>
        <LinearProgress value={user?.profilePercentage} />
      </div>
      <div className="d-flex justify-content-center w-100">
        <AvatarChanger image={user?.avatar ?? image} setImage={setImage} />
      </div>
      <PersonalInfoGrid />
      <IdCardPhoto />

      <div style={{ width: "100%", borderBottom: "1px solid #EEEEEE" }} ></div>
      <Activity />
    </div>
  );
}
