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
import { Button, Container } from "@mui/material";

import Heading from "../components/Heading";
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

const borderstyle = {
  border: "2px solid #8b8b8b2b",
  padding: "10px",
  maxHeight: "50px",
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
    variant: "subtitle2",
    textAlign: "center",
  },
}));

const Derivatives = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [derivativedata, setderivativedata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCircle, setLoadingCircle] = useState(false);

  const getData = async () => {
    try {
      let { data } = await axios.get(
        "https://api.coingecko.com/api/v3/derivatives"
      );
      setderivativedata(data);
      if (data) {
        setLoading(false);
      } else {
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    if (rowsPerPage > 10) {
      setLoadingCircle(false);
    }
  }, [rowsPerPage]);

  const headCells = [
    {
      id: "market",
      numeric: true,
      disablePadding: false,
      label: "Market",
    },

    {
      id: "symbol",
      numeric: true,
      disablePadding: false,
      label: "Symbol",
    },
    {
      id: "price",
      numeric: true,
      disablePadding: false,
      label: "Price",
    },
    {
      id: "price_percentage_change_24h",
      numeric: true,
      disablePadding: false,
      label: "24h %",
    },
    {
      id: "contract_type",
      numeric: true,
      disablePadding: false,
      label: "Type",
    },
    {
      id: "index",
      numeric: true,
      disablePadding: false,
      label: "Index Price",
    },
    {
      id: "basis",
      numeric: true,
      disablePadding: false,
      label: "Basis",
    },
    {
      id: "spread",
      numeric: true,
      disablePadding: false,
      label: "Spread",
    },
    {
      id: "open_interest",
      numeric: true,
      disablePadding: false,
      label: "Open Interest",
    },
    {
      id: "volume_24h",
      numeric: true,
      disablePadding: false,
      label: "Volume 24h",
    },
  ];

  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
    //   console.log(order, orderBy, "orderBy");
    return (
      <TableHead sx={{ backgroundColor: "primary.main" }}>
        <TableRow>
          {headCells.map((headCell) => (
            <StyledTableCell
              key={headCell.id}
              align={headCell.numeric ? "left" : "left"}
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
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </StyledTableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleclick = () => {
    // if (sliceLength >= 9000) {
    //   return;
    // }
    setLoadingCircle(true);

    setTimeout(() => {
      // setsliceLength(sliceLength + 20);
      setRowsPerPage(rowsPerPage + 10);
    }, 500);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="xl">
        <Heading text="DERIVATIVES" />

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
                    {stableSort(derivativedata, getComparator(order, orderBy))
                      .slice(0, rowsPerPage)
                      ?.map(
                        (
                          {
                            name,
                            market,
                            symbol,
                            price,
                            price_percentage_change_24h,
                            contract_type,
                            spread,
                            basis,
                            volume_24h,
                            open_interest,
                            index,
                          },
                          i
                        ) => {
                          const isItemSelected = isSelected(name);
                          const labelId = `enhanced-table-checkbox-${i}`;

                          return (
                            <TableRow
                              sx={{ backgroundColor: "primary.main" }}
                              hover
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={price + i}
                              selected={isItemSelected}
                            >
                              <StyledTableCell id={labelId}>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  style={borderstyle}
                                >
                                  <Typography variant="subtitle2">
                                    {market}
                                  </Typography>
                                  {/* <Typography ml="3px" variant="subtitle2">
                                  {symbol.toUpperCase()}
                                </Typography> */}
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Typography
                                  variant="subtitle2"
                                  style={borderstyle}
                                >
                                  {symbol}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Box style={borderstyle}>
                                  <Typography variant="subtitle2">
                                    {Math.round(price)?.toLocaleString()}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Box
                                  style={borderstyle}
                                  display="flex"
                                  alignItems="center"
                                >
                                  <ArrowDropDownIcon />
                                  <Typography
                                    color={
                                      price_percentage_change_24h.toString()[0] ==
                                      "-"
                                        ? "text.sell"
                                        : "text.buy"
                                    }
                                    variant="subtitle2"
                                  >
                                    {+price_percentage_change_24h.toFixed(3)} %
                                  </Typography>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell>
                                <Box style={borderstyle}>
                                  <Typography
                                    variant="subtitle2"
                                    textTransform="capitalize"
                                  >
                                    {contract_type}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Box style={borderstyle}>
                                  <Typography variant="subtitle2">
                                    {Math.round(index)?.toLocaleString()}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Box style={borderstyle}>
                                  <Typography variant="subtitle2">
                                    {basis?.toFixed(4)} %
                                  </Typography>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell>
                                <Box style={borderstyle}>
                                  <Typography variant="subtitle2">
                                    {spread?.toFixed(3)} %
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Box style={borderstyle}>
                                  <Typography>
                                    {Math.round(
                                      open_interest
                                    )?.toLocaleString()}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Box style={borderstyle}>
                                  <Typography variant="subtitle2">
                                    {Math.round(volume_24h)?.toLocaleString()}
                                  </Typography>
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

export default Derivatives;
