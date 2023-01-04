import { styled, InputBase, Tabs, Tab, Box } from "@mui/material";

export const TextInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    position: "relative",
    borderRadius: "10px",
    color: theme.palette.text.primary,
    width: "150px",
    backgroundColor: "transparent",
    fontSize: "18px",
    padding: "5px",
    "&::-webkit-outer-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "&::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
  },
}));

export const AntTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    borderBottom: "1px solid #2196F3",
  },
});

export const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    color: theme.palette.text.secondary,
    borderRadius: "20px",
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.secondary,
    },
  })
);

export function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
