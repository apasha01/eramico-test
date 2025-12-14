import React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import Link from "next/link";

export default function LinearProgress(props: { value: number }) {
  return (
    <div className="d-flex gap-2 align-items-center">
      <div className={styles.progressBar}>
        <div
          className={styles.progressBarInner}
          style={{ width: `${100 - props.value}%` }}
        ></div>
      </div>
      <Typography className="fs-14 fw-500" component={Link} href="/my-profile/dashboard">
        {props.value}% از پروفایل تکمیل شده
      </Typography>
    </div>
  );
}
