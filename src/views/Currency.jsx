import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Slider,
  Link as MuiLink,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import LinkIcon from "@mui/icons-material/Link";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HistoryIcon from "@mui/icons-material/History";
import FileOpenIcon from "@mui/icons-material/FileOpen";

import Explorers from "../components/DropDownMenus/Explorers";
import ContractMenu from "../components/DropDownMenus/ContractMenu";
import ScoreMenu from "../components/DropDownMenus/ScoreMenu";
import LinksMenu from "../components/DropDownMenus/LinksMenu";
import { AntTab, AntTabs, TabPanel, TextInput } from "../components/CustomTags";
import CurrencyChart from "../components/CurrencyChart";
import Market from "../components/Market";
import HistoricalData from "../components/HistoricalData";
import ChartDays from "../components/ChartDays";
import { ClipLoad, BarLoad } from "../components/Loader";

const boxStyleFlex = { display: "flex", gap: 2, alignItems: "center" };
const boxStyleFlexWrap = { ...boxStyleFlex, flexWrap: "wrap" };

const CurrencyValues = ({ name, value }) => {
  return (
    <>
      <Typography variant="body1" color="text.secondary">
        {name}
      </Typography>
      <Typography variant="h6" color="text.primary">
        {value}
      </Typography>
    </>
  );
};

