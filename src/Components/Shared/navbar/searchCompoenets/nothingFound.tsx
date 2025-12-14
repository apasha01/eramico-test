import Typography from "@mui/material/Typography";
import React from "react";

export default function nothingFound() {
  return (
    <div
      className="container mx-4 mt-4  rounded-4 p-4 AdvertisementBG sellAdvertisement"
      style={{
        minHeight: "150px",
        width: "95%",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Typography className="fs-24 fw-500">نتیجه‌ای یافت نشد</Typography>
    </div>
  );
}
