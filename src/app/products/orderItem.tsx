"use client";

import { useEffect, useRef, useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const searchValue = urlSearchParams.get("search");
    setSearchTerm(searchValue || "");
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const runSearch = (term: string) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() ?? []));

    const trimmed = term.trim();
    if (trimmed) current.set("search", trimmed);
    else current.delete("search");

    const url = current.toString();
    router.push(url ? `/products?${url}` : "/products");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      runSearch(value);
    }, 500);
  };

  return (
    <div className="w-100">
      <TextField
        name="search"
        value={searchTerm}
        onChange={handleSearchChange}
        className="col-12 w-full fs-16 fw-500 mt-2 border rounded-4 customStyleTextField"
        placeholder="نام کالای مورد نظر را جستجو کنید"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CiSearch size={22} />
            </InputAdornment>
          ),
          style: {
            textAlignLast: "right",
          },
        }}
        fullWidth
      />
    </div>
  );
}
