import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import moment from "moment";
import ReactEcharts from "echarts-for-react";
import axios from "axios";

const ExchangeChart = ({ exchangeName, chartDays }) => {
  const [exchangeChartData, setExchangeChartData] = useState();
  useEffect(() => {
    (async () => {
      const exchangeUrl = `https://api.coingecko.com/api/v3/exchanges/${exchangeName}/volume_chart?days=${
        chartDays === 0 ? "max" : chartDays
      }`;
      try {
        let { data } = await axios.get(exchangeUrl);

        let getingData = {
          volume: data,
        };
        setExchangeChartData(getingData);
      } catch (e) {
        return [];
      }
    })();
  }, [chartDays, exchangeName]);

  let chartData = exchangeChartData?.volume?.map((item, i) => {
    return [moment(item[0]).format("lll"), Math.floor(item[1])];
  });

  const option = {
    color: ["#00BCD4"],
    tooltip: {
      trigger: "axis",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    grid: { bottom: "25%", left: 0, right: 0 },
    xAxis: {
      type: "category",
      axisTick: {
        show: false,
      },
      axisLine: { show: false },
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      show: false,
      type: "value",
      min: "dataMin",
      max: "dataMax",
    },

    series: [
      {
        name: "Volume",
        type: "line",
        smooth: true,
        areaStyle: { color: "#00BCD4" },
        showSymbol: false,
        lineStyle: {
          width: 0,
        },
        data: chartData,
      },
    ],
  };

  return (
    <Box>
      <ReactEcharts
        option={option}
        style={{ height: "500px", width: "100%" }}
      />
    </Box>
  );
};

export default ExchangeChart;
