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
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

import Heading from "../components/Heading";
import { ClipLoad, BarLoad } from "../components/Loader";

const StyledHashLink = styled(Link)({
  textDecoration: "none",
});

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
    id: "trust_score",
    numeric: true,
    disablePadding: false,
    label: "Trust Score",
  },
  {
    id: "trade_volume_24h_btc",
    numeric: true,
    disablePadding: false,
    label: "Volume 24h",
  },
  {
    id: "year_established",
    numeric: true,
    disablePadding: false,
    label: "Since",
  },
  {
    id: "country",
    numeric: true,
    disablePadding: false,
    label: "Country",
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

const AllExchanges = ({ currencySymbol, currency }) => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [exchangdata, setexchangdata] = useState();
  const [sliceLength, setsliceLength] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingCircle, setLoadingCircle] = useState(false);

  useEffect(() => {
    const cwApidata = async () => {
      try {
        let { data } = await axios.get(
          `https://api.coingecko.com/api/v3/exchanges?page=${sliceLength}`
        );
        if (data) {
          setLoading(false);
        } else {
          setLoading(true);
        }

        if (exchangdata) {
          let newData = [...exchangdata, ...data];
          console.log(newData, "Working");
          newData = newData.map((item, i) => {
            return {
              index: i + 1,
              ...item,
            };
          });
          setexchangdata(newData);
        } else {
          data = data.map((item, i) => {
            return {
              index: i + 1,
              ...item,
            };
          });
          setexchangdata(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    cwApidata();
    if (sliceLength > 1) {
      setLoadingCircle(false);
    }
  }, [sliceLength]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleclick = () => {
    if (sliceLength >= 9000) {
      return;
    }
    setLoadingCircle(true);

    setTimeout(() => {
      setsliceLength(sliceLength + 1);
    }, 1500);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="xl">
        <Heading text="EXCHANGES" />
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
                  sx={{
                    minWidth: 750,
                  }}
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
                            name,
                            trust_score,
                            image,
                            country,
                            year_established,
                            trade_volume_24h_btc,
                            index,
                            id,
                          },
                          i
                        ) => {
                          const isItemSelected = isSelected(name);
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              sx={{ backgroundColor: "primary.main" }}
                              hover
                              //   onClick={(event) => handleClick(event, row.name)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={name + i}
                              selected={isItemSelected}
                            >
                              <StyledTableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                              >
                                <StyledHashLink to={`/exchanges/${id}`}>
                                  {" "}
                                  <Box style={borderstyle}>
                                    <Typography>{index}</Typography>
                                  </Box>
                                </StyledHashLink>
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <StyledHashLink to={`/exchanges/${id}`}>
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
                                        src={image ? image : "/"}
                                        alt=""
                                        width="20"
                                        height="20"
                                      />
                                    </Box>
                                    <Typography>{name}</Typography>
                                  </Box>
                                </StyledHashLink>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Box style={borderstyle} align="right">
                                  <Typography
                                    width="30px"
                                    height={"30px"}
                                    backgroundColor="green"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    borderRadius={"50%"}
                                  >
                                    {trust_score}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Box style={borderstyle} align="right">
                                  <Typography>
                                    {+trade_volume_24h_btc.toFixed(3)}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Box style={borderstyle} align="right">
                                  <Typography>{year_established}</Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Box style={borderstyle} align="right">
                                  <Typography>{country}</Typography>
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

export default AllExchanges;
