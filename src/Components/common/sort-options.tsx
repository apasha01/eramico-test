"use client";

import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { PiSortAscending } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/metadata";
import SortItem from "@/Helpers/Interfaces/SortItem";
import SortProps from "@/Helpers/Interfaces/SortProps";
import { getSortOptionLabel } from "@/Helpers/Utilities";

export default function SortOptions(props: SortProps) {
  const items: SortItem[] = getSortOptionLabel(props);
  const {
    url,
    searchParams,
    defaultSelected = "eranico",
    queryStringName = "sort",
  } = props;

  const [selectedItem, setSelectedItem] = useState(defaultSelected);
  const router = useRouter();

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    const current = new URLSearchParams();
    if (searchParams) {
      // Convert searchParams to URLSearchParams
      if (searchParams instanceof URLSearchParams) {
        Array.from(searchParams.entries()).forEach(([key, value]) => {
          current.set(key, value);
        });
      } else {
        Object.entries(searchParams).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            current.set(key, value[0]);
          } else {
            current.set(key, value);
          }
        });
      }
    }

    if (item && item.length > 0) current.set(queryStringName, item);
    else current.delete(queryStringName);
    router.replace(`${url}?${current.toString()}`);
  };

  useEffect(() => {
    let sort = defaultSelected;
    if (searchParams) {
      if (searchParams instanceof URLSearchParams) {
        sort = searchParams.get(queryStringName) || defaultSelected;
      } else {
        const value = searchParams[queryStringName];
        sort = (Array.isArray(value) ? value[0] : value) || defaultSelected;
      }
      setSelectedItem(sort);
    }
  }, [searchParams, queryStringName, defaultSelected]);

  return (
    <div className="orderItemStyle">
      <div className="item">
        <Typography className="fs-14 fw-500">
          <PiSortAscending size={24} style={{ marginInline: "4px" }} />
          مرتب‌سازی:
        </Typography>
        {items.map((item) => (
          <Button
            key={item.value}
            className={`fs-14 fw-500 pointerCursor ${
              selectedItem === item.value ? "gold" : "greyColor2"
            }`}
            onClick={() => handleItemClick(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
