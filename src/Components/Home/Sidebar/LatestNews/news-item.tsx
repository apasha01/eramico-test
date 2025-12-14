"use client";

import { Typography, Box } from "@mui/material";
import React from "react";
import Link from "next/link";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { saveEntityClick } from "@/Helpers/Utilities";
import TheAvatar from "@/Components/common/the-avatar";

interface NewsItemProps {
  to: string;
  title: string;
  image?: string | null;
  description: string;
  id: string;
  date?: string;
}

export default function NewsItem({
  to,
  id,
  title,
  image,
  description,
  date,
}: NewsItemProps) {
  const handleClick = async () => {
    try {
      await saveEntityClick(id, EntityTypeEnum.Content);
    } catch {
      console.error("Error in Submitting entity visit");
    }
  };

  return (
    <Link
      dir="rtl"
      href={to}
      onClick={handleClick}
      className="text-decoration-none"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          // border: "1px solid #f1f1f1",
          borderRadius: "12px",
          // border:"1px solid black",
          overflow: "hidden",
          // backgroundColor: "#fff",
          transition: "all 0.2s ease",
          cursor: "pointer",
          padding: "10px",
          // "&:hover": { boxShadow: "0 4px 10px rgba(0,0,0,0.08)" },
        }}
      >
        {/* تصویر سمت راست */}
        <TheAvatar
          name={title}
          src={image || ''}
          isVerified={false}
          isSafe={false}
          subscriptionAvatar={""}
          variant="square"
          width={50}
          height={50}
        />

        {/* محتوای سمت چپ */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <Typography
            variant="subtitle1"
            color="#212121"
            sx={{ fontWeight: 600, mb: 0.5 }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              mb: 1,
            }}
          >
            {description}
          </Typography>

          {date && (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontSize: "0.75rem" }}
            >
              {date}
            </Typography>
          )}
        </Box>
      </Box>
    </Link>
  );
}
