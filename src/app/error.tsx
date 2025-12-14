"use client"; // Error components must be Client Components

import React, { useEffect } from "react";
import Link from "next/link";
import { Button, Typography } from "@mui/material";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

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
        marginTop: "280px",
      }}
    >
      <div>
        <Typography
          style={{ color: "#212121", fontSize: "34px", fontWeight: 500 }}
        >
          !متاسفانه خطایی رخ داده‌است{" "}
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
          چیزی را جستجو کنید یا به صفحه اصلی بروید
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
