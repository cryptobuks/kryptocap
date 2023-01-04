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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { Link } from "react-router-dom";
import { Button, Container } from "@mui/material";

import { ClipLoad, BarLoad } from "../components/Loader";
import Heading from "../components/Heading";
// import Loader from "../components/Loader";
import CurrencyTableChart from "../components/CurrencyTableChart";

const StyledHashLink = styled(Link)({
  textDecoration: "none",
});

const headCells = [
  {
    id: "index",
    numeric: false,
    disablePadding: true,
    label: "id",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "current_price",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "price_change_percentage_24h_in_currency",
    numeric: true,
    disablePadding: false,
    label: "24h %",
  },
  {
    id: "price_change_percentage_7d_in_currency",
    numeric: true,
    disablePadding: false,
    label: "7d %",
  },
  {
    id: "price_change_percentage_30d_in_currency",
    numeric: true,
    disablePadding: false,
    label: "30d %",
  },
  {
    id: "market_cap",
    numeric: true,
    disablePadding: false,
    label: "Market Cap",
  },
  {
    id: "total_volume",
    numeric: true,
    disablePadding: false,
    label: "Volume 24h",
  },
  {
    id: "circulating_supply",
    numeric: true,
    disablePadding: false,
    label: "Circulating Supply",
  },
  {
    id: "Last7d",
    numeric: true,
    disablePadding: false,
    label: "Last 7d",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  //   console.log(order, orderBy, "orderBy");
  return (
    <TableHead stickyheader="true" sx={{ backgroundColor: "primary.main" }}>
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
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
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
    return a[1] - b[1];
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
  height: "50px",
  display: "flex",
  justifyContent: "center",
};
const borderstyle = {
  border: "2px solid #8b8b8b2b",
  padding: "10px",
  minHeight: "50px",
};

const Cryptocurrencies = ({ currencySymbol, currency }) => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [dense, setDense] = React.useState(false);
  const [data, setData] = useState([]);
  const [sliceLength, setsliceLength] = useState(20);
  const [loading, setLoading] = useState(true);
  const [loadingCircle, setLoadingCircle] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let { data } = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?per_page=${sliceLength}&page=1&order=market_cap_desc&vs_currency=${currency}&price_change_percentage=24h,7d,30d&sparkline=true`
        );
        if (data) {
          setLoading(false);
        } else {
          setLoading(true);
        }
        data = data.map((item, i) => {
          return {
            index: i + 1,
            ...item,
          };
        });
        setData(data);
      } catch (error) {
        console.log(error);
      }
    })();

    if (sliceLength > 20) {
      setLoadingCircle(false);
    }
  }, [currency, sliceLength]);

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
    setTimeout(() => setsliceLength(sliceLength + 20), 1500);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="xl">
        <Heading text="CRYPTOCURRENCIES" />

        <Paper sx={{ width: "100%", my: 2 }}>
          {loading ? (
            <BarLoad loading={loading} />
          ) : (
            <Box>
              <TableContainer
                sx={{
                  overflowX: "scroll",
                  maxHeight: 500,
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
                    {stableSort(data, getComparator(order, orderBy))?.map(
                      ({
                        name,
                        id,
                        coin_id,
                        price_change_24h,
                        symbol,
                        market_cap,
                        circulating_supply,
                        image,
                        current_price,
                        price_change_percentage_24h_in_currency,
                        price_change_percentage_30d_in_currency,
                        price_change_percentage_7d_in_currency,
                        total_volume,
                        index,
                      }) => {
                        const isItemSelected = isSelected(name);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          <TableRow
                            sx={{
                              backgroundColor: "primary.main",
                            }}
                            hover
                            //   onClick={(event) => handleClick(event, row.name)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={id}
                            selected={isItemSelected}
                          >
                            <StyledTableCell
                              // component="th"
                              id={labelId}
                              // scope="row"
                            >
                              <StyledHashLink
                                key={coin_id}
                                to={`/currency/${id}`}
                              >
                                <Box style={borderstyle}>
                                  <Typography>{index}</Typography>
                                </Box>
                              </StyledHashLink>
                            </StyledTableCell>

                            <StyledTableCell>
                              <StyledHashLink
                                key={coin_id}
                                to={`/currency/${id}`}
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  style={borderstyle}
                                >
                                  <Box
                                    sx={{
                                      // color: "white",
                                      // width: "20px",
                                      // height: "20px",
                                      // borderRadius: "50px",
                                      // // backgroundColor: "white",
                                      mr: "5px",
                                    }}
                                  >
                                    <img
                                      src={image}
                                      alt=""
                                      width="20"
                                      height="20"
                                    />
                                  </Box>
                                  <Typography variant="subtitle2">
                                    {name} {symbol.toUpperCase()}
                                  </Typography>
                                </Box>
                              </StyledHashLink>
                            </StyledTableCell>
                            <StyledTableCell>
                              <StyledHashLink
                                key={coin_id}
                                to={`/currency/${id}`}
                              >
                                <Typography
                                  variant="subtitle2"
                                  style={borderstyle}
                                >
                                  {currencySymbol ?? ""}{" "}
                                  {current_price?.toLocaleString()}
                                </Typography>
                              </StyledHashLink>
                            </StyledTableCell>
                            <StyledTableCell>
                              <StyledHashLink
                                key={coin_id}
                                to={`/currency/${id}`}
                              >
                                <Box
                                  style={borderstyle}
                                  display="flex"
                                  alignItems="center"
                                >
                                  <ArrowDropDownIcon
                                    sx={{
                                      color: "white",
                                    }}
                                  />
                                  <Typography
                                    color={
                                      price_change_percentage_24h_in_currency.toString()[0] ==
                                      "-"
                                        ? "text.sell"
                                        : "text.buy"
                                    }
                                    variant="subtitle2"
                                  >
                                    {
                                      +price_change_percentage_24h_in_currency.toFixed(
                                        3
                                      )
                                    }
                                    %
                                  </Typography>
                                </Box>
                              </StyledHashLink>
                            </StyledTableCell>
                            <StyledTableCell>
                              <StyledHashLink
                                key={coin_id}
                                to={`/currency/${id}`}
                              >
                                <Box
                                  style={borderstyle}
                                  display="flex"
                                  alignItems="center"
                                >
                                  <ArrowDropDownIcon
                                    sx={{
                                      color: "white",
                                    }}
                                  />
                                  <Typography
                                    color={
                                      price_change_percentage_7d_in_currency.toString()[0] ==
                                      "-"
                                        ? "text.sell"
                                        : "text.buy"
                                    }
                                    variant="subtitle2"
                                  >
                                    {
                                      +price_change_percentage_7d_in_currency.toFixed(
                                        3
                                      )
                                    }{" "}
                                    %
                                  </Typography>
                                </Box>
                              </StyledHashLink>
                            </StyledTableCell>
                            <StyledTableCell>
                              <StyledHashLink
                                key={coin_id}
                                to={`/currency/${id}`}
                              >
                                <Box
                                  style={borderstyle}
                                  display="flex"
                                  alignItems="center"
                                >
                                  <ArrowDropDownIcon
                                    sx={{
                                      color: "white",
                                    }}
                                  />
                                  <Typography
                                    color={
                                      price_change_percentage_30d_in_currency.toString()[0] ==
                                      "-"
                                        ? "text.sell"
                                        : "text.buy"
                                    }
                                    variant="subtitle2"
                                  >
                                    {
                                      +price_change_percentage_30d_in_currency.toFixed(
                                        3
                                      )
                                    }{" "}
                                    %
                                  </Typography>
                                </Box>
                              </StyledHashLink>
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
                                  {Math.round(total_volume)?.toLocaleString()}
                                </Typography>
                              </Box>
                            </StyledTableCell>

                            <StyledTableCell>
                              <StyledHashLink
                                key={coin_id}
                                to={`/currency/${id}`}
                              >
                                <Box style={borderstyle}>
                                  <Typography variant="subtitle2">
                                    {Math.round(circulating_supply)}{" "}
                                    {symbol.toUpperCase()}
                                  </Typography>
                                </Box>
                              </StyledHashLink>
                            </StyledTableCell>
                            <StyledTableCell>
                              <StyledHashLink
                                key={coin_id}
                                to={`/currency/${id}`}
                              >
                                <Box
                                  sx={{
                                    border: "2px solid #8b8b8b2b",
                                    maxHeight: "50px",
                                    height: "100%",
                                    width: "300px",
                                  }}
                                >
                                  <CurrencyTableChart
                                    coinName={id}
                                    value={
                                      price_change_percentage_7d_in_currency
                                    }
                                  />
                                </Box>
                              </StyledHashLink>
                            </StyledTableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            // ) : (
            //   <Box>Nothing to show</Box>
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

export default Cryptocurrencies;
