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
import { Container } from "@mui/system";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";

import { ClipLoad, BarLoad } from "../components/Loader";

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

const headCells = [
  {
    id: "market.name",
    numeric: true,
    disablePadding: false,
    label: "Exchange",
  },
  {
    id: "target, base",
    numeric: true,
    disablePadding: false,
    label: "Pair",
  },
  {
    id: "converted_last",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "volume",
    numeric: true,
    disablePadding: false,
    label: "Volume",
  },
  {
    id: "bid_ask_spread_percentage",
    numeric: true,
    disablePadding: false,
    label: "Spread",
  },
  {
    id: "trust_score",
    numeric: true,
    disablePadding: false,
    label: "Trust",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  //   console.log(order, orderBy, "orderBy");
  return (
    <TableHead sx={{ backgroundColor: "primary.main" }}>
      <TableRow>
        {headCells.map((headCell, i) => (
          <StyledTableCell
            key={headCell.id + i}
            // align={headCell.numeric ? "left" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              style={headerrstyle}
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

const borderstyle = {
  border: "2px solid #8b8b8b2b",
  padding: "10px",
  minHeight: "50px",
};
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
    // textAlign: "left",
  },
}));

const Market = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [exchangdata, setexchangdata] = useState();
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sliceLength, setsliceLength] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingCircle, setLoadingCircle] = useState(false);

  const { coinName } = useParams();

  const handleclick = () => {
    if (sliceLength >= 9000) {
      return;
    }
    setLoadingCircle(true);

    setTimeout(() => {
      setsliceLength(sliceLength + 1);
    }, 1500);
  };

  useEffect(() => {
    const cwApidata = async () => {
      try {
        let { data } = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinName}/tickers?include_exchange_logo=true&per_page=100&page=${sliceLength}&order=volume_desc`
        );

        if (data) {
          setLoading(false);
        } else {
          setLoading(true);
        }
        let { tickers } = data;

        if (exchangdata) {
          let newData = [...exchangdata, ...tickers];
          newData = newData.map((item, i) => {
            return {
              index: i + 1,
              ...item,
            };
          });
          setexchangdata(newData);
        } else {
          tickers = tickers.map((item, i) => {
            return {
              index: i + 1,
              ...item,
            };
          });
          setexchangdata(tickers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    cwApidata();
    if (sliceLength > 1) {
      setLoadingCircle(false);
    }
  }, [coinName, sliceLength]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.

  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="xl">
        <Paper sx={{ width: "100%", mb: 2 }}>
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
                    {stableSort(exchangdata, getComparator(order, orderBy))
                      // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      ?.map(
                        (
                          {
                            market,
                            target,
                            base,
                            volume,
                            bid_ask_spread_percentage,
                            trust_score,
                            converted_last,
                            index,
                          },
                          i
                        ) => {
                          const isItemSelected = isSelected(market?.name);
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              key={market?.name + i}
                              sx={{ backgroundColor: "primary.main" }}
                              hover
                              //   onClick={(event) => handleClick(event, row.name)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              selected={isItemSelected}
                            >
                              {/* <StyledTableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {1 + index}
                            </StyledTableCell> */}
                              <StyledTableCell
                                // align="left !important"
                                id={labelId}
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
                                      // backgroundColor: "white",
                                      mr: "5px",
                                    }}
                                  >
                                    <img
                                      src={market?.logo}
                                      alt=""
                                      width="20"
                                      height="20"
                                    />
                                  </Box>
                                  <Typography>{market?.name}</Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell
                              // align="left"
                              >
                                <Box
                                  style={borderstyle}
                                  align="left"
                                  display="flex"
                                  alignItems="center"
                                  // sx={{
                                  //   textOverflow: "ellipsis",
                                  //   overflowX: "hidden",
                                  //   whiteSpace: "nowrap",
                                  // }}
                                >
                                  <Typography
                                    color="text.active"
                                    sx={{
                                      whiteSpace: "nowrap",
                                      width: "150px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {base}/{target}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell
                              // align="left"
                              >
                                <Box style={borderstyle} align="right">
                                  <Typography
                                    sx={{
                                      whiteSpace: "nowrap",
                                      width: "150px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {converted_last?.usd} {target}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell
                              // align="left"
                              >
                                <Box style={borderstyle} align="right">
                                  <Typography
                                    sx={{
                                      whiteSpace: "nowrap",
                                      width: "150px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {Math.round(volume)?.toLocaleString()}{" "}
                                    {base}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell
                              // align="left"
                              >
                                <Box style={borderstyle} align="right">
                                  <Typography>
                                    {+bid_ask_spread_percentage?.toFixed(3)} %
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell
                              // align="left"
                              >
                                <Box style={borderstyle} align="right">
                                  <Box
                                    px="5px"
                                    width="fit-content"
                                    backgroundColor={
                                      (trust_score === "green" && "text.buy") ||
                                      (trust_score === "yellow" &&
                                        "text.moderate") ||
                                      (trust_score === "red" && "text.sell")
                                    }
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    borderRadius={"20px"}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      color="white"
                                      sx={{ px: 1.5 }}
                                    >
                                      {trust_score === "green" && "High"}
                                      {trust_score === "yellow" && "Moderate"}
                                      {trust_score === "red" && "Low"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </StyledTableCell>
                            </TableRow>
                          );
                        }
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
        {/* {exchangdata.length === 100 ? null : ( */}
        <Button
          disableRipple={false}
          variant="tableButton"
          onClick={handleclick}
        >
          {loadingCircle ? <ClipLoad loading={loadingCircle} /> : "Load More"}
        </Button>
        {/* )} */}
      </Container>
    </Box>
  );
};

export default Market;
