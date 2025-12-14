"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab, Checkbox, FormControlLabel, Box } from "@mui/material";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { PRODUCT_PRICE_CHART } from "@/lib/urls";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { AxisLabelsFormatterContextObject } from "highcharts";
import { numberWithCommas } from "@/lib/utils";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

interface PriceChartProps {
  productId: number | null;
  supplierId: number | null;
  producerId: number | null;
  priceType: number;
  priceUnit: string;
}

const PriceChart = ({
  productId,
  supplierId,
  producerId,
  priceType,
  priceUnit,
}: PriceChartProps) => {
  const [selectedTab, setSelectedTab] = useState(30);
  const [showChartNow, setShowChartNow] = useState(true);
  const [showChartPrev, setShowChartPrev] = useState(true);
  const [chartNow, setChartNow] = useState<any[]>([]);
  const [chartPrev, setChartPrev] = useState<any[]>([]);
  const [chartDates, setChartDates] = useState<string[]>([]);
  const [chartPeriod, setChartPeriod] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get<any>(
        `${PRODUCT_PRICE_CHART}?productId=${productId}&supplierId=${supplierId}${
          producerId ? `&producerId=${producerId}` : ""
        }&priceType=${priceType}&chartType=${selectedTab}`
      );
      if (response.data.success && response.data.data) {
        const priceNow: any[] = [];
        const pricePrev: any[] = [];
        const dates: string[] = [];
        response.data.data.chart.forEach((item: any) => {
          priceNow.push(item.priceNow);
          pricePrev.push(item.pricePrev);
          dates.push(item.dateTitle);
        });
        setChartNow(priceNow || []);
        setChartPrev(pricePrev || []);
        setChartDates(dates || []);
        setChartPeriod(response.data.data.period);
      }
    };

    fetchData();
  }, [productId, supplierId, producerId, selectedTab, priceType]);

  const chartConfig = {
    chart: {
      style: {
        fontFamily: "IRANYekanX",
      },
    },
    title: {
      text: "",
    },
    xAxis: {
      labels: {
        enabled: false,
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        formatter: function (this: AxisLabelsFormatterContextObject) {
          return numberWithCommas(this.value);
        },
      },
    },
    tooltip: {
      useHTML: true,
      shared: true,
      formatter: function (this: any): any {
        const pointIndex = this.points[0].point.index;
        const date = chartDates[pointIndex] || "N/A";
        const currentPrice = this.points.find(
          (p: any) => p.series.name === "ماه جاری"
        );
        const previousPrice = this.points.find(
          (p: any) => p.series.name === "ماه قبل"
        );

        return `<div class="d-flex flex-column justify-content-start px-2 py-2" style="text-align: right;">
          ${
            currentPrice
              ? `<span class="pb-2" style="color: black;"><strong>ماه جاری:</strong> ${numberWithCommas(
                  currentPrice.y
                )} ${priceUnit}</span>`
              : ""
          }
          ${
            previousPrice
              ? `<span class="pb-2" style="color: gray;"><strong>ماه قبل:</strong> ${numberWithCommas(
                  previousPrice.y
                )} ${priceUnit}</span>`
              : ""
          }
          <span style="color: gray;">${date}</span>
        </div>`;
      },
    },
    plotOptions: {
      series: {
        showInNavigator: true,
        gapSize: 6,
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "ماه جاری",
        color: "black",
        data: showChartNow ? chartNow : [],
      },
      {
        name: "ماه قبل",
        color: "gray",
        dashStyle: "Dash",
        data: showChartPrev ? chartPrev : [],
        marker: {
          enabled: false,
        },
      },
    ],
  };

  return (
    <div className="w-100 px-4">
      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="secondary"
        sx={{ "& .MuiTabs-indicator": { display: "none" } }}
      >
        <Tab value={30} label="ماهانه" />
        <Tab value={90} label="سه ماهه" />
        <Tab value={180} label="شش ماهه" />
        <Tab value={365} label="سالیانه" />
      </Tabs>
      <HighchartsReact options={chartConfig} highcharts={Highcharts} />
      <Box display="flex" alignItems="center" mt={2}>
        <div className="c0-4">
          <CalendarTodayIcon />
          <span className="me-2" style={{ fontFamily: "IRANYekanX" }}>
            {chartPeriod}
          </span>
        </div>
        <Box className="justify-content-center col-8" display="flex" gap={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showChartNow}
                onChange={(e) => setShowChartNow(e.target.checked)}
                sx={{
                  color: "#424242 !important",
                  "&.Mui-checked": {
                    color: "#424242 !important",
                  },
                }}
              />
            }
            label="ماه جاری"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showChartPrev}
                onChange={(e) => setShowChartPrev(e.target.checked)}
                sx={{
                  color: "#424242 !important",
                  "&.Mui-checked": {
                    color: "#424242 !important",
                  },
                }}
              />
            }
            label="ماه قبل"
          />
        </Box>
      </Box>
    </div>
  );
};

export default PriceChart;
