import { Box, MenuItem } from "@mui/material";

import StyledMenu from "./StyledDropDown";

const ScoreMenu = ({ handleClose, anchorEl, data }) => {
  const open = Boolean(anchorEl);

  return (
    <Box>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {data &&
          Object.keys(data)?.map((key, i) => {
            if (data[key] <= 0) {
              return null;
            }

            return (
              <MenuItem
                key={data[key] + i}
                onClick={handleClose}
                disableRipple
                sx={{ color: "text.secondary" }}
              >
                {key?.toUpperCase()}: {data[key]}
              </MenuItem>
            );
          })}
      </StyledMenu>
    </Box>
  );
};

export default ScoreMenu;
