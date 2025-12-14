"use client";

import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Link from "next/link";
import VerifiedIcon from "@mui/icons-material/Verified";
import Image from "next/image";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import CompanyStatus from "@/Components/common/company-status";

interface IndividualBuyAdvertisementProps {
  id: string | Number;
  to: string;
  faTitle: string;
  enTitle: string;
  name?: string;
  Amount?: number;
  Price?: number;
  verified?: boolean;
  subscriptionAvatar?: string | null;
  expirationRemained?: string;
  advertismentType: string;
  priceUnit?: string | null;
  amountUnit?: string | null;
  isSafe?: boolean | null;
}

export default function IndividualBuyAdvertisement({
  id,
  to,
  faTitle,
  enTitle,
  name,
  Amount,
  Price,
  verified,
  subscriptionAvatar,
  expirationRemained,
  advertismentType,
  priceUnit = "",
  amountUnit = "",
  isSafe,
}: IndividualBuyAdvertisementProps) {
  const handleClick = async () => {
    await saveEntityClick(id, EntityTypeEnum.Advertise);
  };

  return (
    <nav>
      <List>
        <ListItem
          disablePadding
          className={`${
            advertismentType === "inquiry"
              ? "buyAdvertisement"
              : advertismentType === "special-offer"
              ? "specialAdvertisement"
              : "sellAdvertisement"
          }`}
        >
          <ListItemButton
            className="row px-0 mx-0 bg-transparent"
            LinkComponent={Link}
            href={to}
            onClick={handleClick}
          >
            <div className="row mx-0 rtl py-1">
              <div className="col-4 text-end mx-0 px-0 ">
                <Typography variant="body1" className="col-12 text-end">
                  {faTitle}
                </Typography>
                {enTitle && (
                  <Typography variant="body2" className="col-12 mt-2 text-end">
                    ({enTitle})
                  </Typography>
                )}
              </div>
              <div className="col-4 px-0 text-end">
                {name && (
                  <Typography variant="body1" className="col-12">
                    {name}
                  </Typography>
                )}
                <CompanyStatus
                  verified={verified}
                  isSafe={isSafe || false}
                  subscriptionAvatar={subscriptionAvatar}
                />
              </div>
              <div className="col-3 text-center align-self-center">
                <>
                  {advertismentType === "advertise" ||
                  advertismentType === "special-offer" ? (
                    Price ? (
                      <Typography
                        variant="body1"
                        className="col-12 mt-2 d-flex flex-column"
                      >
                        {amountUnit && <span>1 {amountUnit}</span>}
                        <span>
                          {Price?.toLocaleString()} {priceUnit}
                        </span>
                      </Typography>
                    ) : (
                      <Typography variant="body2" className="col-12 mt-2">
                        تماس بگیرید
                      </Typography>
                    )
                  ) : null}
                  {advertismentType === "inquiry" ? (
                    Amount ? (
                      <Typography
                        variant="body1"
                        className="col-12 mt-2 d-flex flex-column"
                      >
                        <span>
                          {Amount?.toLocaleString()} {amountUnit}
                        </span>
                        <span>{expirationRemained}</span>
                      </Typography>
                    ) : (
                      <Typography variant="body2" className="col-12 mt-2">
                        تماس بگیرید
                      </Typography>
                    )
                  ) : null}
                </>
              </div>
              <div className="col-1 align-self-center text-center px-1">
                <IconButton className="advertisementButton">
                  <NavigateBeforeIcon />
                </IconButton>
              </div>
            </div>
          </ListItemButton>
        </ListItem>
      </List>
    </nav>
  );
}
