"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { numberWithCommas } from "@/lib/utils";
import { ADVERTISE_CHART_VISIT } from "@/lib/urls";
interface AdvertiseVisitChartProps {
  advertiseId: number;
}

const AdvertiseVisitChart = ({ advertiseId }: AdvertiseVisitChartProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(30);
  const [dates, setDates] = useState<string[]>([]);
  const [visits, setVisits] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!advertiseId) return;
      setLoading(true);
      try {
        const url = `${ADVERTISE_CHART_VISIT}/${advertiseId}?chartType=${selectedTab}`;
        const { data } = await axiosInstance.get(url);

        let chartArray: any[] = [];
        if (Array.isArray(data?.data.data)) chartArray = data.data.data;
        else if (Array.isArray(data?.data?.chart)) chartArray = data.data.chart;

        const newDates: string[] = [];
        const newVisits: number[] = [];

        chartArray.forEach((item: any) => {
          newDates.push(item.dateTitle);
          newVisits.push(item.visit);
        });

        setDates(newDates);
        setVisits(newVisits);
      } catch (error) {
        console.error("خطا در دریافت داده‌های چارت بازدید:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [advertiseId, selectedTab]);

  const chartConfig: Highcharts.Options = {
    chart: {
      type: "spline",
      style: { fontFamily: "IRANYekanX" },
      height: 400,
    },
    title: { text: "" },
    xAxis: {
      categories: dates,
      title: { text: "تاریخ" },
      labels: { rotation: -45 },
    },
    yAxis: {
      title: { text: "تعداد بازدید" },
      allowDecimals: false,
    },
    tooltip: {
      backgroundColor: "rgba(255,255,255,0.9)",
      borderColor: "#0D47A1",
      style: { fontSize: "13px" },
      formatter: function (this: any) {
        return `
          <b>${this.category}</b><br/>
          بازدیدها: ${numberWithCommas(this.y)}
        `;
      },
    },
    credits: { enabled: false },
    series: [
      {
        name: "بازدید",
        color: "#1565C0",
        type: "spline",
        data: visits,
      },
    ],
  };

  return (
    <Box className="w-100 px-4 p-3">
      {/* Tabs with custom colors */}
      <Tabs
        value={selectedTab}
        onChange={(e, newVal) => setSelectedTab(newVal)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "& .MuiTab-root": {
            color: "#616161",
            fontWeight: 500,
            borderRadius: "20px",
            minHeight: "36px",
            textTransform: "none",
            marginRight: "8px",
            transition: "all 0.2s ease",
          },
          "& .Mui-selected": {
            backgroundColor: "#0D47A1",
            color: "#fff !important",
            fontWeight: 600,
          },

          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        <Tab value={0} label="کل بازدیدها" />
        <Tab value={30} label="۳۰ روز اخیر" />
        <Tab value={90} label="۳ ماهه" />
        <Tab value={180} label="۶ ماهه" />
        <Tab value={365} label="سالیانه" />
      </Tabs>

      {loading ? (
        <div className="text-center p-5">در حال بارگذاری نمودار...</div>
      ) : (
        <div className="">
          <HighchartsReact highcharts={Highcharts} options={chartConfig} />
        </div>
      )}
    </Box>
  );
};

export default AdvertiseVisitChart;
