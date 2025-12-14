import { Button, Divider } from "@mui/material";
import React from "react";
import IndividualSalesPrice from "./IndividualSalesPrice";

export default function SalesPriceTable() {
  return (
    <React.Fragment>
      <section className="row p-3 ">
        <div className="container AdvertisementBG rounded-5 p-3">
          <h6 className="col-12 rtl mt-1 d-flex gap-2 align-items-center justify-content-between">
            <span className="d-flex gap-2">جدول قیمت فروش</span>
          </h6>
          <IndividualSalesPrice
            to="1"
            title="بازار جهانی"
            usage="تزریقی"
            diffrence="-2.13"
            price={33000000}
            date="3 روز پیش"
          />
          <Divider />
          <IndividualSalesPrice
            to="1"
            title="بورس کالای ایران"
            diffrence="+2.13"
            price={33000000}
            date="3 روز پیش"
          />
        </div>
      </section>
    </React.Fragment>
  );
}
