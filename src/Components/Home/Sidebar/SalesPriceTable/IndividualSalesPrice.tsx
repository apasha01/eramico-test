import React from "react";
import { Divider, IconButton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Link from "next/link";

export default function IndividualSalesPrice(props: {
  to: string;
  title: string;
  usage?: string;
  price: number;
  date: string;
  diffrence: string;
}) {
  return (
    <Link
      className="row mx-0 col-12 my-3 rtl"
      href={"/salePrice/sale?id=" + props.to}
    >
      <div className="col-11 px-0">
        <div className="row mx-0 col-12">
          <div className="col-6 px-0 fw-bold fs-15">{props.title}</div>
          <div className="col-6 fw-bold fs-15">
            {props.price.toLocaleString()} <span className="fs-13">ریال</span>
          </div>
        </div>
        <div className="row mx-0 col-12 mt-2">
          <div className="col-6 fs-10 text-grey">{props.usage}</div>
          <div className="col-6 fs-10 text-grey">{props.date}</div>
        </div>
      </div>
      <div className="col-1">
        <IconButton>
          <NavigateBeforeIcon />
        </IconButton>
      </div>
      <Divider />
    </Link>
  );
}
