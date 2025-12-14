"use client";

import { Typography } from "@mui/material";
import React from "react";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import Link from "next/link";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { PRODUCT } from "@/lib/internal-urls";

interface TableItemProps {
  id: number;
  title: string;
  price: string;
  persent: string;
  priceUnitTitle: string | null;
}

export default function TableItem({
  id,
  title,
  price,
  persent,
  priceUnitTitle,
}: TableItemProps) {
  const handleClick = async () => {
    try {
      await saveEntityClick(id, EntityTypeEnum.Product);
    } catch {
      console.error("Error in Submitting company visit");
    }
  };

  return (
    <div className="row px-0 col-6">
      <Link href={PRODUCT(id.toString(), title)} onClick={handleClick}>
        <Typography variant="body2" className="col-12 text-end">
          {title}
        </Typography>
      </Link>
      <Typography variant="body1" className="col-12 d-flex gap-1 mt-2">
        {Number(price).toLocaleString()} {priceUnitTitle ? priceUnitTitle : ""}
        <span
          className={`me-1 ${Number(persent) > 0 ? "green" : "red"}`}
          dir="ltr"
        >
          {Number(persent) > 0 ? (
            <NorthIcon sx={{ fontSize: "14px" }} />
          ) : (
            <SouthIcon sx={{ fontSize: "14px" }} />
          )}
          {persent}
        </span>
      </Typography>
    </div>
  );
}
