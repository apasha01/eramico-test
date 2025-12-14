"use client";

import { Button, Collapse, Typography, TextField } from "@mui/material";
import React, { useState, Suspense } from "react";
import { ReadonlyURLSearchParams, useRouter } from "next/navigation";
import LoaderComponent from "@/Components/LoaderComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FilterIcon from "@/Components/Icons/FilterIcon";

interface Props {
  searchParams: ReadonlyURLSearchParams | Record<string, string | string[]>;
  title?: string | null;
}

const CompanyFilter = ({ searchParams, title }: Props) => {
  const router = useRouter();

  const getParam = (name: string): string | null => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(name);
    } else {
      const value = searchParams[name];
      return Array.isArray(value) ? value[0] : value || null;
    }
  };

  const [collapseFilterOpen, setCollapseFilterOpen] = useState(true);
  const [titleInput, setTitleInput] = useState<string | null>(
    getParam("title") || ""
  );

  const handleFilterChange = () => {
    const current = new URLSearchParams();
    if (titleInput && titleInput.length > 0) current.set("title", titleInput);
    else current.delete("title");
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
    router.replace(`/companies?${current.toString()}`);
  };
  return (
    <Suspense fallback={<LoaderComponent />}>
      <div style={{ width: "100%" }} dir="rtl">
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
            className="fs-18 fw-500"
            style={{ margin: "32px 10px 22px auto" }}
          >
            {title || "فیلترها"}
          </Typography>
        </Button>

        {/* 🎚 فیلترها */}
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
              variant="outlined"
              onKeyUp={(e) => e.key === "Enter" && handleFilterChange()}
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
    </Suspense>
  );
};

export default CompanyFilter;
