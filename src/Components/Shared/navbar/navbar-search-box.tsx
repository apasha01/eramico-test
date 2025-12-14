"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TbMailOpened, TbSpeakerphone } from "react-icons/tb";
import { FaRegBuilding, FaRegUser } from "react-icons/fa";
import { PiArticleBold } from "react-icons/pi";
import { LiaArrowLeftSolid } from "react-icons/lia";

import ArticleList from "./searchCompoenets/articleList";
import Advertise from "./searchCompoenets/advertise";
import InquiresList from "./searchCompoenets/InquiresList";
import CompanyList from "./searchCompoenets/companiesList";
import AllItem from "./searchCompoenets/AllItem";
import UserList from "./searchCompoenets/userList";

import LoaderComponent from "@/Components/LoaderComponent";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { HOME_MEGA_SEARCH } from "@/lib/urls";

interface MegaSearch_res extends IAPIResult<any> {}

export default function NavbarSearchBox() {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = useState(1);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      mountedRef.current = false;
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const fetchMegaSearch = async (text: string) => {
    if (!mountedRef.current) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    try {
      const res = await axiosInstance.get<MegaSearch_res>(
        `${HOME_MEGA_SEARCH}${encodeURIComponent(text)}`,
        { signal: controller.signal }
      );

      if (!mountedRef.current) return;

      if (res?.data?.success) {
        setResponse(res.data.data);
      } else {
        setResponse([]);
      }
    } catch (e: any) {
      if (!mountedRef.current) return;
      if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
      console.error("Error fetching Category:", e);
      setResponse([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const runDebouncedSearch = (text: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const term = text.trim();
      if (!term) {
        if (abortRef.current) abortRef.current.abort();
        setResponse([]);
        setLoading(false);
        return;
      }
      fetchMegaSearch(term);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const txt = e.target.value;
    setSearchValue(txt);
    setOpen(true);
    runDebouncedSearch(txt);
  };

  const handleClear = () => {
    setSearchValue("");
    setOpen(false);
    setShowAll(false);
    setValue(1);
    setResponse([]);
    setLoading(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
  };

  const handleClosePanel = () => {
    setOpen(false);
  };

  return (
    <div className="hideInMobileScreen" dir="rtl">
      <TextField
        name="search"
        className="fs-16 fw-500 radius-100 customStyleTextField"
        style={{ width: "460px" }}
        autoComplete="off"
        InputProps={{
          style: {
            height: "42px",
            padding: "0 12px",
            fontSize: "12px",
            width: "100%",
            background: "#F5F5F5",
            borderRadius: "16px",
          },
          endAdornment: (
            <InputAdornment position="start" className="mx-1 px-0 text-center">
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
                className="lucide lucide-search-icon lucide-search"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </InputAdornment>
          ),
          startAdornment: searchValue ? (
            <InputAdornment
              position="end"
              className="mx-1 px-0 text-center"
              onClick={handleClear}
              style={{ cursor: "pointer" }}
            >
              <ClearIcon style={{ fontSize: "18px", marginLeft: "5px" }} />
            </InputAdornment>
          ) : null,
        }}
        value={searchValue}
        placeholder="جستجو..."
        onChange={handleInputChange}
      />

      {open ? (
        <div className="mainSearch" ref={wrapperRef}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            TabIndicatorProps={{
              style: {
                backgroundColor: "#fb8c00",
                height: "2px",
                width: value === 0 ? "50px" : "74px",
                marginRight: "18px",
              },
            }}
            sx={{ paddingRight: 1, height: 65 }}
          >
            {showAll ? (
              <Tab
                value={0}
                label="همه"
                style={{ color: value === 0 ? "#fb8c00" : "inherit" }}
              />
            ) : null}

            <Tab
              value={1}
              icon={<TbSpeakerphone size={20} className="mx-1" />}
              iconPosition="start"
              label="آگهی‌ها"
              style={{ color: value === 1 ? "#fb8c00" : "inherit" }}
            />

            <Tab
              value={2}
              icon={<TbMailOpened size={20} className="mx-1" />}
              iconPosition="start"
              label="استعلام‌ها"
              style={{ color: value === 2 ? "#fb8c00" : "inherit" }}
            />

            <Tab
              value={3}
              icon={<FaRegBuilding size={20} className="mx-1" />}
              iconPosition="start"
              label="شرکت‌ها"
              style={{ color: value === 3 ? "#fb8c00" : "inherit" }}
            />

            <Tab
              value={4}
              icon={<PiArticleBold size={20} className="mx-1" />}
              iconPosition="start"
              label="اخبار و مقالات"
              style={{ color: value === 4 ? "#fb8c00" : "inherit" }}
            />

            <Tab
              value={5}
              icon={<FaRegUser size={20} className="mx-1" />}
              iconPosition="start"
              label="کاربران"
              style={{ color: value === 5 ? "#fb8c00" : "inherit" }}
            />
          </Tabs>

          <Box
            sx={{
              borderTop: 1,
              borderColor: "divider",
              height: "100%",
              maxHeight: "330px",
              minHeight: "330px",
              overflowY: "auto",
            }}
          >
            {loading ? (
              <div className="w-100 pt-5">
                <LoaderComponent />
              </div>
            ) : (
              <>
                {value === 0 && (
                  <AllItem response={response} onClose={handleClosePanel} />
                )}
                {value === 1 && (
                  <Advertise
                    advertise={response?.advertise ?? []}
                    onClose={handleClosePanel}
                  />
                )}
                {value === 2 && (
                  <InquiresList
                    inquires={response?.inquiry ?? []}
                    onClose={handleClosePanel}
                  />
                )}
                {value === 3 && (
                  <CompanyList
                    Company={response?.company ?? []}
                    onClose={handleClosePanel}
                  />
                )}
                {value === 4 && (
                  <ArticleList
                    articles={response?.content ?? []}
                    onClose={handleClosePanel}
                  />
                )}
                {value === 5 && (
                  <UserList user={response?.user ?? []} onClose={handleClosePanel} />
                )}
              </>
            )}
          </Box>

          {!showAll ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                paddingInline: "24px",
              }}
            >
              <Button
                endIcon={<LiaArrowLeftSolid className="mx-3 " />}
                style={{
                  borderRadius: "100px",
                  border: " none",
                  padding: "10px 24px",
                  minWidth: "100%",
                  margin: "12px auto",
                  backgroundColor: "#FAF5ED",
                  color: "#FB8C00",
                }}
                onClick={() => {
                  setShowAll(true);
                  setValue(0);
                  handleClosePanel();
                }}
                disabled={loading}
              >
                جستجو بین تمام موارد
              </Button>
            </div>
          ) : (
            <div style={{ height: "60px" }} />
          )}
        </div>
      ) : null}
    </div>
  );
}
