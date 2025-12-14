"use client";

import React from "react";
import Image from "next/image";
import notFound from "../app/img/404.png";
import Link from "next/link";
import { Button, Typography } from "@mui/material";

interface NotFoundProps {
  message?: string;
}

export default function NotFound({ message }: NotFoundProps) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "42px",
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <Image  src={notFound} alt="not found" width={200}  />
      <div>
        <Typography
          style={{ color: "#212121", fontSize: "34px", fontWeight: 500 }}
        >
          {message || "!متاسفانه صفحه مورد نظر یافت نشد"}
        </Typography>
        <Typography
          variant="body1"
          style={{
            color: "#424242",
            fontSize: "20px",
            fontWeight: 400,
            marginTop: "24px",
          }}
        >
          لطفا املای خود را بررسی کنید، چیزی را جستجو کنید یا به صفحه اصلی بروید
        </Typography>
      </div>
      <Link href="/">
        <Button
          variant="contained"
          size="small"
          style={{ height: "52px", borderRadius: "8px", width: "360px" }}
        >
          بازگشت به صفحه نخست
        </Button>
      </Link>
    </div>
  );
}
