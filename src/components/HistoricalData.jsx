import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { Button, Container } from "@mui/material";
import moment from "moment/moment";

import { ClipLoad, BarLoad } from "../components/Loader";

const headCells = [
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "marketcap",
    numeric: true,
    disablePadding: false,
    label: "Market Cap",
  },
  {
    id: "volume",
    numeric: true,
    disablePadding: false,
    label: "Volumes",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead sx={{ backgroundColor: "primary.main" }}>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              style={{
                ...headerrstyle,
                ...{ minWidth: headCell.label === "id" ? "50px" : "200px" },
              }}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function descendingComparator(a, b, orderBy) {
  //   console.log(b[orderBy] < a[orderBy], b, a);
  if (b[orderBy] < a[orderBy]) {
    return 1;
  }
  if (b[orderBy] > a[orderBy]) {
    return -1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return b[1] - a[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    padding: "0px",
    borderBottom: "none",

    textAlign: "left",
    height: "30px",
  },
  [`&.${tableCellClasses.head}`]: {
    padding: "0px",
    borderBottom: "none",
    variant: "subtitle2",
    textAlign: "center",
  },
}));

const headerrstyle = {
  background: "#008AFF",
  padding: "5px",
  color: "white",
  width: "100%",
  minWidth: "200px",
  minHeight: "50px",
  display: "flex",
  justifyContent: "center",
};
const borderstyle = {
  border: "2px solid #8b8b8b2b",
  padding: "10px",
  minHeight: "50px",
};

const HistoricalData = ({ selectedCurrency, coinName, currencySymbol }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [historyData, setHistoryData] = useState([]);
  const [sliceLength, setsliceLength] = useState(10);
  const [loading, setLoading] = useState(true);
  const [loadingCircle, setLoadingCircle] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        let { data } = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinName}/market_chart?vs_currency=${selectedCurrency}&days=${sliceLength}`
        );

        if (data) {
          setLoading(false);
        } else {
          setLoading(true);
        }

        let newData = await data?.prices.map((item, i) => {
          return {
            date: item[0],
            price: item[1],
            market_cap: data?.market_caps[i][1],
            volume: data?.total_volumes[i][1],
          };
        });
        setHistoryData(newData);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
    if (sliceLength > 10) {
      setLoadingCircle(false);
    }
  }, [coinName, selectedCurrency, sliceLength]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleclick = () => {
    if (sliceLength >= 9000) {
      return;
    }
    setLoadingCircle(true);

    setTimeout(() => {
      setsliceLength(sliceLength + 10);
    }, 1500);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="xl">
        <Paper sx={{ width: "100%", my: 2 }}>
          {loading ? (
            <BarLoad loading={loading} />
          ) : (
            <Box>
              <TableContainer
                sx={{
                  maxHeight: 500,
                  overflowX: "scroll",
                  "::-webkit-scrollbar": {
                    width: "0px",
                    height: "0px",
                  },
                  border: "none",
                }}
              >
                <Table
                  stickyHeader
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={dense ? "small" : "medium"}
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody sx={{ backgroundColor: "primary.main" }}>
                    {stableSort(
                      historyData,
                      getComparator(order, orderBy)
                    )?.map(({ date, price, market_cap, volume }, index) => {
                      return (
                        <TableRow
                          sx={{
                            backgroundColor: "primary.main",
                          }}
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          <StyledTableCell>
                            <Box style={borderstyle}>
                              <Typography variant="subtitle2">
                                {moment(date).format("MMMM Do YYYY")}
                              </Typography>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Box style={borderstyle}>
                              <Typography variant="subtitle2">
                                {currencySymbol ?? ""}{" "}
                                {price.toFixed(1)?.toLocaleString()}
                              </Typography>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Box style={borderstyle}>
                              <Typography variant="subtitle2">
                                {currencySymbol ?? ""}{" "}
                                {Math.round(market_cap)?.toLocaleString()}
                              </Typography>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Box style={borderstyle}>
                              <Typography variant="subtitle2">
                                {currencySymbol ?? ""}{" "}
                                {Math.round(volume)?.toLocaleString()}
                              </Typography>
                            </Box>
                          </StyledTableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
        <Button
          disableRipple={false}
          variant="tableButton"
          onClick={handleclick}
        >
          {loadingCircle ? <ClipLoad loading={loadingCircle} /> : "Load More"}
        </Button>
      </Container>
    </Box>
  );
};

export default HistoricalData;
