"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { CATEGORY_LOOKUP_TREE } from "@/lib/urls";
import FilterHeader from "@/Components/common/FilterHeader";
import ChevronDown from "@/Components/Icons/ChevronDown";
import CompanyFilters from "./CompanyFilters";

export default function FilterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const verifiedCompanies = searchParams.get("verify") === "true";
  const safeCompanies = searchParams.get("safe") === "true";

  const [selected, setSelected] = useState(selectedCategory);
  const [isVerified, setIsVerified] = useState(verifiedCompanies);
  const [isSafe, setIsSafe] = useState(safeCompanies);
  const [categories, setCategories] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get<any>(CATEGORY_LOOKUP_TREE);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelected(categoryId);
  };

  const applyFilters = () => {
    const queryParams = new URLSearchParams();
    if (selected) queryParams.set("category", selected);
    if (isVerified) queryParams.set("verify", "true");
    if (isSafe) queryParams.set("safe", "true");

    router.push(`/companies?${queryParams.toString()}`);
  };

  const clearFilters = () => {
    setSelected("");
    setIsVerified(false);
    setIsSafe(false);
    router.push("/companies");
  };

  useEffect(() => {
    const verifyValue = searchParams.get("verify");
    const safeValue = searchParams.get("safe");

    setIsVerified(verifyValue === "true");
    setIsSafe(safeValue === "true");
  }, [searchParams]);

  return (
    <>
      <div className="filterPageContainer">
        <FilterHeader clearFilters={clearFilters} />

        <div className="filterOptions">
          <div className="filterButtonContainer">
            <Button
              className="filterButton"
              variant="outlined"
              fullWidth
              onClick={() => setModalOpen(true)}
            >
              انتخاب دسته شرکت‌ها
              <ChevronDown />
            </Button>
          </div>

          <CompanyFilters
            isVerified={isVerified}
            isSafe={isSafe}
            onVerifyChange={(value) => setIsVerified(value)}
            onSafeChange={(value) => setIsSafe(value)}
            searchParams={searchParams}
          />
        </div>

        <div className="applyFilterButton">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={applyFilters}
          >
            تایید
          </Button>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{ display: "flex", alignItems: "flex-end" }}
        className="modal-box"
      >
        <Paper
          sx={{
            width: "100%",
            height: "50vh",
            borderRadius: "16px 16px 0 0",
            p: 2,
            overflowY: "auto",
          }}
        >
          <Typography
            sx={{ fontSize: "18px", fontWeight: 600, textAlign: "center" }}
          >
            انتخاب گروه شرکت‌ها
          </Typography>
          <List>
            {categories.map((category) => (
              <ListItem
                key={category.id}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selected === category.id ? "#fb8a0087" : "transparent",
                  color: selected === category.id ? "white" : "black",
                  borderRadius: "8px",
                  mb: 1,
                }}
                onClick={() => handleCategorySelect(category.id)}
              >
                <ListItemText className="ModalItems" primary={category.title} />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setModalOpen(false)}
          >
            بازگشت
          </Button>
        </Paper>
      </Modal>
    </>
  );
}
