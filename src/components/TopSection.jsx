import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Avatar,
  styled,
} from "@mui/material";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const StyledHashLink = styled(Link)({
  textDecoration: "none",
});

const useStyles = makeStyles((theme) => ({
  slider: {
    px: 2,
    border: "none",
    width: "90%",
    "& .slick-arrow": {
      background: "darkgray",
      borderRadius: "50%",
      "&:hover": {
        background: "darkgray",
      },
    },
    [theme.breakpoints.down("sm")]: {},
    "& .slick-list": {
      "& .slick-track": {
        display: "flex",
        // width: "100%",
        px: 1,
        "& .slick-slide": {
          [theme.breakpoints.down("sm")]: {
            marginRight: "10px",
            height: "100%",
          },
        },
      },
    },
  },
}));

const settings = {
  arrows: true,
  dots: false,
  infinite: true,
  speed: 300,
  autoplay: true,
  slidesToShow: 6,
  slidesToScroll: 1,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};
const SingleValue = ({ text, value, ...rest }) => {
  return (
    <Box minWidth="140px" {...rest} textAlign="center">
      <Typography component="span" ml={1} variant="body1">
        {text}:
      </Typography>
      <Typography
        component="span"
        ml={0.5}
        variant="body1"
        color="text.primary"
      >
        {value}
      </Typography>
    </Box>
  );
};

const TopSection = ({ currency, currencySymbol, setLoading }) => {
  const classes = useStyles();
  const [global, setGlobal] = useState();
  const [marketCap, setMarketCap] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/global"
      );
      setMarketCap(
        Math.round(
          data.data.total_market_cap[currency.toLowerCase()]
        ).toLocaleString()
      );
      setTotalVolume(
        Math.round(
          data.data.total_volume[currency.toLowerCase()]
        ).toLocaleString()
      );
      setGlobal(data.data);
      setLoading(false);
    })();
  }, [currency, setLoading]);

  useEffect(() => {
    setLoading(true);

    (async () => {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/search/trending"
      );
      setTrending(data.coins);
    })();
    setLoading(false);
  }, [setLoading]);

  return (
    <Box mt={2}>
      <Container>
        <Box
          sx={{
            backgroundColor: "primary.main",
            border: "1px solid #1e1e1e",
            pt: 1,
            borderRadius: "20px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            overflowX: "scroll",
            "::-webkit-scrollbar": {
              width: "0px",
            },
          }}
        >
          <SingleValue
            text="Cryptos"
            value={global?.active_cryptocurrencies}
            sx={{ ml: { xs: 62, sm: 30, md: 0 } }}
          />
          <SingleValue text="Exchanges" value={global?.markets} />
          <SingleValue
            text="Market Cap"
            value={`${currencySymbol ?? ""} ${marketCap}`}
            sx={{ minWidth: "270px" }}
          />
          <SingleValue
            text="24h Vol"
            value={`${currencySymbol ?? ""} ${totalVolume}`}
            sx={{ minWidth: "250px" }}
          />
          <Typography component="span" ml={1} variant="body1">
            Dominance:
          </Typography>

          <StyledHashLink to="/currency/bitcoin">
            <Typography
              component="span"
              ml={1}
              variant="body1"
              color="text.primary"
            >
              BTC:
            </Typography>
            <Typography
              component="span"
              ml={0.5}
              variant="body1"
              color="text.primary"
            >
              {parseFloat(global?.market_cap_percentage?.btc).toFixed(1)}%
            </Typography>
          </StyledHashLink>
          <StyledHashLink to="/currency/ethereum">
            <Typography
              component="span"
              ml={1}
              variant="body1"
              color="text.primary"
            >
              ETH:
            </Typography>
            <Typography
              component="span"
              ml={0.5}
              variant="body1"
              color="text.primary"
            >
              {parseFloat(global?.market_cap_percentage?.eth).toFixed(1)}%
            </Typography>
          </StyledHashLink>
        </Box>

        <Typography
          mt={3}
          variant="body1"
          color="text.primary"
          textAlign="center"
        >
          <TrendingUpIcon style={{ verticalAlign: "-8px", color: "#b7b7b7" }} />{" "}
          Trending
        </Typography>

        <Box
          sx={{
            display: "flex",
            // gap: 1,
            // flexWrap: "wrap",
            justifyContent: "center",
            mt: 1,
          }}
        >
          <Slider {...settings} className={classes.slider}>
            {trending?.map(({ item }, i) => {
              return (
                <StyledHashLink
                  key={item.coin_id}
                  to={`/currency/${item.id}`}
                  sx={{ ml: 3 }}
                >
                  <Chip
                    sx={{ cursor: "pointer" }}
                    avatar={
                      <Avatar
                        alt={item.id}
                        src={item.thumb}
                        sx={{ backgroundColor: "text.primary" }}
                      />
                    }
                    label={item.name}
                    variant="outlined"
                  />
                </StyledHashLink>
              );
            })}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
};

export default TopSection;
