"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Collapse, Radio } from "@mui/material";
import { FaCheck } from "react-icons/fa";
import { ImRadioUnchecked } from "react-icons/im";
import ProtectBadge from "@/Components/Icons/ProtectBadge";
import ConfirmBadge from "@/Components/Icons/ConfrimBadge";
import UserConfirmBadge from "@/Components/Icons/UserConfirmBadge";

interface CompanyFiltersProps {
  onFilterUpdate: (filters: {
    verify: boolean;
    safe: boolean;
    user: boolean;
  }) => void;
}

const VerificationFiltersMobile = ({ onFilterUpdate }: CompanyFiltersProps) => {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    verify: false,
    safe: false,
    user: false,
  });

  useEffect(() => {
    if (searchParams) {
      setFilters({
        verify: searchParams.get("verify") === "1",
        safe: searchParams.get("safe") === "1",
        user: searchParams.get("user") === "1",
      });
    }
  }, [searchParams]);

  const handleFilterChange = (key: string, value: boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterUpdate(newFilters);
  };

  return (
    <div style={{ gap: "5px", padding: "31px 50px" }} className="rtl">
      <Collapse in={true} timeout="auto" unmountOnExit>
        <Button
          className={`${filters.verify ? "categoryBtnActive col-12" : "categoryBtn col-12"} VerificationFiltersMobile`}
          style={{
            height: "48px",
            fontSize: "12px",
            fontWeight: "500",
            borderRadius: "31px",
            border: "#E0E0E0 1px solid",
            marginBottom: "20px",
          }}
          variant="text"
          startIcon={
            <div className="d-flex gap-1 align-items-center">
              <Radio
                checked={filters.verify}
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
            </div>
          }
          onClick={() => handleFilterChange("verify", !filters.verify)}
        >
          <div>
            <ConfirmBadge color={!filters.verify ? null : "#FB8C00"} />
            شرکت‌های تایید شده
          </div>
        </Button>

        <Button
          className={`${filters.safe ? "categoryBtnActive col-12" : "categoryBtn col-12"} VerificationFiltersMobile`}
          style={{
            height: "48px",
            fontSize: "12px",
            fontWeight: "500",
            borderRadius: "31px",
            border: "#E0E0E0 1px solid",
            marginBottom: "20px",
          }}
          variant="text"
          startIcon={
            <div className="d-flex gap-1 align-items-center">
              <Radio
                checked={filters.safe}
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
            </div>
          }
          onClick={() => handleFilterChange("safe", !filters.safe)}
        >
          <div>
            <ProtectBadge color={filters.safe ? "#FB8C00" : null} />
            شرکت‌های دارای قرارداد امن
          </div>
        </Button>

        <Button
          className={`${filters.user ? "categoryBtnActive col-12" : "categoryBtn col-12"} VerificationFiltersMobile`}
          style={{
            height: "48px",
            fontSize: "12px",
            fontWeight: "500",
            borderRadius: "31px",
            border: "#E0E0E0 1px solid",
          }}
          variant="text"
          startIcon={
            <div className="d-flex gap-1 align-items-center">
              <Radio
                checked={filters.user}
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
            </div>
          }
          onClick={() => handleFilterChange("user", !filters.user)}
        >
          <div>
            <UserConfirmBadge color={!filters.user ? null : "#FB8C00"} />
            کاربران تایید شده
          </div>
        </Button>
      </Collapse>
    </div>
  );
};

export default VerificationFiltersMobile;
