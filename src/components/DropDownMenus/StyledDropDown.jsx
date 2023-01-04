import { styled, Menu } from "@mui/material";

const StyledMenu = styled((props) => (
  <Menu
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    minWidth: 140,
    color: "#fff",
    background: "#0c0c0c",

    "& .MuiMenu-list": {
      padding: "4px 0",
      background: theme.palette.primary.main,
    },
  },
}));
export default StyledMenu;
