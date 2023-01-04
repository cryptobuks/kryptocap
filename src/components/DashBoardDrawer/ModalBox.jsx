import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, styled, Button } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import "./Modal.css";
import { modalBox } from "./Modalmeta";

const Radiotextfield = styled(Radio)(() => ({
  "&.Mui-checked": {
    color: "#636363 !important",
  },
}));

function ModalBox({ modalstate, currencystate }) {
  const [currencyname, setCurrencyState] = useState(
    localStorage.getItem("GeckoClient:vs_currency")
  );
  const [symbolstate, setSymbolstate] = useState(
    localStorage.getItem("currencysymbol")
  );
  // ......Close Modal Box use custom .........
  let menuref = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuref.current.contains(e.target)) {
        modalstate(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  // .......useEffct use for local Storage currency....
  useEffect(() => {
    if (localStorage.getItem("GeckoClient:vs_currency")) {
      localStorage.setItem(
        "GeckoClient:vs_currency",
        currencyname.toLowerCase()
      );
      currencystate(currencyname);
    }
  }, [currencyname, currencystate]);

  // ...........useEffect use for currecny symbolstate...............
  useEffect(() => {
    if (localStorage.getItem("currencysymbol")) {
      // localStorage.removeItem("currencysymbol");
      localStorage.setItem("currencysymbol", symbolstate);
    }
  }, [symbolstate]);
  return (
    <Box
      ref={menuref}
      sx={{
        width: "380px",
        borderRadius: "25px",
        backgroundColor: "primary.main",
        zIndex: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "39%",
        left: "45%",
        transform: "translate(-50%,-50%)",
        transition: " 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        border: "1px solid #32241A",
        py: 1,
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography
          sx={{
            p: 2,
            color: "text.primary",
            borderBottom: "1px solid #00bdff21",
            fontSize: "20px",
          }}
        >
          Select Currency
        </Typography>

        <FormControl
          className="Modalbox"
          sx={{
            width: "100%",
            height: "300px",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(e) => {
              setCurrencyState(e.target.value);
            }}
          >
            {modalBox.map(({ text, value, symbol, index }) => {
              return (
                <Button
                  key={text + index}
                  sx={{
                    display: "inline-block",
                    minHeight: 0,
                    minWidth: 0,
                    padding: 0,
                    backgroundColor: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  }}
                  //  onClick={()=>{
                  //       symbol && setSymbolstate(symbol)
                  //     }}
                >
                  <FormControlLabel
                    className="modal"
                    sx={{
                      fontSize: "10px",
                      color: "white",
                      width: "100%",
                      ml: 2,
                    }}
                    value={value}
                    control={
                      <Radiotextfield
                        checked={
                          value?.toLowerCase()?.trim() ==
                          currencyname?.toLowerCase()?.trim()
                            ? true
                            : false
                        }
                        sx={{ borderColor: "lightgray", color: "#636363" }}
                      />
                    }
                    label={text}
                  />
                </Button>
              );
            })}
          </RadioGroup>
        </FormControl>

        <Typography
          sx={{
            p: 1,
            ml: 1,
            borderTop: "1px solid #32241A",
            color: "text.primary",
            fontSize: "20px",
            cursor: "pointer",
          }}
          onClick={() => {
            modalstate(false);
          }}
        >
          Close
        </Typography>
      </Box>
    </Box>
  );
}

export default ModalBox;
