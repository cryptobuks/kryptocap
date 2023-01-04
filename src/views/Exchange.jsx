import { useEffect, useState } from "react";
import { Box, Container, Typography, Button, Divider } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkIcon from "@mui/icons-material/Link";
import axios from "axios";
import { useParams } from "react-router-dom";

import Explorers from "../components/DropDownMenus/Explorers";
import ExchangeChart from "../components/ExchangeChart";
import ChartDays from "../components/ChartDays";
import ExchangeTickers from "../components/ExchangeTickers";

const Exchange = ({ setLoading }) => {
  const { exchangeName } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const [exchange, setExchange] = useState();
  const [linksList, setLinksList] = useState([]);
  const [chartDays, setChartDays] = useState(7);

  const linksDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/exchanges/${exchangeName}`
      );
      if (data) {
        setLoading(false);
      } else {
        setLoading(true);
      }
      let list = [
        data?.url,
        data?.facebook_url,
        data?.reddit_url,
        data?.telegram_url,
        data?.slack_url,
        data?.other_url_1,
        data?.other_url_2,
        `https://twitter.com/${data?.twitter_handle}`,
      ];
      setLinksList(list);
      setExchange(data);
    })();
  }, [exchangeName, setLoading]);

  // console.log(linksList);

  return (
    <Box mt={6}>
      <Container>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 0 },
          }}
        >
          <Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box
                component="img"
                src={exchange?.image}
                alt={exchange?.name}
                sx={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
              <Typography variant="h4" color="text.primary" mr={3}>
                {exchange?.name}
              </Typography>
            </Box>
            <Box
              mt={2}
              ml={2}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Button variant="outlined">
                Rank #{exchange?.trust_score_rank}
              </Button>
              <Button variant="outlined" startIcon={<VerifiedIcon />}>
                {exchange?.trust_score}/10
              </Button>
              <Button variant="outlined" startIcon={<LocationOnIcon />}>
                {exchange?.country}
              </Button>

              <Button variant="outlined">
                Since {exchange?.year_established}
              </Button>
            </Box>

            <Button variant="normal" sx={{ mt: 2 }} onClick={linksDrop}>
              <LinkIcon /> Links
            </Button>
            <Explorers
              handleClose={handleClose}
              anchorEl={anchorEl}
              data={linksList}
              name="exchange"
            />
          </Box> 
          <Box>
            <Typography variant="body1" color="text.secondary">
              Volume (24h)
            </Typography>
            <Typography variant="h4" color="text.primary">
              {Math.round(exchange?.trade_volume_24h_btc).toLocaleString()} BTC
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <ChartDays chartDays={chartDays} setChartDays={setChartDays} />
        </Box>
        <Divider color="text.secondary" sx={{ mt: 1 }} />
        <ExchangeChart chartDays={chartDays} exchangeName={exchangeName} />

        <ExchangeTickers />
      </Container>
    </Box>
  );
};

export default Exchange;
