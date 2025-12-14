"use client";

import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import {
  Button,
  InputAdornment,
  ListItemButton,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import BoxIcon from "@/Components/Icons/BoxIcon";
import BuildingIcon from "@/Components/Icons/BuildingIcon";
import CoinIcon from "@/Components/Icons/CoinIcon";
import CurrencyIcon from "@/Components/Icons/CurrencyIcon";
import FlaskIcon from "@/Components/Icons/FlaskIcon";
import MineIcon from "@/Components/Icons/MineIcon";
import OilIcon from "@/Components/Icons/OilIcon";
import SeedIcon from "@/Components/Icons/SeedIcon";
import ShirtIcon from "@/Components/Icons/ShirtIcon";
import { useRouter } from "next/navigation";
import { ReadonlyURLSearchParams } from "next/navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { ImRadioUnchecked } from "react-icons/im";
import { FaCheck } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { Category as ICategory } from "@/Helpers/Interfaces/CategoryInterface";

interface CategoryProps {
  categories: ICategory[];
  url: string;
  searchParams: ReadonlyURLSearchParams | Record<string, string | string[]>;
  title?: string;
  color?: string;
  children?: React.ReactNode;
  hideChildren?: boolean;
}
interface IconMapping {
  [key: string]: React.ReactNode;
}

const iconMapping: IconMapping = {
  ارز: <CurrencyIcon />,
  "سکه و فلزات گرانبها": <CoinIcon />,
  "نفت، گاز و پتروشیمی": <OilIcon />,
  "فلزات و معادن": <MineIcon />,
  "راه و ساختمان": <BuildingIcon />,
  "غذایی و کشاورزی": <SeedIcon />,
  "نساجی و پوشاک": <ShirtIcon />,
  "سلولوزی، چاپ و بسته‌بندی": <BoxIcon />,
  لاستیک: <BoxIcon />,
  "پلیمر و پلاستیک": <BoxIcon />,
  "شیمیایی و حلال‌ها": <FlaskIcon />,
  "حمل و نقل": <BoxIcon />,
  گاز: <OilIcon />,
  "فلزات گرانبها": <MineIcon />,
  "حلال ها": <FlaskIcon />,
  "محصولات پتروشیمی": <OilIcon />,
  حامیان: <CurrencyIcon />,
  // Add more mappings as needed
};

export default function CategoryFilters({
  categories,
  url,
  searchParams,
  title = "انتخاب دسته‌بندی",
  color = "#FB8C00",
  children = null,
  hideChildren = false,
}: CategoryProps) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [collapseOpen, setCollapseOpen] = useState(true);
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const openParent = (id: number) => {
    if (selectedParent === id) {
      setSelectedParent(null);
    } else {
      setSelectedParent(id);
    }
  };

  const handleParentClick = (id: number) => {
    if (hideChildren) {
      handleSubClick(id, null);
    } else {
      let newSelectedCategory: number | null;
      if (selectedCategory == id) {
        newSelectedCategory = null;
      } else newSelectedCategory = id;
      setSelectedCategory(newSelectedCategory);
      setSelectedParent(id);
      handleUrlChange(newSelectedCategory);
    }
  };

  const handleSubClick = (id: number, parentID: number | null) => {
    let newSelectedCategory: number | null;
    if (selectedCategory == id) {
      newSelectedCategory = null;
    } else newSelectedCategory = id;
    setSelectedCategory(newSelectedCategory);
    if (parentID) setSelectedParent(parentID);
    handleUrlChange(newSelectedCategory);
  };

  const handleUrlChange = (id: number | null) => {
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

    if (id === null) {
      current.delete("category");
    } else {
      current.set("category", id.toString());
    }
    current.delete("page");
    const currentUrl = current.toString();
    router.push(`${url}?${currentUrl}`);
    return;
  };

  useEffect(() => {
    if (searchParams) {
      let categoryValue: string | null = null;
      if (searchParams instanceof URLSearchParams) {
        categoryValue = searchParams.get("category");
      } else {
        const value = searchParams["category"];
        categoryValue = Array.isArray(value) ? value[0] : value || null;
      }
      if (categoryValue) {
        let found: ICategory | undefined = undefined;
        found = categories.find((cat) => cat.id.toString() === categoryValue);
        if (!found) {
          for (const cat of categories) {
            if (cat.children) {
              const childCategory = cat.children.find(
                (child) => child.id.toString() === categoryValue
              );
              if (childCategory) {
                found = childCategory;
                break;
              }
            }
          }
        }
        if (found) {
          if (found.parentId) {
            setSelectedParent(found.parentId);
          } else setSelectedParent(found.id);
          setSelectedCategory(found.id);
        } else {
          setSelectedCategory(null);
          setSelectedParent(null);
        }
      }
    }
  }, [searchParams, categories]);

  return (
    <div dir="rtl" style={{ paddingInline: "20px", width: "100%" }}>
      {children}
      <Button
        onClick={() => setCollapseOpen(!collapseOpen)}
        style={{
          height: "52px",
        }}
        className="d-flex align-items-center w-100 p-0 m-0 fs-24"
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
          {title || "انتخاب دسته‌بندی"}
        </Typography>
      </Button>
      <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
        <div>
          <TextField
            name="search"
            variant="outlined"
            className="fs-16 fw-500 w-100 input-border"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mx: 1 }}>
                  <CiSearch size={22} />
                </InputAdornment>
              ),
            }}
            placeholder="جستجو در دسته‌بندی"
            onChange={(e) => setFilter(e.target.value)}
          />
          {categories
            .filter(
              (str) =>
                str.title.includes(filter) ||
                (str.children || []).some((child) =>
                  child.title.includes(filter)
                )
            )
            .map((val: ICategory) => (
              <div key={val.id}>
                <Button
                  className={`d-flex gap-3 justify-content-start rounded-5 col-12 rounded mt-3 pr-0 fs-16 fw-500 ${
                    selectedParent === val.id && val?.children?.length === 0
                      ? "categoryBtnActive"
                      : "categoryBtn"
                  }`}
                  style={{
                    height: "48px",
                  }}
                  variant="text"
                  startIcon={
                    <div className="d-flex gap-1 align-items-center">
                      <Radio
                        checked={selectedCategory === val.id}
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
                        onClick={() => handleParentClick(val.id)}
                      />
                      {iconMapping[val.title] || null}
                    </div>
                  }
                  onClick={() =>
                    hideChildren
                      ? handleParentClick(val.id)
                      : openParent(val.id)
                  }
                >
                  {val.title || ""}
                </Button>
                {val.children && val.children.length > 0 && !hideChildren && (
                  <Collapse
                    in={selectedParent === val.id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {val.children
                        .filter((child) => child.title.includes(filter))
                        .map((subVal: any) => (
                          <ListItemButton
                            key={subVal.id}
                            onClick={() => handleSubClick(subVal.id, val.id)} // Pass parentID
                            selected={selectedParent === subVal.id}
                            style={{
                              borderRadius: "32px",
                              marginTop: "7px ",
                              height: "48px",
                            }}
                          >
                            <Button
                              className="d-flex gap-2 justify-content-start col-12 pr-0 fs-15 fw-500"
                              style={{
                                color:
                                  selectedCategory === subVal.id
                                    ? color
                                    : "inherit",
                              }}
                              variant="text"
                              startIcon={
                                <div className="d-flex gap-1 align-items-center">
                                  <Radio
                                    checked={selectedCategory === subVal.id}
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
                                </div>
                              }
                            >
                              {subVal.title || ""}
                            </Button>
                          </ListItemButton>
                        ))}
                    </List>
                  </Collapse>
                )}
              </div>
            ))}
        </div>
      </Collapse>
    </div>
  );
}
