import { List, ListItem, ListItemButton, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";
import { LiaArrowLeftSolid } from "react-icons/lia";
import CompanyStatus from "@/Components/common/company-status";

interface IndividualCardProps {
  id: number;
  name: string;
  profileLink: string;
  productTitle: string;
  productEngTitle: string;
  amount?: number;
  price?: number;
  priceUnit?: string;
  amountUnit: string;
  isVerified: boolean;
  isSafe: boolean;
  subscriptionAvatar: string;
  expirationRemained?: string;
  type: "sell" | "buy";
  onClose?: () => void;
}

export default function IndividualCard({
  id,
  profileLink,
  name,
  productTitle,
  productEngTitle,
  amount,
  price,
  priceUnit,
  amountUnit,
  isVerified,
  isSafe,
  subscriptionAvatar,
  expirationRemained,
  type,
  onClose,
}: IndividualCardProps) {
  return (
    <nav>
      <List className="py-0">
        <ListItem
          disablePadding
          className={`px-4 py-2 BorderBottom ${
            type === "buy" ? "buyAdvertisement" : "sellAdvertisement"
          }`}
        >
          <ListItemButton
            className="row px-0 mx-0  my-1 bg-transparent"
            LinkComponent={Link}
            href={type === "buy" ? `/inquiries/${id}` : `/advertise/${id}`}
            onClick={onClose}
          >
            <div className="d-flex px-0 justify-content-between w-100 align-content-center ">
              <div className="col-4 d-flex gap-2  ">
                <Typography className="greyColor fs-13 fw-500 text-end">
                  {productTitle}
                </Typography>
                {productEngTitle && (
                  <Typography className=" greyColor fs-13 fw-500 text-end">
                    ({productEngTitle})
                  </Typography>
                )}
              </div>
              <div className="col-2 d-flex gap-2">
                <Typography
                  variant="body1"
                  className="col-12"
                  component={Link}
                  href={profileLink}
                >
                  {name}
                </Typography>
                <CompanyStatus
                  verified={isVerified}
                  subscriptionAvatar={subscriptionAvatar}
                  isSafe={isSafe}
                />
              </div>
              {type === "sell" ? (
                <div className="col-4">
                  {price ? (
                    <div className="d-flex gap-2 justify-content-end  ">
                      <Typography variant="body2">{`1 ${amountUnit}`}</Typography>
                      <Typography variant="body1">{`${price} ${priceUnit}`}</Typography>
                    </div>
                  ) : (
                    <Typography variant="body2" className="col-12">
                      تماس بگیرید
                    </Typography>
                  )}
                </div>
              ) : (
                <div className="col-4">
                  {amount ? (
                    <div className="d-flex gap-2 justify-content-end  ">
                      {expirationRemained && (
                        <Typography variant="body2">
                          {expirationRemained}
                        </Typography>
                      )}
                      <Typography variant="body1">{`${amount} ${amountUnit}`}</Typography>
                    </div>
                  ) : (
                    <Typography variant="body2" className="col-12">
                      تماس بگیرید
                    </Typography>
                  )}
                </div>
              )}
              <div className="col  ">
                <LiaArrowLeftSolid size={24} className="black " />
              </div>
            </div>
          </ListItemButton>
        </ListItem>
      </List>
    </nav>
  );
}