const Currency = ({
  currency: selectedCurrency,
  currencySymbol,
  setLoading,
}) => {
  const { coinName } = useParams();

  const [mainToken, setMainToken] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [anchorEl3, setAnchorEl3] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [scoreListMenu, setScoreListMenu] = useState({});
  const [defaultLinks, setDefaultLinks] = useState({});
  const [profitPercent, setProfitPercent] = useState(0);
  const [currentPrice, setCurrentPrice] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [value, setValue] = useState(0);
  const [contract, setContract] = useState(true);
  const [chartType, setChartType] = useState("prices");
  const [chartDays, setChartDays] = useState(7);
  const [circulatingPercentage, setCirculatingPercentage] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (value.match(/^[0-9]*[.,]?[0-9]*$/)) {
      if (!value) {
        setMainToken("");
        setCurrentPrice("");
      }
      if (name === "mainToken") {
        setMainToken(value);
        if (value > 0) {
          setCurrentPrice(parseFloat(value * defaultPrice).toFixed(5));
        }
      } else if (name === selectedCurrency) {
        setCurrentPrice(value);
        if (value > 0) {
          setMainToken(parseFloat(value / defaultPrice).toFixed(5));
        }
      }
    }
  };

  useEffect(() => {
    let scorList = {};
    let linksList = {};

    (async () => {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinName}?market_data=true&localization=false&tickers=false&sparkline=false`
      );

      if (data) {
        setLoading(false);
      } else {
        setLoading(true);
      }

      scorList = {
        "coingecko score": data?.coingecko_score,
        "developer score": data?.developer_score,
        "community score": data?.community_score,
        "liquidity score": data?.liquidity_score,
      };

      linksList = {
        website: data?.links?.homepage[0],
        social: {
          twitter:
            data?.links?.twitter_screen_name.length <= 0
              ? ""
              : `https://twitter.com/${data?.links?.twitter_screen_name}`,
          facebook:
            data?.links?.facebook_username.length <= 0
              ? ""
              : `https://www.facebook.com/${data?.links?.facebook_username}`,
          reddit:
            data?.links?.subreddit_url === null
              ? ""
              : data?.links?.subreddit_url,
        },
        "chats and forums": {
          forum: data?.links?.official_forum_url,
          chat: data?.links?.chat_url,
          announce: data?.links?.announcement_url,
        },
        github: { repo: data?.links?.repos_url?.github },
      };

      const contractList = Object.keys(data?.platforms);
      contractList.forEach((item) => {
        if (item.length > 0) {
          setContract(true);
        } else {
          setContract(false);
        }
      });

      const circulating_percentage =
        (data?.market_data?.circulating_supply * 100) /
        data?.market_data?.total_supply;

      setCurrency(data);
      setCirculatingPercentage(circulating_percentage);
      setDefaultPrice(data?.market_data?.current_price[selectedCurrency]);
      setProfitPercent(data?.market_data?.price_change_percentage_24h);
      setScoreListMenu(scorList);
      setDefaultLinks(linksList);
    })();
  }, [coinName, selectedCurrency, setLoading]);

  // console.log(currency);
  return (
    <Box mt={5}>
      <Container>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ ...boxStyleFlex }}>
              <Box
                component="img"
                src={currency?.image.thumb}
                alt={currency?.symbol}
                sx={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
              <Typography variant="h4" color="text.primary" mr={3}>
                {currency?.name}
              </Typography>
              <Typography variant="subtitle2">
                {currency?.symbol.toUpperCase()}
              </Typography>
            </Box>
            <Box mt={2} ml={2} sx={boxStyleFlexWrap}>
              <Button variant="outlined">
                Rank #{currency?.market_cap_rank}
              </Button>
              {currency?.categories[0] && (
                <Button variant="outlined">{currency?.categories[0]}</Button>
              )}

              {currency?.hashing_algorithm && (
                <Button variant="outlined">
                  {currency?.hashing_algorithm}
                </Button>
              )}
            </Box>

            <Box mt={3} sx={boxStyleFlexWrap}>
              <Button
                variant="normal"
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                <ManageSearchIcon />
                Explorers
              </Button>

              {contract && (
                <Button
                  variant="normal"
                  onClick={(event) => setAnchorEl2(event.currentTarget)}
                >
                  <FileOpenIcon /> Contracts
                </Button>
              )}
              <Button
                variant="normal"
                onClick={(event) => setAnchorEl1(event.currentTarget)}
              >
                <LinkIcon /> Links
              </Button>

              <Button
                variant="normal"
                onClick={(event) => setAnchorEl3(event.currentTarget)}
              >
                <FormatListNumberedRtlIcon /> Scores
              </Button>
            </Box>
            <Explorers
              handleClose={() => setAnchorEl(null)}
              anchorEl={anchorEl}
              data={currency?.links?.blockchain_site}
              name="currency"
            />
            <LinksMenu
              handleClose={() => setAnchorEl1(null)}
              anchorEl={anchorEl1}
              data={defaultLinks}
            />
            <ContractMenu
              handleClose={() => setAnchorEl2(null)}
              anchorEl={anchorEl2}
              data={currency?.platforms}
            />
            <ScoreMenu
              handleClose={() => setAnchorEl3(null)}
              anchorEl={anchorEl3}
              data={scoreListMenu}
            />
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Typography mt={3} variant="h6" color="text.primary">
              {currency?.name} Price ({currency?.symbol.toUpperCase()})
            </Typography>
            <Box
              sx={{
                ...boxStyleFlex,
                justifyContent: "center",
                mt: 1,
              }}
            >
              <Typography variant="h4" color="text.primary">
                {currencySymbol ?? ""}{" "}
                {currency?.market_data?.current_price[selectedCurrency]}
              </Typography>
              <Button
                sx={{
                  backgroundColor: profitPercent > 0 ? "text.buy" : "text.sell",
                  color: "text.primary",
                  height: "40px",
                }}
              >
                {profitPercent > 0 ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}{" "}
                {parseFloat(profitPercent).toFixed(2)}%
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography
                variant="subtitle1"
                component="span"
                color="text.primary"
                mr={1}
              >
                {currencySymbol ?? ""}
                {parseFloat(
                  currency?.market_data?.high_24h[selectedCurrency]
                ).toFixed(3)}
              </Typography>
              <Button variant="outlined">24h High</Button>
            </Box>
            <Slider
              size="small"
              value={profitPercent}
              disabled
              sx={{
                "&.Mui-disabled": {
                  color: profitPercent > 0 ? "text.buy" : "text.sell",
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Button variant="outlined">24h Low</Button>
              <Typography
                variant="subtitle1"
                component="span"
                color="text.primary"
                ml={1}
              >
                {currencySymbol ?? ""}
                {parseFloat(
                  currency?.market_data?.low_24h[selectedCurrency]
                ).toFixed(3)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                ...boxStyleFlex,
                mt: 3,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box sx={boxStyleFlex}>
                <MuiLink
                  href={currency?.links?.homepage[0]}
                  target="_blank"
                  sx={{ textDecoration: "none", order: { xs: 1, md: 0 } }}
                  rel="noreferrer noopener"
                >
                  <Button
                    sx={{
                      backgroundColor: "text.buy",
                      color: "text.primary",
                      height: "40px",
                      "&:hover": {
                        backgroundColor: "#4CAF50a1",
                      },
                    }}
                  >
                    Buy
                  </Button>
                </MuiLink>
                <Box
                  component="form"
                  sx={{
                    backgroundColor: "primary.secondary",
                    borderRadius: "10px",
                    width: "fit-content",
                    border: "1px solid #2E3348",
                    display: "flex",
                    order: { xs: 0, md: 1 },
                    p: 1,
                  }}
                >
                  <TextInput
                    type="text"
                    name="mainToken"
                    placeholder="1"
                    value={mainToken}
                    onChange={(e) => onChangeHandler(e)}
                  />

                  <Typography variant="body1" mt={1}>
                    {currency?.symbol.toUpperCase()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={boxStyleFlex}>
                <Box
                  component="form"
                  sx={{
                    backgroundColor: "primary.secondary",
                    borderRadius: "10px",
                    width: "fit-content",
                    border: "1px solid #2E3348",
                    display: "flex",
                    p: 1,
                  }}
                >
                  <TextInput
                    type="text"
                    placeholder={parseFloat(defaultPrice).toFixed(4)}
                    name={selectedCurrency}
                    value={currentPrice}
                    onChange={(e) => onChangeHandler(e)}
                  />

                  <Typography variant="body1" mt={1}>
                    {selectedCurrency?.toUpperCase()}
                  </Typography>
                </Box>
                <MuiLink
                  href={currency?.links?.homepage[0]}
                  target="_blank"
                  sx={{ textDecoration: "none" }}
                  rel="noreferrer noopener"
                >
                  <Button
                    sx={{
                      backgroundColor: "text.sell",
                      color: "text.primary",
                      height: "40px",
                      "&:hover": {
                        backgroundColor: "#F44336a1",
                      },
                    }}
                  >
                    Sell
                  </Button>
                </MuiLink>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={3} justifyContent="center">
          <Grid item xs={6} md={3}>
            <CurrencyValues
              name="Market Cap"
              value={`${
                currencySymbol ?? ""
              } ${currency?.market_data?.market_cap[
                selectedCurrency
              ]?.toLocaleString()}`}
            />
            <Typography
              variant="h6"
              color={
                currency?.market_data?.market_cap_change_24h > 0
                  ? "text.buy"
                  : "text.sell"
              }
            >
              {currencySymbol ?? ""}{" "}
              {currency?.market_data?.market_cap_change_24h?.toLocaleString()}
            </Typography>
          </Grid>
          {currency?.market_data?.fully_diluted_valuation[selectedCurrency] !==
            undefined && (
            <Grid item xs={6} md={3}>
              <CurrencyValues
                name="Fully Diluted Market Cap"
                value={`${
                  currencySymbol ?? ""
                } ${currency?.market_data?.fully_diluted_valuation[
                  selectedCurrency
                ]?.toLocaleString()}`}
              />
            </Grid>
          )}

          <Grid item xs={6} md={3}>
            <CurrencyValues
              name="Volume 24h"
              value={`${
                currencySymbol ?? ""
              } ${currency?.market_data?.total_volume[
                selectedCurrency
              ]?.toLocaleString()}`}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <CurrencyValues
              name="Volume /Market Cap"
              value={parseFloat(
                currency?.market_data?.total_volume[selectedCurrency] /
                  currency?.market_data?.market_cap[selectedCurrency]
              ).toFixed(3)}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <CurrencyValues
              name="Circulating Supply"
              value={`${currencySymbol ?? ""} ${Math.round(
                currency?.market_data?.circulating_supply
              )?.toLocaleString()}`}
            />
            <Slider
              sx={{
                width: "90%",
                "& .MuiSlider-thumb": { display: "none" },
                "&.Mui-disabled": {
                  color: "#2196F3",
                },
              }}
              value={circulatingPercentage}
              disabled={true}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <CurrencyValues
              name="Max Supply"
              value={`${currencySymbol ?? ""} ${Math.round(
                currency?.market_data?.total_supply
              )?.toLocaleString()}`}
            />
          </Grid>
          {currency?.genesis_date !== null && (
            <Grid item xs={6} md={3}>
              <CurrencyValues
                name="Genisis Data"
                value={currency?.genesis_date}
              />
            </Grid>
          )}

          {currency?.block_time_in_minutes > 0 && (
            <Grid item xs={6} md={3}>
              <CurrencyValues
                name="Block Time"
                value={currency?.block_time_in_minutes}
              />
            </Grid>
          )}
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <AntTabs
            value={value}
            onChange={handleChange}
            aria-label="ant example"
          >
            <AntTab
              label={
                <Typography
                  variant="body1"
                  sx={{
                    color: value === 0 ? "text.active" : "text.secondary",
                    backgroundColor: value === 0 && "primary.secondary",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ShowChartIcon sx={{ mr: 1 }} /> Chart
                </Typography>
              }
            />
            <AntTab
              label={
                <Typography
                  variant="body1"
                  sx={{
                    color: value === 1 ? "text.active" : "text.secondary",
                    backgroundColor: value === 1 && "primary.secondary",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FormatListBulletedIcon sx={{ mr: 1 }} /> Market
                </Typography>
              }
            />
            <AntTab
              label={
                <Typography
                  variant="body1"
                  sx={{
                    color: value === 2 ? "text.active" : "text.secondary",
                    backgroundColor: value === 2 && "primary.secondary",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <HistoryIcon sx={{ mr: 1 }} />
                  Historical Data
                </Typography>
              }
            />
          </AntTabs>
        </Box>
        <Box>
          <TabPanel value={value} index={0}>
            <Box
              sx={{
                background: "primary.main",
                p: 1.5,
                display: "flex",
                justifyContent: "space-between",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="tabs"
                  onClick={() => setChartType("prices")}
                  sx={{
                    color:
                      chartType === "prices" ? "text.active" : "text.secondary",
                  }}
                >
                  Price
                </Button>
                <Button
                  variant="tabs"
                  onClick={() => setChartType("market_caps")}
                  sx={{
                    color:
                      chartType === "market_caps"
                        ? "text.active"
                        : "text.secondary",
                  }}
                >
                  Market Cap
                </Button>
              </Box>

              <ChartDays chartDays={chartDays} setChartDays={setChartDays} />
            </Box>
            <CurrencyChart
              coinName={coinName}
              chartType={chartType}
              chartDays={chartDays}
              selectedCurrency={selectedCurrency}
              currencySymbol={currencySymbol}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Market />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <HistoricalData
              coinName={coinName}
              selectedCurrency={selectedCurrency}
              currencySymbol={currencySymbol}
            />
          </TabPanel>
        </Box>
      </Container>
    </Box>
  );
};

export default Currency;
