"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";

const Verify = ({
  s,
  code,
  msg,
}: {
  s?: string;
  code?: string;
  msg?: string;
}) => {
  const router = useRouter();
  const isSuccess = s?.toLowerCase() === "ok";

  const accentColor = "#ff9800"; // رنگ نارنجی اصلی تم

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      dir="rtl"
      bgcolor={isSuccess ? "#fff8f0" : "#fff5f5"}
    >
      <Card
        sx={{
          width: 420,
          borderRadius: 4,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          textAlign: "center",
          p: 4,
          border: `2px solid ${isSuccess ? accentColor : "#e53935"}`,
          transition: "all 0.3s ease",
        }}
      >
        <CardContent>
          <Stack spacing={3} alignItems="center">
            {/* آیکن وضعیت */}
            <Avatar
              sx={{
                bgcolor: isSuccess ? accentColor : "#f44336",
                width: 80,
                height: 80,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {isSuccess ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-check-icon lucide-circle-check"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-x-icon lucide-circle-x"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
              )}
            </Avatar>

            {/* تیتر اصلی */}
            <Typography
              variant="h5"
              fontWeight={700}
              color={isSuccess ? accentColor : "error.main"}
            >
              {isSuccess ? "تأیید شد" : "عدم تأیید"}
            </Typography>

            {/* توضیحات وضعیت */}
            <Box width="100%" mt={1} mb={2}>
              <Stack spacing={1.5}>
                <Typography variant="body1">
                  <strong>وضعیت:</strong> {isSuccess ? "تایید" : "عدم تایید"}
                </Typography>
                <Typography variant="body1">
                  <strong>کد:</strong> {code || "—"}
                </Typography>
                <Typography variant="body1">
                  <strong>پیام:</strong> {msg || "—"}
                </Typography>
              </Stack>
            </Box>

            {/* دکمه */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 2,
                py: 1.3,
                fontWeight: 600,
                backgroundColor: isSuccess ? accentColor : "#e53935",
                "&:hover": {
                  backgroundColor: isSuccess ? "#fb8c00" : "#c62828",
                },
              }}
              onClick={() =>
                router.push("/my-profile/dashboard/subscription-history")
              }
            >
              رفتن به داشبورد
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Verify;
