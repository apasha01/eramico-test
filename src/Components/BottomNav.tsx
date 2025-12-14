"use client";

import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect, useState, SyntheticEvent } from "react";
import {
  HomeTwoTone,
  ListTwoTone,
  CampaignTwoTone,
  DraftsTwoTone,
  ViewCompactTwoTone,
  Newspaper,
} from "@mui/icons-material";
import Link from "next/link";

const navItems = [
  { label: "خانه", icon: <HomeTwoTone width={20} height={20} />, href: "/" },
  {
    label: "دسته‌بندی",
    icon: <ListTwoTone width={20} height={20} />,
    href: "/products",
  },
  {
    label: "آگهی‌ها",
    icon: <CampaignTwoTone width={20} height={20} />,
    href: "/advertise",
  },
  {
    label: "استعلام‌ها",
    icon: <DraftsTwoTone width={20} height={20} />,
    href: "/inquiries",
  },
  {
    label: "شرکت‌ها",
    icon: <ViewCompactTwoTone width={20} height={20} />,
    href: "/companies",
  },
  { label: "اخبار", icon: <Newspaper width={20} height={20} />, href: "/news" },
];

const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const getPathIndex = (currentPath: string) => {
    if (currentPath === "/") return 0;

    const index = navItems.slice(1).findIndex((item) => {
      const rootPath = item.href === "/" ? "/" : item.href + "/";
      return currentPath.startsWith(rootPath) || currentPath === item.href;
    });

    return index !== -1 ? index + 1 : 0;
  };

  const [value, setValue] = useState<number>(getPathIndex(pathname));

  useEffect(() => {
    setValue(getPathIndex(pathname));
  }, [pathname]);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        boxShadow: "0 -1px 5px rgba(0,0,0,0.1)",
      }}
      className="mobile-nav rtl"
    >
      <BottomNavigation
        value={value}
        showLabels
        onChange={handleChange}
        sx={{
          backgroundColor: "#fff",
          height: 60,

          "& .MuiBottomNavigationAction-root": {
            flex: "1 1 0",
            minWidth: 0,
            maxWidth: "unset",
            margin: 0,
            padding: "6px 0",
          },
          "& svg": {
            fontSize: "22px",
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "12px",
          },

          "@media (max-width: 420px)": {
            "& .MuiBottomNavigationAction-root": {
              flex: "1 1 0",
              minWidth: 0,
              maxWidth: "unset",
              margin: 0,
              padding: "2px 0",
            },
            "& svg": {
              fontSize: "16px",
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "12px",
            },
          },

          "& .Mui-selected": {
            color: "#f7931e",
          },
        }}
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={item.href}
            label={item.label}
            icon={item.icon}
            component={Link}
            href={item.href}
            value={index}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
