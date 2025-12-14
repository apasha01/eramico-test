"use client";

import React from "react";
import { Box, Pagination as PaginationComponent } from "@mui/material";
import { useRouter } from "next/navigation";
import { ReadonlyURLSearchParams } from "next/navigation";
import { PAGE_SIZE } from "@/lib/constants";

interface PaginationProps {
  count?: number;
  currentPage: number;
  url: string;
  searchParams: ReadonlyURLSearchParams | Record<string, string | string[]>;
}

export default function Pagination({
  currentPage,
  count,
  url,
  searchParams,
}: PaginationProps) {
  const router = useRouter();
  const pageCount = Math.ceil(Number(count) / PAGE_SIZE);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const current = new URLSearchParams();

    // Convert searchParams to URLSearchParams
    if (searchParams instanceof URLSearchParams) {
      Array.from(searchParams.entries()).forEach(([key, val]) => {
        current.set(key, val);
      });
    } else {
      Object.entries(searchParams).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          current.set(key, val[0]);
        } else {
          current.set(key, val);
        }
      });
    }

    // Set the page value
    current.set("page", value.toString());

    // Construct updated search string
    const currentUrl = current.toString();
    router.push(`${url}?${currentUrl}`);
  };
  return (
    <Box
      className="d-flex justify-content-center align-items-center overflow-hidden w-100 flex-column my-5"
      sx={{
        marginBottom: 10,
      }}
    >
      {pageCount > 1 && (
        <PaginationComponent
          className="mypagination"
          color="secondary"
          dir="rtl"
          count={pageCount}
          onChange={handleChange}
          page={currentPage}
          siblingCount={2}
          boundaryCount={1}
        />
      )}
    </Box>
  );
}
