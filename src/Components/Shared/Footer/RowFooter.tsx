"use client";

import { Button, Typography } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { APP_NAME } from "@/lib/metadata";
import moment from "jalali-moment";

export default function Footer() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const buttons = [
    { href: "/policy", label: "قوانین و مقررات" },
    { href: "/privacy", label: "حریم خصوصی" },
    { href: "/contact-us", label: "تماس با ما" },
    { href: "/about-us", label: "درباره ما" }, // Changed to avoid duplicate href
  ];

  return (
    <div className="mainStyle">
      <div className={styles.footerStyle} dir="rtl">
        {buttons.map(({ href, label }) =>
          !currentUrl?.includes(href) ? ( // Render only if the current URL doesn't include the href
            <Button
              key={href}
              LinkComponent={Link}
              href={href}
              variant="text"
              className="px-0"
              color="inherit"
            >
              {label}
            </Button>
          ) : null
        )}
      </div>
      <Typography className="fs-14 fw-500 ">
        © {APP_NAME} {moment().format('jYYYY')} - 1389 | تمام حقوق محفوظ است.
      </Typography>
    </div>
  );
}
