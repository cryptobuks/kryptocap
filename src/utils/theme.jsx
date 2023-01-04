import { createTheme } from "@mui/material";

export const dark_theme = createTheme({
  typography: {
    allVariants: {
      color: "#b7b7b7",
    },
    h6: {
      fontSize: "18px",
      fontWeight: "600",
    },
  },
  palette: {
    primary: {
      main: "#0c0c0c",
      secondary: "#161313",
      // button: "",
      //   tertiary: "",
    },
    // hoverBtn: {
    //   main: "",
    //   secondary: "",
    //   button: "",
    // },
    text: {
      primary: "#ffffff",
      secondary: "#b7b7b7",
      active: "#2196F3",
      buy: "#4CAF50",
      sell: "#F44336",
      moderate: "#FB8C00",
    },
  },
  img: {
    maxWidth: "100%",
    height: "auto",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
          body {
            background : #0c0c0c;
          }
        `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // color: "#b7b7b7",
        },
      },
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            borderColor: "#b7b7b7",
            fontSize: "12px",
            color: "#b7b7b7",
            padding: "2px 5px",
            "&:hover": {
              color: "#b7b7b7",
              borderColor: "#b7b7b7",
            },
          },
        },
        {
          props: { variant: "normal" },
          style: {
            color: "#b7b7b7",
            padding: "2px 5px",
          },
        },
        {
          props: { variant: "tabs" },
          style: {
            color: "#b7b7b7",
            py: 1,
            px: 2,
            backgroundColor: "#161313",
            cursor: "pointer",
          },
        },
        {
          props: { variant: "tableButton" },
          style: {
            width: "100%",
            textAlign: "center",
            backgroundColor: "black",
            margin: "10px 0",
            color: "white",
            borderRadius: "none",
            "&:hover": {
              backgroundColor: "#000",
            },
          },
        },
      ],
    },
  },
});

export const light_theme = createTheme({
  typography: {
    allVariants: {
      color: "#171924",
    },
    h6: {
      fontSize: "18px",
      fontWeight: "600",
    },
  },
  palette: {
    primary: {
      main: "#fff",
      secondary: "#F0F6FF",
      // button: "",
      //   tertiary: "",
    },
    // hoverBtn: {
    //   main: "",
    //   secondary: "",
    //   button: "",
    // },
    text: {
      primary: "#0c0c0c",
      secondary: "#171924",
      active: "#2196F3",
      buy: "#4CAF50",
      sell: "#F44336",
      moderate: "#FB8C00",
    },
  },
  img: {
    maxWidth: "100%",
    height: "auto",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
          body {
            background : #fff;
          }
        `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // color: "#b7b7b7",
        },
      },
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            borderColor: "#171924",
            fontSize: "12px",
            color: "#171924",
            padding: "2px 5px",
            "&:hover": {
              color: "#171924",
              borderColor: "#171924",
            },
          },
        },
        {
          props: { variant: "normal" },
          style: {
            color: "#171924",
            padding: "2px 5px",
          },
        },
        {
          props: { variant: "tabs" },
          style: {
            color: "#171924",
            py: 1,
            px: 2,
            // backgroundColor: "#2196F3",
            cursor: "pointer",
          },
        },
        {
          props: { variant: "tableButton" },
          style: {
            width: "100%",
            textAlign: "center",
            backgroundColor: "#fff",
            margin: "10px 0",
            color: "#0c0c0c",
            borderRadius: "none",
            "&:hover": {
              backgroundColor: "#fff",
            },
          },
        },
      ],
    },
  },
});
