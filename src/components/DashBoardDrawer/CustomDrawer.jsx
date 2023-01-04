import React, { useEffect, useRef } from "react";
import { Box, Typography, styled } from "@mui/material";
import { makeStyles } from "@mui/styles";
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
import MuiDrawer from "@mui/material/Drawer";
import IntMarket from "./assets/logo.png";
import { useNavigate, NavLink } from "react-router-dom";

const drawerWidth = 260;
const openedMixin = (theme) => ({
  width: drawerWidth,
  background: "#2E2F42",
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
const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  paper: {
    background: "#252034 !important",
  },
});

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
// active and Inactive link
const styledactivelink = ({ isActive }) => {
  return {
    backgroundColor: isActive ? "#00D9AC" : "#00d9ac00",
    textDecoration: "none",
  };
};
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  background: "#2E2F42",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
const CustomDrawer = ({ openstate }) => {
  const [open, setOpen] = React.useState(openstate);
  let menuref = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!menuref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  return (
    <Drawer
      variant="permanent"
      className="side_drawer"
      open={open}
      ref={menuref}
      sx={{
        background: "primary.mian",
        position: "absolute",
        top: "0px",
      }}
    >
      <Box
        height={"100%"}
        sx={{
          background: "primary.mian",
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
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  minHeight: "30px",
                  borderBottom: "1px solid #32241A",
                  textAlign: "center",
                  py: 0.5,
                }}
              >
                <Typography
                  sx={{
                    color: "#898989",
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
                    color: "white",
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
  );
};

export default CustomDrawer;