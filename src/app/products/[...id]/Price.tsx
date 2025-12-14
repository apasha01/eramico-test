"use client";

import React, { useEffect, useState } from "react";
import { createTheme, Tab, Tabs, ThemeProvider } from "@mui/material";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { PRODUCT_PRICE_LATEST } from "@/lib/urls";
import PriceListTable from "../price-list-table";

const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          border: "1px solid #EEEEEE",
          borderRadius: "50px",
          width: "max-content",
          "&.Mui-selected": {
            borderBottom: "none",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#212121",
          "&.Mui-selected": {
            color: "#fff",
            backgroundColor: "#212121",
            borderRadius: "50px",
            borderBottom: "none",
          },
          fontFamily: "IRANYekanX",
        },
      },
    },
  },
});

const Price = ({ id, category }: { id: number; category: string }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [priceList, setPriceList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<any>(
          `${PRODUCT_PRICE_LATEST}?productId=${id}&priceType=${
            selectedTab === 0 ? 2 : 1
          }`
        );
        if (response.data.success && response.data.data) {
          setPriceList(response.data.data);
        } else {
          setPriceList([]);
        }
      } catch (error) {
        console.error("Failed to fetch price list:", error);
        setPriceList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, selectedTab]);

  return (
    <div className="mainStyle pt-5 align-items-start">
      <ThemeProvider theme={theme}>
        <Tabs
          value={selectedTab}
          onChange={(e, tab) => setSelectedTab(tab)}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="secondary"
          sx={{ "& .MuiTabs-indicator": { display: "none" } }}
          className="me-3"
        >
          <Tab key={0} label="خرید" className="ff" />
          <Tab key={1} label="فروش" className="ff" />
        </Tabs>
        <PriceListTable
          priceList={priceList}
          category={category}
          loading={loading}
        />
      </ThemeProvider>
    </div>
  );
};

export default Price;
