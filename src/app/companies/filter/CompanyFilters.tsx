"use client";

import React, { useState, useEffect } from "react";
import { Button, Radio, Collapse } from "@mui/material";
import { ReadonlyURLSearchParams, useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa6";
import { ImRadioUnchecked } from "react-icons/im";
import ConfirmBadge from "@/Components/Icons/ConfrimBadge";
import ProtectBadge from "@/Components/Icons/ProtectBadge";

interface CompanyFiltersProps {
  isVerified: boolean;
  isSafe: boolean;
  onVerifyChange: (value: boolean) => void;
  onSafeChange: (value: boolean) => void;
  searchParams: ReadonlyURLSearchParams;
}

const CompanyFilters: React.FC<CompanyFiltersProps> = ({
  isVerified,
  isSafe,
  onVerifyChange,
  onSafeChange,
  searchParams,
}) => {
  const router = useRouter();
  const [collapseOpen, setCollapseOpen] = useState(true);

  const getParam = (name: string): string | null => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(name);
    } else {
      const value = searchParams[name];
      return Array.isArray(value) ? value[0] : value || null;
    }
  };

  const [filter, setFilter] = useState({
    verify: getParam("verify") === "1",
    safe: getParam("safe") === "1",
  });

  useEffect(() => {
    const verifyValue = getParam("verify");
    const safeValue = getParam("safe");

    setFilter({
      verify: verifyValue === "1",
      safe: safeValue === "1",
    });
  }, []);

  const handleFilterChange = (type: "verify" | "safe", value: boolean) => {
    const newFilter = { ...filter, [type]: value };
    setFilter(newFilter);

    const current = new URLSearchParams(
      Array.from(searchParams?.entries() ?? [])
    );
    current.set(type, value ? "1" : "0");
    current.set("page", "1");

    router.push(`/companies?${current.toString()}`);
  };

  return (
    <div style={{ gap: "5px", padding: "31px 50px" }} className="rtl">
      <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
        <Button
          className={
            filter.verify
              ? "d-flex gap-3 justify-content-start categoryBtnActive rounded-5 col-12 rounded pr-0 mb-2"
              : "d-flex gap-3 justify-content-start categoryBtn rounded-5 col-12 rounded pr-0"
          }
          style={{
            height: "48px",
            fontSize: "16px",
            fontWeight: "500",
            border: "#E0E0E0 1px solid",
            marginBottom: "20px",
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
                      color: "#FB8C00",
                      borderRadius: "4px",
                      border: "1px solid #FB8C00",
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
              <ConfirmBadge color={filter.verify ? "#FB8C00" : null} />
            </div>
          }
          onClick={() => handleFilterChange("verify", !filter.verify)}
        >
          شرکت‌های تایید شده
        </Button>

        <Button
          className={
            filter.safe
              ? "d-flex gap-3 justify-content-start categoryBtnActive rounded-5 col-12 rounded pr-0"
              : "d-flex gap-3 justify-content-start categoryBtn rounded-5 col-12 rounded pr-0"
          }
          style={{
            height: "48px",
            fontSize: "16px",
            fontWeight: "500",
            border: "#E0E0E0 1px solid",
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
                      color: "#FB8C00",
                      borderRadius: "4px",
                      border: "1px solid #FB8C00",
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
              <ProtectBadge color={filter.safe ? "#FB8C00" : null} />
            </div>
          }
          onClick={() => handleFilterChange("safe", !filter.safe)}
        >
          شرکت‌های دارای قرارداد امن
        </Button>
      </Collapse>
    </div>
  );
};

export default CompanyFilters;
