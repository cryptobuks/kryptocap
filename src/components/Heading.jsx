import { Typography } from "@mui/material";
const Heading = ({ text, ...rest }) => {
  return (
    <Typography
      variant="h3"
      component="h6"
      {...rest}
      sx={(theme) => ({
        // background:
        // "linear-gradient(112deg, rgba(234,166,3,1) 6%, rgba(234,210,3,1) 81%)",
        // WebkitBackgroundClip: "text",
        // WebkitTextFillColor: "transparent",
        color: "text.primary",
        fontWeight: "bold",
        fontSize: { xs: "1.7rem", md: "3rem" },
        my: 4,
        textAlign: "center",
        letterSpacing: "0.05em",
        // textShadow: `${theme.palette.text.primary} 0px 0px 5px`,
      })}
    >
      {text}
    </Typography>
  );
};

export default Heading;
