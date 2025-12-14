"use client";

import React, { useState } from "react";
import { Button } from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MegaMenu from "./mega-menu";
import styles from "./styles.module.css";

export default function Menu() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  const headersData = [
    {
      label: "بازار و کالاها",
      href: "/products",
      activeColor: "#FB8C00",
    },
    {
      label: "آگهی‌ها ",
      href: "/advertise",
      activeColor: "#0D47A1",
    },
    {
      label: "استعلام‌ها",
      href: "/inquiries",
      activeColor: "#FB8C00",
    },
    {
      label: "شرکت‌ها",
      href: "/companies",
      activeColor: "#FB8C00",
    },
    {
      label: "اخبار و مقالات",
      href: "/news",
      activeColor: "#FB8C00",
    },
  ];

  return (
    <div className={`hideInMobileScreen ${styles.headContainerStyle}`}>
      {headersData.map(({ label, href }) => (
        <React.Fragment key={href}>
          {label === "بازار و کالاها" ? (
            <React.Fragment>
              <Button
                key={href}
                variant="text"
                size="large"
                className={`top-menu-item ${hovered ? "active" : ""}`}
                onMouseEnter={() => setHovered(true)}
                onClick={() => setHovered(!hovered)}
              >
                {label}
                {hovered ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>}
              </Button>

              <div
                className={`ltr ${styles.megaMenuContainerStyle} ${
                  hovered ? styles.open  : ""
                }`}
                onMouseLeave={() => setHovered(false)}
              >
                <MegaMenu
                  key={href || label}
                  handleCloseCall={() => setHovered(false)}
                />
              </div>
            </React.Fragment>
          ) : (
            <Button
              href={href}
              component={Link}
              variant="text"
              size="large"
              className={`top-menu-item ${
                pathname && pathname.startsWith(href) ? "active" : ""
              } ${href === "/advertise" ? "is-blue" : ""}`}
            >
              {label}
            </Button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
