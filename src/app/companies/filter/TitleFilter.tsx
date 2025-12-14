"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Button, Typography } from "@mui/material";
import { PiSortAscending } from "react-icons/pi";
import { useRouter } from "next/navigation";
import LoaderComponent from "@/Components/LoaderComponent";
import SearchParamsInterface from "@/Helpers/Interfaces/SearchParamsInterface";

export interface FilterItem {
  key: string;
  label: string;
}

interface TitleFiltersProps {
  url: string;
  items?: FilterItem[];
  defaultSelected?: string;
  activeColor?: string;
  inactiveColor?: string;
  searchParams: SearchParamsInterface;
}

export default function TitleFilters({
  url,
  items = [
    { key: "eranico", label: "پیشنهاد ایرانیکو" },
    { key: "newest", label: "جدیدترین" },
    { key: "oldest", label: "قدیمی‌ترین" },
    { key: "MostAdvertise", label: "بیشترین آگهی" },
    { key: "asc", label: "الف تا ی" },
    { key: "desc", label: "ی تا الف" },
  ],
  defaultSelected = "",
  activeColor = "#FB8C00",
  inactiveColor = "#000000",
  searchParams,
}: TitleFiltersProps) {
  const [selectedItem, setSelectedItem] = useState(defaultSelected);
  const router = useRouter();

  const handleItemClick = (key: string) => {
    const newValue = selectedItem === key ? "" : key;
    setSelectedItem(newValue);

    const current = new URLSearchParams(
      Array.from(Object.entries(searchParams) ?? [])
    );

    // پاک کردن مقادیر قبلی
    current.delete("orderField");
    current.delete("orderType");

    if (newValue) {
      switch (newValue) {
        case "newest":
          current.set("orderField", "createdDate");
          current.set("orderType", "desc");
          break;
        case "oldest":
          current.set("orderField", "createdDate");
          current.set("orderType", "asc");
          break;
        case "Alphabetic":
          current.set("orderField", "title");
          current.set("orderType", "asc");
          break;
        case "eranico":
        case "MostAdvertise":
          current.set("orderType", newValue);
          break;
        case "asc":
          current.set("orderField", "title");
          current.set("orderType", "asc");
          break;
        case "desc":
          current.set("orderField", "title");
          current.set("orderType", "desc");
          // current.set("orderType", newValue);
          break;
      }
    }

    // ریست صفحه به اول
    current.delete("page");
    router.replace(`${url}?${current.toString()}`);
  };

  useEffect(() => {
    const getParam = (key: string) => {
      return searchParams[key] || "";
    };
    const orderField = getParam("orderField");
    const orderType = getParam("orderType");

    let currentKey = defaultSelected;

    if (orderField === "createdDate") {
      currentKey = orderType === "asc" ? "oldest" : "newest";
    } else if (orderField === "title" && orderType === "asc") {
      currentKey = "asc";
    } else if (orderField === "title" && orderType === "desc") {
      currentKey = "desc";
    } else if (orderType === "MostAdvertise") {
      currentKey = "MostAdvertise";
    }

    setSelectedItem(currentKey);
  }, [searchParams, defaultSelected]);

  return (
    <Suspense fallback={<LoaderComponent />}>
      <div className="orderItemStyle p-4 mt-2">
        <div className="item d-flex align-items-center gap-2">
          <Typography className="fs-14 fw-500 d-flex align-items-center">
            <PiSortAscending size={24} style={{ marginInline: "4px" }} />
            مرتب‌سازی:
          </Typography>
          {items.map((item) => (
            <Button
              key={item.key}
              onClick={() => handleItemClick(item.key)}
              className="fs-14 fw-500 pointerCursor"
              style={{
                minWidth: "100px",
                height: "40px",
                color: selectedItem === item.key ? activeColor : inactiveColor,
                backgroundColor: "white",
                marginRight: "8px",
              }}
              variant="text"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </Suspense>
  );
}
