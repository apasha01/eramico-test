import React from "react";
import { Typography } from "@mui/material";
import { TbWorld } from "react-icons/tb";
import { LuPhone } from "react-icons/lu";
import { HiOutlineLocationMarker } from "react-icons/hi";

interface AboutCompanyProps {
  shortIntroduction: string;
  webpage: string | null;
  telephone: string | null;
  address: string | null;
}

export default function AboutCompany({
  shortIntroduction,
  webpage,
  telephone,
  address,
}: AboutCompanyProps) {
  return (
    <div className="mainStyle">
      <div className="col BorderBottom w-100 p-4">
        <div>
        <Typography className="fs-19 fw-500">درباره</Typography>

        </div>
        <Typography
          className="fs-14 fw-500 mt-3 text-justify"
          style={{ textJustify: "inter-word" }}
        >
          {shortIntroduction}
        </Typography>
        <div className="d-flex gap-4 mt-3">
          {webpage && (
            <Typography className="fs-13 fw-500 mb-3">
              <TbWorld size={20} style={{ marginLeft: "8px" }} />
              {webpage}
            </Typography>
          )}
          {telephone && (
            <Typography className="fs-13 fw-500 mb-3">
              <LuPhone size={17} style={{ marginLeft: "8px" }} />
              {telephone}
            </Typography>
          )}
        </div>
        <div className="mb-4">
          <Typography className="fs-13 fw-500">
            <HiOutlineLocationMarker size={20} style={{ marginLeft: "8px" }} />
            {address}
          </Typography>
        </div>
      </div>
    </div>
  );
}
