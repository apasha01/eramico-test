"use client";

import React, { useState } from "react";
import styles from "../styles.module.css";
import { Typography } from "@mui/material";

import ContactInfoGrid from "../@componenets/ContactInfoGrid";
import SocialInfoGrid from "../@componenets/SocialInfoGrid";

export default function ContactInfo() {
  return (
    <div className={styles.personalInfoMainDiv}>
      <div className={styles.rowSpaceBetween}>
        <Typography className="fs-24 fw-500"> اطلاعات تماس</Typography>
      </div>
      <ContactInfoGrid />
      <div style={{ width: "100%", borderBottom: "1px solid #EEEEEE" }}></div>
      <SocialInfoGrid />
    </div>
  );
}
