"use client";

import { Button, Collapse, Radio, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ConfirmBadge from "@/Components/Icons/ConfrimBadge";
import UserConfirmBadge from "@/Components/Icons/UserConfirmBadge";
import ProtectBadge from "@/Components/Icons/ProtectBadge";
import { useRouter } from "next/navigation";
import { ReadonlyURLSearchParams } from "next/navigation";
import { FaCheck } from "react-icons/fa6";
import { ImRadioUnchecked } from "react-icons/im";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface VerificationFiltersProps {
  url: string;
  title: string;
  searchParams: ReadonlyURLSearchParams | Record<string, string | string[]>;
  color?: string;
  children?: React.ReactNode;
  hideUser?: boolean; // Optional prop to hide user verification filters
  hideSafe?: boolean; // Optional prop to hide safe verification filters
  hideVerify?: boolean; // Optional prop to hide verify filters
}

const VerificationFilters = ({
  url,
  title,
  searchParams,
  color = "#FB8C00",
  hideUser = false,
  hideSafe = false,
  hideVerify = false,
  children = null,
}: VerificationFiltersProps) => {
  const router = useRouter();
  const [collapseOpen, setCollapseOpen] = useState(true);
  const [filter, setFilter] = useState({
    SelectedGroup: "",
    verify: false,
    safe: false,
    user: false,
  });

  useEffect(() => {
    if (searchParams) {
      const getParam = (name: string): string | null => {
        if (searchParams instanceof URLSearchParams) {
          return searchParams.get(name);
        } else {
          const value = searchParams[name];
          return Array.isArray(value) ? value[0] : value || null;
        }
      };

      const verifyValue = getParam("verify");
      if (verifyValue === "1") {
        setFilter((prevFilter) => ({
          ...prevFilter,
          verify: true,
        }));
      } else {
        setFilter((prevFilter) => ({
          ...prevFilter,
          verify: false,
        }));
      }
      const safeValue = getParam("safe");
      if (safeValue === "1") {
        setFilter((prevFilter) => ({
          ...prevFilter,
          safe: true,
        }));
      } else {
        setFilter((prevFilter) => ({
          ...prevFilter,
          safe: false,
        }));
      }
      const userVerified = getParam("user");
      if (userVerified === "1") {
        setFilter((prevFilter) => ({
          ...prevFilter,
          user: true,
        }));
      } else {
        setFilter((prevFilter) => ({
          ...prevFilter,
          user: false,
        }));
      }
    }
  }, [searchParams]);

  function safeHandler(check: boolean) {
    const current = new URLSearchParams();
    
    // Convert searchParams to URLSearchParams
    if (searchParams instanceof URLSearchParams) {
      Array.from(searchParams.entries()).forEach(([key, value]) => {
        current.set(key, value);
      });
    } else {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          current.set(key, value[0]);
        } else {
          current.set(key, value);
        }
      });
    }
    if (check === false) {
      current.delete("safe");
    } else {
      current.set("safe", "1");
    }
    current.delete("page");
    const currentUrl = current.toString();
    router.push(`${url}?${currentUrl}`);
    return;
  }

  function verifyHandler(check: boolean) {
    const current = new URLSearchParams();
    
    // Convert searchParams to URLSearchParams
    if (searchParams instanceof URLSearchParams) {
      Array.from(searchParams.entries()).forEach(([key, value]) => {
        current.set(key, value);
      });
    } else {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          current.set(key, value[0]);
        } else {
          current.set(key, value);
        }
      });
    }
    
    if (check === false) {
      current.delete("verify");
    } else {
      current.set("verify", "1");
    }
    current.delete("page");
    const currentUrl = current.toString();
    router.push(`${url}?${currentUrl}`);
    return;
  }

  function userVerifiedHandler(check: boolean) {
    const current = new URLSearchParams();
    
    // Convert searchParams to URLSearchParams
    if (searchParams instanceof URLSearchParams) {
      Array.from(searchParams.entries()).forEach(([key, value]) => {
        current.set(key, value);
      });
    } else {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          current.set(key, value[0]);
        } else {
          current.set(key, value);
        }
      });
    }
    
    if (check === false) {
      current.delete("user");
    } else {
      current.set("user", "1");
    }
    current.delete("page");
    const currentUrl = current.toString();
    router.push(`${url}?${currentUrl}`);
    return;
  }

  return (
    <div className="headerBackColStyle" style={{ gap: "5px" }}>
        {children}
        <Button
          onClick={() => setCollapseOpen(!collapseOpen)}
          style={{
            height: "52px",
          }}
          className="w-100 p-0 m-0 d-flex align-items-center fs-24"
          endIcon={
            collapseOpen ? (
              <ExpandLessIcon className="mt-2" />
            ) : (
              <ExpandMoreIcon className="mt-2" />
            )
          }
        >
          <Typography
            className="fs-18 fw-500 "
            style={{ margin: "32px 10px 22px auto" }}
          >
            {title}
          </Typography>
        </Button>
        <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
          {!hideUser && (
            <Button
              className={
                filter.user
                  ? "d-flex gap-3 justify-content-start  categoryBtnActive  rounded-5 col-12 rounded mt-3 pr-0"
                  : "d-flex gap-3 justify-content-start  categoryBtn rounded-5 col-12 rounded mt-3 pr-0"
              }
              style={{
                height: "48px",
                fontSize: "16px",
                fontWeight: "500",
                color: filter.user ? color : "",
              }}
              variant="text"
              startIcon={
                <div className="d-flex gap-1 align-items-center">
                  <Radio
                    checked={filter.user}
                    checkedIcon={
                      <FaCheck
                        size={21}
                        style={{
                          color: color,
                          borderRadius: "4px",
                          border: `1px solid ${color}`,
                        }}
                      />
                    }
                    style={{ color: "#E0E0E0" }}
                    icon={
                      <ImRadioUnchecked
                        size={20}
                        style={{
                          border: "1px solid #E0E0E0",
                        }}
                        className="text-white radius-4"
                      />
                    }
                  />
                  <UserConfirmBadge color={filter.user ? color : null} />
                </div>
              }
              onClick={() => userVerifiedHandler(!filter.user)}
            >
              کاربران تایید شده
            </Button>
          )}
          {!hideVerify && (
            <Button
              className={`d-flex gap-3 justify-content-start rounded-5 col-12 rounded pr-0 ${
                filter.verify ? "categoryBtnActive" : "categoryBtn"
              }`}
              style={{
                height: "48px",
                fontSize: "16px",
                fontWeight: "500",
                color: filter.verify ? color : "",
              }}
              variant="text"
              startIcon={
                <div className="d-flex gap-1 align-items-center">
                  <Radio
                    checked={filter.verify}
                    checkedIcon={
                      <FaCheck
                        size={21}
                        style={{
                          color: color,
                          borderRadius: "4px",
                          border: `1px solid ${color}`,
                        }}
                      />
                    }
                    style={{ color: "#E0E0E0" }}
                    icon={
                      <ImRadioUnchecked
                        size={20}
                        style={{
                          border: "1px solid #E0E0E0",
                          borderRadius: "4px",
                        }}
                        className="text-white"
                      />
                    }
                  />
                  <ConfirmBadge color={filter.verify ? color : null} />
                </div>
              }
              onClick={() => verifyHandler(!filter.verify)}
            >
              شرکت‌های تایید شده
            </Button>
          )}
          {!hideSafe && (
            <Button
              className={`d-flex gap-3 justify-content-start rounded-5 col-12 rounded pr-0 ${
                filter.safe ? "categoryBtnActive" : "categoryBtn"
              }`}
              style={{
                height: "48px",
                fontSize: "16px",
                fontWeight: "500",
                color: filter.safe ? color : "",
              }}
              variant="text"
              startIcon={
                <div className="d-flex gap-1 align-items-center">
                  <Radio
                    checked={filter.safe}
                    checkedIcon={
                      <FaCheck
                        size={21}
                        style={{
                          color: color,
                          borderRadius: "4px",
                          border: `1px solid ${color}`,
                        }}
                      />
                    }
                    style={{ color: "#E0E0E0" }}
                    icon={
                      <ImRadioUnchecked
                        size={20}
                        style={{
                          border: "1px solid #E0E0E0",
                          borderRadius: "4px",
                        }}
                        className="text-white"
                      />
                    }
                  />
                  <ProtectBadge color={filter.safe ? color : null} />
                </div>
              }
              onClick={() => safeHandler(!filter.safe)}
            >
              شرکت‌های دارای قرارداد امن
            </Button>
          )}
        </Collapse>
      </div>
  );
};

export default VerificationFilters;
