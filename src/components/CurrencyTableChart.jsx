import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import moment from "moment";
import ReactEcharts from "echarts-for-react";
import axios from "axios";

function CurrencyTableChart({ coinName, value }) {
  const [apiData, setApiData] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const url = `https://api.coingecko.com/api/v3/coins/${coinName}/market_chart?vs_currency=usd&days=7`;
        let { data } = await axios.get(url);

        let getingData = {
          price: data.prices,
        };
        setApiData(getingData);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [coinName]);

  let chartData = apiData?.price?.map((item, i) => {
    return [moment(item[0]).format("lll"), item[1].toFixed(2)];
  });

  const option = {
    color: ["#00BCD4"],
    // tooltip: {
    //   trigger: "axis",
    //   position: function (pt) {
    //     return [pt[0], "10%"];
    //   },
    // },
    grid: { height: "auto", width: "auto" },
    xAxis: {
      type: "category",
      showGrid: false,
      show: false,
      axisTick: {
        interval: "auto",
        // height: "auto",
      },
      axisLabel: {
        formatter: function (time, index) {
          return moment(time).format("MMM Do");
        },
        splitLine: {
          show: false,
        },
      },
    },
    yAxis: {
      type: "value",
      showGrid: false,
      show: false,

      splitLine: {
        show: false,
      },
      min: function (value) {
        return Math.floor(value.min);
      },
      max: function (value) {
        return Math.ceil(value.max);
      },
      axisLabel: {
        inside: true,
        paddingTop: "-10px",
        formatter: function (value, index) {
          return value > 1000
            ? "$" + Math.floor(value / 1000) + "K"
            : "$" + Math.floor(value);
        },
      },
    },

    series: [
      {
        name: "Price",
        type: "line",
        smooth: true,
        // areaStyle: { color: "#00BCD4" },
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: value > 0 ? "green" : "#F44336",
          height: 2,
        },
        data: chartData,
      },
    ],
  };

  return (
    <Box style={{ height: "100%", width: "100%" }}>
      <ReactEcharts option={option} style={{ height: "100%", width: "100%" }} />
    </Box>
  );
}

export default CurrencyTableChart;
