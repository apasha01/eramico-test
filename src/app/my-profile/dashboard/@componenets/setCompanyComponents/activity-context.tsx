"use client";

import React, { useState, useEffect } from "react";
import { Button, Radio, Typography } from "@mui/material";
import styles from "./styles.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ImRadioUnchecked } from "react-icons/im";
import { axiosInstance } from "@/Helpers/axiosInstance";
import LoaderComponent from "@/Components/LoaderComponent";
import { CATEGORY_LOOKUP } from "@/lib/urls";

interface ActivityContextProps {
  selectedValues: number[];
  setSelectedValues: (items: number[]) => void;
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * ActivityContext component
 *
 * @param {ActivityContextProps} props - includes selectedValues and setSelectedValues
 * @returns {JSX.Element} - ActivityContext component
 *
 * This component is used to display a list of activities and allow the user to select which ones to follow.
 * It fetches the list of categories from the server and displays them in a grid.
 * When the user selects a category, it updates the selectedValues state.
 */
/*******  227e6288-b038-4026-b1f5-86036acabcf0  *******/
const ActivityContext = ({
  selectedValues,
  setSelectedValues,
}: ActivityContextProps) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const categories = await axiosInstance.get<any>(CATEGORY_LOOKUP);
      if (categories?.data?.success) {
        setCategories(categories?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id: number) => {
    const newSelectedValues = selectedValues.includes(id)
      ? selectedValues.filter((item: number) => item !== id)
      : [...selectedValues, id];

    setSelectedValues(newSelectedValues);
  };

  return (
    <div className={styles.activityMainDiv}>
      <Typography className="fs-20 fw-500" sx={{
        textAlign:"left"
      }}>زمینه فعالیت</Typography>
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className={styles.activityGrid}>
          {categories.map((val: any) => (
            <div key={val.id}>
              <Button
                variant="outlined"
   
                className={
                  selectedValues.includes(val.id)
                    ? "col-12 followActivityButtonActive "
                    : "col-12 followActivityButton "
                }
                sx={{
                  
                  borderRadius: "16px",
                  border: "1px solid #E0E0E0",
                  transition: "background 200ms",
                  marginInline: "0px",
                  padding: "0px",
                  position: "relative",
                  textAlign: "right",
                  justifyContent: "left",
                  gap: "10px",
                  color: "#212121",
                }}
                onClick={() => handleChange(val.id)}
                startIcon={
                  <Radio
                    checked={selectedValues.includes(val.id)}
                    checkedIcon={
                      <CheckCircleIcon style={{ color: "#FB8C00" }} />
                    }
                    style={{ color: "#E0E0E0" }}
                    icon={
                      <ImRadioUnchecked
                        size={24}
                        style={{ border: "1px solid #E0E0E0" }}
                        className="text-white rounded-5"
                      />
                    }
                  />
                }
              >
                {val.title}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityContext;
