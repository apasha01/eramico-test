"use client";

import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Link from "next/link";
import CompanyStatus from "./company-status";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";

interface InquiryProps {
  id: string | Number;
  to: string;
  productFaTitle?: string;
  productEnTitle?: string;
  userName?: string;
  amount?: number;
  amountUnit?: string | null;
  expirationRemained: string;
  verified?: boolean;
  subscriptionAvatar?: string | null;
  isSafe?: boolean;
  showUsername?: boolean;
  showProduct?: boolean;
}

const Inquiry = ({
  to,
  id,
  userName,
  productFaTitle,
  productEnTitle,
  amount,
  amountUnit = "",
  expirationRemained,
  subscriptionAvatar,
  verified,
  isSafe,
  showUsername,
  showProduct,
}: InquiryProps) => {
  const productWidth = showUsername ? "col-2" : "col-4";
  const usernameWidth = showProduct ? "col-2" : "col-4";
  const priceWidth =
    (showProduct && !showUsername) || (!showProduct && showUsername)
      ? "col-2"
      : "col-2";

  const handleClick = async () => {
    try {
      await saveEntityClick(id, EntityTypeEnum.Advertise);
    } catch {
      console.error("Error in Submitting visit");
    }
  };

  return (
    <nav>
      <div className="buyAdvertisement px-3 py-2" dir="rtl">
        <Link
          className="d-flex align-items-center justify-content-between px-0 mx-0 col-12"
          href={to}
          onClick={handleClick}
        >
          {showProduct && (productFaTitle || productEnTitle) && (
            <div className={`text-end mx-0 px-0 ${productWidth}`}>
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
            <div className={`px-0 text-end ${usernameWidth}`}>
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
          <div className={`text-center align-self-center ${priceWidth}`}>
            {amount ? (
              <Typography
                variant="body1"
                className="col-12 mt-2 d-flex flex-column"
              >
                {expirationRemained && (
                  <span className="mb-2" style={{ color: "#616161" }}>
                    {expirationRemained}
                  </span>
                )}
                <span>
                  {amount?.toLocaleString()} {amountUnit || ""}
                </span>
              </Typography>
            ) : (
              <Typography variant="body2" className="col-12 mt-2">
                تماس بگیرید
              </Typography>
            )}
          </div>
          <IconButton className="advertisementButton">
            <NavigateBeforeIcon />
          </IconButton>
          {/* 
                    <Button variant="outlined" sx={{
                      borderColor:"orange",
                      color:"orange",
                      ":hover":{
                        color:"orange",
                        borderColor:"orange"
                      }
                    }}>مشاهده استعلام</Button> */}
        </Link>
      </div>
    </nav>
  );
};

export default Inquiry;
