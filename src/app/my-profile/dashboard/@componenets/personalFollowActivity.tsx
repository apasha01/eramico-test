"use client";

import React, { useState, useEffect } from "react";
import { Button, Radio, Typography } from "@mui/material";
import styles from "./styles.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ImRadioUnchecked } from "react-icons/im";
import { axiosInstance } from "@/Helpers/axiosInstance";
import useSave_Category_MultipleApi from "@/Helpers/CustomHooks/follow/useSave_Category_MultipleApi";
import LoaderComponent from "@/Components/LoaderComponent";
import { toast } from "react-toastify";
import { CATEGORY_LOOKUP } from "@/lib/urls";

export default function PersonalFollowActivity() {
  const [categories, setCategories] = useState([]);
  const [selectedValues, setSelectedValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const { postData_Save_Category_Multiple } = useSave_Category_MultipleApi();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const categories = await axiosInstance.get<any>(CATEGORY_LOOKUP);
      const response = categories.data;
      if (response?.success) {
        setCategories(response.data);
        const preSelectedIds = response.data
          .filter((category: any) => category.isSelected)
          .map((category: any) => category.id);

        setSelectedValues(preSelectedIds);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (id: number) => {
    const isSelected = selectedValues.includes(id);
    const newSelectedValues = isSelected
      ? selectedValues.filter((item) => item !== id)
      : [...selectedValues, id];

    setSelectedValues(newSelectedValues);

    try {
      const data = await postData_Save_Category_Multiple({
        entityIds: newSelectedValues,
      });

      if (!data?.success) {
        toast.warning(data?.message);
        setSelectedValues(selectedValues);
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving.");
      setSelectedValues(selectedValues);
    }
  };

  return (
    <div className={styles.activityMainDiv} >
      <Typography className="fs-24 fw-500">زمینه فعالیت</Typography>
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className={styles.activityGrid} >
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
}
