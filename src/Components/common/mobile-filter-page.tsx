"use client";

import React, { useState, useEffect } from "react";
import { Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { CATEGORY_LOOKUP_TREE } from "@/lib/urls";

import FilterHeader from "@/Components/common/FilterHeader";
import ChevronDown from "@/Components/Icons/ChevronDown";
import VerificationFiltersMobile from "@/Components/common/VerificationFiltersMobile";
import CategoryModal from "@/Components/common/category-modal-filter/category-modal";
import SubCategoryModal from "@/Components/common/category-modal-filter/sub-category-modal";

interface Props {
  basePath: string;
  searchParams: Record<string, string | string[]>;
}

const MobileFilterPage = ({ basePath, searchParams }: Props) => {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [subCategoryModalOpen, setSubCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(
    null
  );
  const [filters, setFilters] = useState({
    verify: false,
    safe: false,
    user: false,
  });

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

  useEffect(() => {
    if (searchParams && categories.length > 0) {
      const getParam = (name: string): string | null => {
        const value = searchParams[name];
        return Array.isArray(value) ? value[0] : value || null;
      };

      const categoryValue = getParam("category");

      if (categoryValue) {
        let foundCategory = categories.find(
          (cat) => cat.id.toString() === categoryValue
        );

        if (!foundCategory) {
          categories.forEach((cat) => {
            if (cat.children) {
              const child = cat.children.find(
                (sub) => sub.id.toString() === categoryValue
              );
              if (child) {
                setSelectedCategory(child.parentId);
                setSelectedSubCategory(child.id);
              }
            }
          });
        } else {
          setSelectedCategory(foundCategory.id);
          setSelectedSubCategory(null);
        }
      }

      setFilters({
        verify: getParam("verify") === "1",
        safe: getParam("safe") === "1",
        user: getParam("user") === "1",
      });
    }
  }, [searchParams, categories]);

  const handleCategorySelect = (id: number) => {
    setSelectedCategory(id);
    setSelectedSubCategory(null);
    setCategoryModalOpen(false);
  };

  const handleSubCategorySelect = (id: number) => {
    setSelectedSubCategory(id);
    setSubCategoryModalOpen(false);
  };

  const handleCompanyFiltersUpdate = (newFilters: any) => {
    setFilters(newFilters);
  };

  const applyFilters = () => {
    const current = new URLSearchParams();
    
    // Convert searchParams to URLSearchParams
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        current.set(key, value[0]);
      } else {
        current.set(key, value);
      }
    });

    if (selectedSubCategory !== null) {
      current.set("category", selectedSubCategory.toString());
    } else if (selectedCategory !== null) {
      current.set("category", selectedCategory.toString());
    } else {
      current.delete("category");
    }

    filters.verify ? current.set("verify", "1") : current.delete("verify");
    filters.safe ? current.set("safe", "1") : current.delete("safe");
    filters.user ? current.set("user", "1") : current.delete("user");

    current.set("page", "1");

    router.push(`${basePath}?${current.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setFilters({ verify: false, safe: false, user: false });
    router.push(basePath);
  };

  return (
    <Box sx={{ padding: "16px" }}>
      <FilterHeader clearFilters={clearFilters} />

      <Box
        className="categoryModalFilters"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Button
          className="filterButton"
          variant="outlined"
          onClick={() => setCategoryModalOpen(true)}
        >
          انتخاب گروه <ChevronDown />
        </Button>

        <Button
          className="filterButton"
          variant="outlined"
          onClick={() => setSubCategoryModalOpen(true)}
          disabled={!selectedCategory}
        >
          انتخاب کالا <ChevronDown />
        </Button>
      </Box>

      <VerificationFiltersMobile onFilterUpdate={handleCompanyFiltersUpdate} />

      <Box className="applyFilterButton" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={applyFilters}
        >
          تایید
        </Button>
      </Box>

      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={categories}
        onSelectCategory={handleCategorySelect}
      />

      <SubCategoryModal
        open={subCategoryModalOpen}
        onClose={() => setSubCategoryModalOpen(false)}
        subCategories={
          categories.find((cat) => cat.id === selectedCategory)?.children || []
        }
        onSelectSubCategory={handleSubCategorySelect}
      />
    </Box>
  );
};

export default MobileFilterPage;
