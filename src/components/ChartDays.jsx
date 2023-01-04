import { Box, Button } from "@mui/material";
const ChartDays = ({ chartDays, setChartDays }) => {
  return (
    <Box
      mt={{ xs: 1, md: 0 }}
      sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
    >
      <Button
        variant="tabs"
        onClick={() => setChartDays(1)}
        sx={{
          color: chartDays === 1 ? "text.active" : "text.secondary",
        }}
      >
        1 D
      </Button>
      <Button
        variant="tabs"
        onClick={() => setChartDays(7)}
        sx={{
          color: chartDays === 7 ? "text.active" : "text.secondary",
        }}
      >
        7 D
      </Button>
      <Button
        variant="tabs"
        onClick={() => setChartDays(30)}
        sx={{
          color: chartDays === 30 ? "text.active" : "text.secondary",
        }}
      >
        1 M
      </Button>
      <Button
        variant="tabs"
        onClick={() => setChartDays(180)}
        sx={{
          color: chartDays === 180 ? "text.active" : "text.secondary",
        }}
      >
        6 M
      </Button>
      <Button
        variant="tabs"
        onClick={() => setChartDays(365)}
        sx={{
          color: chartDays === 365 ? "text.active" : "text.secondary",
        }}
      >
        1 Y
      </Button>
      <Button
        variant="tabs"
        onClick={() => setChartDays(0)}
        sx={{
          color: chartDays === 0 ? "text.active" : "text.secondary",
        }}
      >
        All
      </Button>
    </Box>
  );
};
export default ChartDays;
