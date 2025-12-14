"use client";

import { Divider, List, ListItem, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { COMPANY } from "@/lib/internal-urls";
import TheAvatar from "@/Components/common/the-avatar";

interface TableItemProps {
  to: string;
  companyName: string;
  companyUserName: string;
  companyLogo: string | null;
  description: string;
  verified: boolean | null;
  id: string;
}

export default function TableItem({
  to,
  id,
  companyName,
  companyUserName,
  companyLogo,
  description,
  verified,
}: TableItemProps) {
  const handleClick = async () => {
    try {
      await saveEntityClick(id, EntityTypeEnum.Company);
    } catch {
      console.error("Error in Submitting company visit");
    }
  };

  return (
    <List dir="rtl">
      <ListItem disablePadding>
        <Link
          className="row px-0 mx-0 w-100"
          href={COMPANY(to)}
          onClick={handleClick}
        >
          <div className="col-2">
            <TheAvatar
              isVerified={verified}
              src={companyLogo}
              name={companyName}
              width={50}
              height={50}
            />
          </div>
          <div className="row mx-0 px-0 col-10">
            <div className="col-12 d-flex justify-content-between">
              <Typography variant="h6" color="#212121">
                {companyName}
              </Typography>
            </div>
            {companyUserName && (
              <Typography variant="body2" className="col-12 mt-1 text-end ltr">
                @{companyUserName}
              </Typography>
            )}
          </div>
          {description && (
            <>
              <div className="col-2"></div>
              <Typography variant="caption" className="col-10 truncate-text">
                {description}
              </Typography>
            </>
          )}
        </Link>
        <Divider />
      </ListItem>
    </List>
  );
}
