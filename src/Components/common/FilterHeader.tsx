"use client";

import { Button, Typography } from "@mui/material";
import React from "react";
import BackButton from "./back-button";

interface FilterHeaderProps {
  clearFilters: () => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ clearFilters }) => {
  return (
    <div className="filterHeaderStyle">
      <div className="filterHeaderTitleBoxStyle">
        <div className="filterHeaderBackRowStyle">
          <BackButton />
          <div>
            <Typography sx={{ fontSize: "18px", fontWeight: 500 }}>
              فیلتر
            </Typography>
          </div>
          <div>
            <Button
              sx={{ fontSize: "14px", fontWeight: 500, color: "#D32F2F" }}
              onClick={clearFilters}
            >
              حذف فیلتر ها
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterHeader;
