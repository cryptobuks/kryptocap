import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import moment from "moment";
import ReactEcharts from "echarts-for-react";
import axios from "axios";

function CurrencyChart({
  coinName,
  chartDays,
  chartType,
  selectedCurrency,
  currencySymbol,
}) {
  const [apiPriceData, setApiPriceData] = useState({});
  const [apiMarketData, setApiMarketData] = useState({});
  const [average, setAverage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const url = `https://api.coingecko.com/api/v3/coins/${coinName}/market_chart?vs_currency=${selectedCurrency}&days=${
          chartDays === 0 ? "max" : chartDays
        }`;
        let { data } = await axios.get(url);

        let priceData = {
          price: data.prices,
        };
        let marketData = {
          price: data.market_caps,
        };
        setApiPriceData(priceData);
        setApiMarketData(marketData);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [chartDays, coinName, selectedCurrency]);

  let priceData = apiPriceData?.price?.map((item, i) => {
    return [moment(item[0]).format("lll"), item[1].toFixed(4)];
  });
  let marketData = apiMarketData?.price?.map((item, i) => {
    return [moment(item[0]).format("lll"), item[1].toFixed(4)];
  });

  useEffect(() => {
    if (priceData) {
      let sumOfArray = 0;
      priceData?.forEach((item) => {
        sumOfArray += +item[1];
      });
      let getAvg = (+sumOfArray / priceData?.length).toFixed(4);

      setAverage(+getAvg);
    }
  }, [priceData]);

  // console.log(average, "average ---->");

  const option = {
    // color: ["#00BCD4"],
    tooltip: {
      trigger: "axis",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    grid: { bottom: "25%" },
    xAxis: {
      type: "category",
      axisTick: {
        interval: "auto",
      },
      axisLabel: {
        formatter: function (time, index) {
          return moment(time).format("MMM Do");
        },
      },
    },
    yAxis: {
      type: "value",
      min: function (value) {
        return Math.floor(value.min);
      },
      max: function (value) {
        return Math.ceil(value.max);
      },
      axisLabel: {
        inside: false,
        // verticalAlign: "bottom",
        // lineHeight: 25,
        formatter: function (value, index) {
          return value > 1000
            ? `${currencySymbol ?? ""}` + Math.floor(value / 1000) + "K"
            : `${currencySymbol ?? ""}` + value;
        },
      },
    },

    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 30,
      },
    ],
    visualMap: {
      show: false,
      pieces: [
        {
          min: 0,
          max: +average,
          color: "#EA3943",
        },
        {
          min: +average,
          max: priceData && priceData[-1],
          color: "#16C784",
        },
      ],
    },
    series: [
      {
        name: "Price",
        type: "line",
        smooth: true,
        showSymbol: false,
        // areaStyle: { opacity: 0.1 },
        lineStyle: {
          width: 2,
          // color:  "#00BCD4",
        },
        data: chartType === "prices" ? priceData : marketData,
        markLine: {
          symbol: false,
          label: {
            show: true,
            position: "start",
            backgroundColor: "#979DA8",
            color: "#fff",
            borderRadius: 5,
            padding: 8,
          },
          lineStyle: {
            color: "#979DA8",
          },
          data: [
            {
              yAxis: +average,
            },
          ],
        },
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
}

export default CurrencyChart;
