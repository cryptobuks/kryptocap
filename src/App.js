import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";

import TopSection from "./components/TopSection";
import SideDrawer from "./components/DashBoardDrawer/MemberDrawer";
import { modalBox } from "./components/DashBoardDrawer/Modalmeta";
import { BarLoad, ClipLoad } from "./components/Loader";
import { light_theme, dark_theme } from "./utils/theme";
import {
  Currency,
  Exchange,
  Cryptocurrencies,
  AllExchanges,
  Derivatives,
} from "./views";

const App = () => {
  const [lightMode, setLightMode] = useState(false);
  const [currency, setCurrencystate] = useState("usd");
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("GeckoClient:vs_currency")) {
      setCurrencystate(localStorage.getItem("GeckoClient:vs_currency"));
    }

    let myValue = modalBox?.filter(
      (item) =>
        item.value?.toLowerCase().trim() === currency?.toLowerCase().trim()
    );
    setCurrencySymbol(myValue[0].symbol);
  }, [currency]);

  return (
    <ThemeProvider theme={lightMode ? light_theme : dark_theme}>
      <CssBaseline />
      <BrowserRouter>
        <SideDrawer
          lightMode={lightMode}
          setLightMode={setLightMode}
          setCurrencystate={setCurrencystate}
          currency={currency}
        >
          {loading ? (
            <BarLoad loading={loading} />
          ) : (
            <TopSection
              currency={currency}
              currencySymbol={currencySymbol}
              setLoading={setLoading}
            />
          )}

          <Routes>
            <Route
              path="/"
              element={
                <Cryptocurrencies
                  currency={currency}
                  currencySymbol={currencySymbol}
                />
              }
            />
            <Route
              path="/currency/:coinName"
              element={
                <>
                  {loading ? (
                    <ClipLoad loading={loading} />
                  ) : (
                    <Currency
                      currency={currency}
                      currencySymbol={currencySymbol}
                      setLoading={setLoading}
                    />
                  )}
                </>
              }
            />
            <Route
              path="/exchanges"
              element={
                <AllExchanges
                  currency={currency}
                  currencySymbol={currencySymbol}
                />
              }
            />
            <Route
              path="/exchanges/:exchangeName"
              element={
                <>
                  {loading ? (
                    <ClipLoad loading={loading} />
                  ) : (
                    <Exchange
                      currency={currency}
                      currencySymbol={currencySymbol}
                      setLoading={setLoading}
                    />
                  )}
                </>
              }
            />
            <Route path="/derivatives" element={<Derivatives />} />
          </Routes>
        </SideDrawer>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
