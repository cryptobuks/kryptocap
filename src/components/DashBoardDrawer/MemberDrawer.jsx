import { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  useMediaQuery,
  Button,
  Box,
  Toolbar,
  CssBaseline,
  IconButton,
  styled,
  TextField,
  Autocomplete,
  AppBar as MuiAppBar,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MuiDrawer from "@mui/material/Drawer";
import PropTypes from "prop-types";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";
import RedditIcon from "@mui/icons-material/Reddit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

import ModalBox from "./ModalBox";
import IntMarket from "./assets/logo.png";
import "./Dropdown.css";
import CustomDrawer from "./CustomDrawer";

const drawerWidth = 260;
const openedMixin = (theme) => ({
  width: drawerWidth,
  background: theme.palette.primary.main,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),

  display: "block",
  transitionProperty: "display",
  transitionDuration: "200s",
  transitionTimingFunction: "linear",
  transitionDelay: "0s",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  display: "none",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Autocompletege = styled(Autocomplete)(({ theme }) => ({
  "& .MuiAutocomplete-inputFocused": {
    border: "none",
    outline: "none",
  },
  "& .css-rwpby0-MuiListSubheader-root-MuiAutocomplete-groupLabel": {
    backgroundColor: theme.palette.primary.main,
  },
  // "& .MuiPaper-root ": {
  //   backgroundColor: "black !important",
  //   color: "white !important",
  // },
  // "& .MuiAutocomplete-paper ": {
  //   backgroundColor: "black !important",
  //   color: "white !important",
  // },
}));

const sidebardata = [
  {
    text: "Cryptocurrencies",
    Icons: <HistoryToggleOffIcon />,
    link: "/",
  },
  {
    text: "Exchanges",
    Icons: <SwapVertIcon />,
    link: "/exchanges",
  },
  {
    text: "Derivatives",
    Icons: <HistoryToggleOffIcon />,
    link: "/derivatives",
  },
  {
    text: "Term of service",
    Icons: <ContentCopyIcon />,
  },
  {
    text: "Privacy Policy",
    Icons: <HistoryToggleOffIcon />,
  },
  {
    text: "Cookies policy",
    Icons: <AdminPanelSettingsIcon />,
  },
  {
    text: "Facebook",
    Icons: <FacebookIcon />,
  },
  {
    text: "Twitter",
    Icons: <TwitterIcon />,
  },
  {
    text: "Youtube",
    Icons: <YouTubeIcon />,
  },
  {
    text: "Github",
    Icons: <GitHubIcon />,
  },
  {
    text: "Reddit",
    Icons: <RedditIcon />,
  },
  {
    text: "setting",
    Icons: <SettingsIcon />,
  },
];

// ....Change color active and Inactive links......
const styledactivelink = ({ isActive }) => {
  return {
    backgroundColor: isActive ? "#00D9AC" : "#00d9ac00",
    textDecoration: "none",
  };
};
// .........Appbar styled ...........

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `100%`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// ..........This styled for drawer.........
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  background: "theme.palette.primary.main",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer(props) {
  const navigate = useNavigate();
  const matches = useMediaQuery("(max-width:700px)");
  const { children, setCurrencystate, currency } = props;

  const [open, setOpen] = useState(false);
  const [modalopen, setModalstate] = useState(false);
  const [exchange, setExchangestate] = useState([]);
  const [coinsdata, setCoinstate] = useState([]);
  const [filtercoinstate, setFiltercoinstate] = useState([]);
  const [filterexchangestate, setFilterExchangestate] = useState([]);
  const [targetstate, setTargetstate] = useState("");
  let options;

  useEffect(() => {
    const fetchdata = async () => {
      const url = `https://localstorage.one/crypto/data/search.json`;
      try {
        let {
          data: { coins, exchanges },
        } = await axios.get(url);
        coins = coins.map((item) => {
          return {
            id: item[0],
            symbol: item[1],
            name: item[2],
            image: item[3],
            group: "currencies",
          };
        });

        exchanges = exchanges.map((item) => {
          return {
            id: item[0],
            name: item[1],
            image: item[2],
            group: "exchange",
          };
        });
        setCoinstate(coins);
        setExchangestate(exchanges);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchdata();
  }, []);

  // we are use uesEffct for navigate from one component to another compoent

  // .........Filter value from object of Array............
  const filterhandler = (event, value) => {
    const coinfiltervalue = coinsdata.filter(
      (items) =>
        items.id?.toLowerCase().includes(value.id?.toLowerCase().trim()) ||
        items.symbol
          ?.toLowerCase()
          .includes(value.symbol?.toLowerCase().trim()) ||
        items.name?.toLowerCase().includes(value.name?.toLowerCase().trim())
    );

    const exchangeFilter = exchange.filter(
      (items) =>
        items.id.toLowerCase().includes(value.id.toLowerCase().trim()) ||
        items.name.toLowerCase().includes(value.name.toLowerCase().trim())
    );
    setFiltercoinstate(coinfiltervalue);
    setFilterExchangestate(exchangeFilter);
    setTargetstate(value);

    if (value.group.toLowerCase().trim() === "exchange") {
      navigate(`/exchange/${value.id}`);
    } else {
      navigate(`/currency/${value.id}`);
    }
  };
  // ......Input type target value and set filter method...........
  const InputHandler = (e) => {
    const value = e.target.value;
    const coinfiltervalue = coinsdata.filter(
      (items) =>
        items.id.toLowerCase().includes(value.toLowerCase().trim()) ||
        items.symbol.toLowerCase().includes(value.toLowerCase().trim()) ||
        items.name.toLowerCase().includes(value.toLowerCase().trim())
    );

    const exchangeFilter = exchange.filter(
      (items) =>
        items.id.toLowerCase().includes(value.toLowerCase().trim()) ||
        items.name.toLowerCase().includes(value.toLowerCase().trim())
    );
    setFiltercoinstate(coinfiltervalue);
    setFilterExchangestate(exchangeFilter);
    setTargetstate(value);
  };

  // ........Grouped autocomplete data..........
  if (typeof targetstate === "object" || targetstate != "") {
    options = [
      ...filtercoinstate.slice(0, 10),
      ...filterexchangestate.slice(0, 10),
    ];
  } else {
    options = [...coinsdata.slice(0, 10), ...exchange.slice(0, 10)];
  }

  return (
    <>
      <Box className="MemberDrawer">
        <Box sx={{ display: "flex", zIndex: 4 }}>
          <CssBaseline />
          <AppBar
            sx={{
              backgroundColor: "primary.main",
              zIndex: 4,
              width: matches
                ? "null"
                : open
                ? `calc(100% - ${drawerWidth}px)`
                : "100%",
            }}
            position="fixed"
            open={open}
          >
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { md: "space-between", xs: "flex-start" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Box>
                  <MenuIcon
                    sx={{ cursor: "pointer", color: "text.secondary" }}
                    onClick={() => {
                      setOpen(!open);
                    }}
                  />
                </Box>
                {!open && (
                  <Box sx={{ py: 0.5, display: { md: "block", xs: "none" } }}>
                    <NavLink to="/">
                      <img
                        src={IntMarket}
                        alt="IntMarket"
                        style={{
                          width: "180px",
                          height: "30px",
                          marginLeft: "20px",
                          marginTop: "5px",
                        }}
                      />{" "}
                    </NavLink>
                  </Box>
                )}
              </Box>
              {/* ..........Start here Search input........... */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { md: "flex-end", xs: "center" },
                  ml: { xs: 4 },
                }}
              >
                <Stack
                  sx={{
                    display: "flex",
                    justifyContent: { md: "flex-end", xs: "center" },
                    alignItems: "center",
                    // ml: { md: 0, xs: 2 },
                    width: "50%",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #32241A",
                      borderRadius: "20px",
                      p: 0.5,
                    }}
                  >
                    <SearchIcon
                      style={{
                        fontSize: "32px",
                        cursor: "pointer",
                        padding: "7px",
                        color: "text.secondary",
                        marginTop: "3px",
                      }}
                    />
                    {/* .........Autocomplete component........ */}
                    <Autocompletege
                      id="grouped-demo"
                      disablePortal={true}
                      sx={{
                        position: "relative",
                        width: { md: "530px", xs: "250px" },

                        padding: "0px",
                        color: "text.primary",

                        "& .MuiAutocomplete-popupIndicator": {
                          color: "text.secondary",
                        },
                        "& .MuiAutocomplete-clearIndicator": {
                          color: "text.secondary",
                        },
                        "& .MuiAutocomplete-root": {
                          backgroundColor: "primary.main",
                          // color: "#fff"
                          "&:hover": {
                            border: "none !important",
                            ouline: "none !important",
                          },
                        },
                      }}
                      options={options}
                      groupBy={(option) => option.group}
                      onChange={filterhandler}
                      getOptionLabel={(option) => option.name}
                      renderOption={(props, option) => (
                        <Box
                          // component="li"
                          sx={{
                            color: "text.primary",
                            fontSize: "14px",
                            backgroundColor: "primary.main",
                            borderBottom: "1px solid #32241A",
                            outline: "none",
                            "&:hover": {
                              outline: "none",
                              // backgroundColor: "#a5a5a5",
                            },
                            "& > img": { mr: 2, flexShrink: 0 },
                          }}
                          {...props}
                        >
                          <Box sx={{ borderRadius: "50%", mr: 2 }}>
                            <img
                              loading="lazy"
                              width="35px"
                              height="35px"
                              src={option.image}
                              srcSet={option.image}
                              alt=""
                            />
                          </Box>
                          {option.name.toUpperCase()}
                          <br />{" "}
                          {option.symbol ? option.symbol.toUpperCase() : null}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          sx={{
                            height: "25px",
                            mt: -0.5,
                            position: "relative",
                            backgroundColor: "primary.main",
                            "& .MuiOutlinedInput-root": {
                              padding: "0px !important",
                            },
                            "& fieldset": {
                              border: "none !important",
                              outline: "none",
                            },
                          }}
                          {...params}
                          onChange={InputHandler}
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password",
                          }}
                          placeholder="Search...."
                        />
                      )}
                    />
                  </Box>
                </Stack>

                <Box
                  sx={{
                    display: "flex",
                    // justifyContent: "space-evenly",
                    alignItems: "center",
                    // borderRadius: "2px",
                  }}
                >
                  <Button
                    sx={{
                      color: "text.primary",
                      height: "36px",
                      // minWidth: "64px",
                      padding: "5px 16px",
                      display: { md: "block", xs: "none" },
                    }}
                    onClick={() => {
                      setModalstate(!modalopen);
                    }}
                  >
                    {currency}
                  </Button>
                  <IconButton
                    sx={{ ml: 1 }}
                    onClick={() => props.setLightMode(!props.lightMode)}
                    color="inherit"
                  >
                    {props.lightMode ? (
                      <Brightness4Icon />
                    ) : (
                      <Brightness7Icon />
                    )}
                    {/* <Brightness4Icon /> */}
                  </IconButton>
                </Box>
              </Box>
            </Toolbar>
          </AppBar>
          {/* .........The end of appbar........... */}
          {/*         
   ..........Drawer of sidebar on Laptop view.......... */}
          {matches ? (
            open && <CustomDrawer openstate={open} />
          ) : (
            <Drawer variant="permanent" className="side_drawer" open={open}>
              <Box
                height={"100%"}
                sx={{
                  background: "primary.main",
                }}
              >
                <Box sx={{ borderBottom: "1px solid #32241A", py: 0.5 }}>
                  <img
                    src={IntMarket}
                    alt="IntMarket"
                    style={{
                      width: "170px",
                      height: "30px",
                      marginLeft: "10px",
                      marginTop: "5px",
                    }}
                  />
                </Box>
                {sidebardata.map(({ text, Icons, link }, i) => {
                  return (
                    <NavLink
                      key={text + i}
                      to={`${link}`}
                      style={styledactivelink}
                      sx={{ textDecoration: "none" }}
                    >
                      <Box
                        key={text + i}
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          minHeight: "30px",
                          borderBottom: "1px solid #32241A",
                          textAlign: "center",
                          py: 0.5,
                          cursor: "pointer",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "text.secondary",
                            ml: 0.5,
                            mt: 0.5,
                            fontSize: "24px",
                          }}
                        >
                          {Icons}
                        </Typography>
                        <Typography
                          sx={{
                            textTransform: "uppercase",
                            color: "text.primary",
                            fontSize: "14px",
                            lineHheight: "1rem",
                            fontWeight: 500,
                            ml: 4,
                          }}
                        >
                          {text}
                        </Typography>
                      </Box>
                    </NavLink>
                  );
                })}
              </Box>
            </Drawer>
          )}

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: {
                xs: "100%",
                sm: `calc(100% - ${drawerWidth}px)`,
                md: `calc(100% - ${drawerWidth}px)`,
              },
              height: "100%",
              zindex: "1 !important",
            }}
          >
            <Toolbar />
            {children}
          </Box>
        </Box>
      </Box>

      {/* ......Modal Box start here......... */}
      {modalopen && (
        <ModalBox modalstate={setModalstate} currencystate={setCurrencystate} />
      )}
    </>
  );
}
MiniDrawer.propTypes = { window: PropTypes.func };
