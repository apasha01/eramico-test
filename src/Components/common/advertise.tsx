"use client";

import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Link from "next/link";
import { axiosInstance } from "@/Helpers/axiosInstance";
import CompanyStatus from "./company-status";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";

interface AdvertiseProps {
  id: string | Number;
  to: string;
  productFaTitle?: string;
  productEnTitle?: string;
  userName?: string;
  price?: number;
  verified?: boolean;
  subscriptionAvatar?: string | null;
  priceUnit?: string | null;
  isSafe?: boolean;
  amountUnit?: string | null;
  showUsername?: boolean;
  showProduct?: boolean;
}

const Advertise = ({
  to,
  id,
  userName,
  productFaTitle,
  productEnTitle,
  price,
  priceUnit = "",
  amountUnit = "",
  subscriptionAvatar,
  verified,
  isSafe,
  showUsername,
  showProduct,
}: AdvertiseProps) => {
  const handleClick = async () => {
    try {
      await saveEntityClick(id, EntityTypeEnum.Advertise);
    } catch {
      console.error("Error in Submitting visit");
    }
  };

  return (
    <nav>
      <div className="sellAdvertisement px-3 py-2" dir="rtl">
        <Link
          className="d-flex align-items-center justify-content-between px-0 mx-0 col-12"
          href={to}
          onClick={handleClick}
        >
          {showProduct && (productFaTitle || productEnTitle) && (
            <div className="text-end mx-0 px-0 col-2">
              <Tooltip title={productFaTitle || ""}>
                <Typography
                  variant="body1"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {productFaTitle}
                </Typography>
              </Tooltip>
              {productEnTitle && (
                <Tooltip title={productEnTitle}>
                  <Typography
                    variant="body2"
                    dir="ltr"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      mt: 1,
                    }}
                  >
                    {productEnTitle}
                  </Typography>
                </Tooltip>
              )}
            </div>
          )}
          {showUsername && userName && (
            <div className="px-0 text-end col-3 d-flex align-items-center gap-2">
              <Tooltip title={userName}>
                <Typography
                  variant="body1"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userName}
                </Typography>
              </Tooltip>
              <CompanyStatus
                verified={verified}
                subscriptionAvatar={subscriptionAvatar}
                isSafe={isSafe}
              />
            </div>
          )}
          <div className="align-self-center col-auto d-flex flex-column gap-2">
            {amountUnit && (
              <span style={{ color: "#616161" }}>1 {amountUnit}</span>
            )}
            {price ? (
              <Typography variant="body1">
                <span>
                  {price?.toLocaleString()} {priceUnit}
                </span>
              </Typography>
            ) : (
              <Typography variant="body2" className="mt-2">
                تماس بگیرید
              </Typography>
            )}
          </div>

          <IconButton className="advertisementButton">
            <NavigateBeforeIcon />
          </IconButton>
          {/* <Button variant="outlined" size="medium" style={{
            width:"auto",
            paddingLeft:4,
            paddingRight:4
          }}>مشاهده آگهی</Button> */}
        </Link>
      </div>
    </nav>
  );
};

export default Advertise;
