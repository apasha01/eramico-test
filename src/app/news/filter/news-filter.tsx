"use client";

import { Button, Collapse, Typography } from "@mui/material";
import React, { useEffect, useState, Suspense } from "react";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import LoaderComponent from "@/Components/LoaderComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { TextField } from "@mui/material";
import DatePicker from "@/Components/common/date-picker";
import CategoryFilters from "@/Components/common/category-filters";
import { Category } from "@/Helpers/Interfaces/CategoryInterface";
import FilterIcon from "@/Components/Icons/FilterIcon";
import { MomentInput } from "jalali-moment";

interface CategoryProps {
  categories: Category[];
  searchParams: ReadonlyURLSearchParams | Record<string, string | string[]>;
}

const NewsFilter = ({ categories, searchParams }: CategoryProps) => {
  const getParam = (name: string): string | null => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(name);
    } else {
      const value = searchParams[name];
      return Array.isArray(value) ? value[0] : value || null;
    }
  };
  const router = useRouter();
  const [collapseFilterOpen, setCollapseFilterOpen] = useState(true);
  const [titleInput, setTitleInput] = useState<string | null>(
    getParam("title") || ""
  );
  const [fromDate, setFromDate] = useState<MomentInput | undefined>(
    getParam("from") || undefined
  );
  const [toDate, setToDate] = useState<MomentInput | undefined>(
    getParam("to") || undefined
  );

  const handleFilterChange = () => {
    const current = new URLSearchParams();
    if (titleInput && titleInput.length > 0) current.set("title", titleInput);
    else current.delete("title");
    if (fromDate && fromDate !== null) current.set("from", fromDate.toString());
    else current.delete("from");
    if (toDate && toDate !== null) current.set("to", toDate.toString());
    else current.delete("to");
    Object.keys(searchParams).forEach((key) => {
      if (key !== "title" && key !== "from" && key !== "to") {
        const value = searchParams[key];
        if (Array.isArray(value)) {
          current.set(key, value[0]);
        } else if (value) {
          current.set(key, value);
        }
      }
    });
    router.replace(`/news?${current.toString()}`);
  };

  return (
    <Suspense fallback={<LoaderComponent />}>
      <CategoryFilters
        categories={categories}
        url="/news"
        title="انتخاب دسته اخبار"
        hideChildren
        searchParams={searchParams}
      >
        <div className="headerBackColStyle" style={{ gap: "5px" }}>
          <Button
            onClick={() => setCollapseFilterOpen(!collapseFilterOpen)}
            style={{
              width: "100%",
              padding: "0px",
              margin: "0px",
              height: "52px",
              display: "flex",
              alignItems: "center",
              fontSize: "24px",
            }}
            endIcon={
              collapseFilterOpen ? (
                <ExpandLessIcon className="mt-2" />
              ) : (
                <ExpandMoreIcon className="mt-2" />
              )
            }
          >
            <Typography
              className="fs-18 fw-500 "
              style={{ margin: "32px 10px 22px auto" }}
            >
              فیلترها
            </Typography>
          </Button>
          <Collapse
            in={collapseFilterOpen}
            timeout="auto"
            unmountOnExit
            className="w-100"
          >
            <div className="row w-100 g-2">
              <TextField
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="عنوان"
                className="col-12 input-border"
                classes={{ root: "text-center" }}
                variant="outlined"
              />
              <DatePicker
                value={fromDate}
                onChange={(date) => setFromDate(date)}
                wrapperClassName="col-6"
                className="text-center"
                placeholder="تاریخ از"
                required={false}
              />

              <DatePicker
                value={toDate}
                onChange={(date) => setToDate(date)}
                wrapperClassName="col-6"
                className="text-center"
                placeholder="تاریخ تا"
              />
              <div className="col-12 justify-content-center d-flex">
                <Button
                  variant="contained"
                  className="w-100"
                  onClick={() => handleFilterChange()}
                >
                  <FilterIcon />
                  اعمال فیلتر
                </Button>
              </div>
            </div>
          </Collapse>
        </div>
      </CategoryFilters>
    </Suspense>
  );
};
export default NewsFilter;
