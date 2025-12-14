"use client";

import React from "react";
import { Typography } from "@mui/material";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import Link from "next/link";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { PRODUCT } from "@/lib/internal-urls";

export default function LivePriceItem({
  title,
  itemId,
  price,
  percent,
  priceUnit,
  supplierCompany,
}: {
  title: string;
  itemId: string;
  price: string;
  percent: string;
  priceUnit: string;
  supplierCompany: string | null;
}) {
  const handleProductClick = async () => {
    try {
      await saveEntityClick(itemId, EntityTypeEnum.Product);
    } catch {
      console.error("Error in Submitting company visit");
    }
  };

  return (
    <div
      className="d-flex gap-2 align-self-center"
      key={itemId}
      style={{
        margin: "auto 16px",
        whiteSpace: "nowrap",
      }}
    >
      <Link
        href={PRODUCT(itemId.toString(), title)}
        className="text-decoration-none"
        onClick={handleProductClick}
      >
        <Typography className=" text-black" variant="button">
          {title}{" "}
        </Typography>
        {supplierCompany && (
          <Typography className=" text-black" variant="button">
            ({supplierCompany})
          </Typography>
        )}
      </Link>
      <Typography className=" text-black" variant="button">
        {Number(price).toLocaleString()} {priceUnit ? priceUnit : ""}
      </Typography>
      <Typography
        variant="button"
        className={Number(percent) > 0 ? "green" : "red"}
        dir="ltr"
      >
        {Number(percent) > 0 ? (
          <NorthIcon sx={{ fontSize: "16px" }} />
        ) : (
          <SouthIcon sx={{ fontSize: "16px" }} />
        )}
        {percent}
      </Typography>
    </div>
  );
}
