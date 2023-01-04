import { useState, useEffect } from "react";
import axios from "axios";
const useFetch = (currency) => {
  const [data, setData] = useState([]);
  const url = `https://api.coingecko.com/api/v3/coins/markets?per_page=30&page=1&order=market_cap_desc&vs_currency=${currency}&price_change_percentage=24h,7d,30d&sparkline=true`;
  useEffect(() => {
    const fetchdata = async () => {
      await axios
        .get(url)
        .then((response) => {
          const toptenvalue = response.data.slice(0, 10);
          setData(toptenvalue);
        })
        .catch((error) => {
          console.log("error", error);
        });
    };
    fetchdata();
  }, [currency]);
  return [data];
};

export default useFetch;
