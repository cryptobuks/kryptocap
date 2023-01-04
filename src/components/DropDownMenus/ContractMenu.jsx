import { Box, MenuItem, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar } from "notistack";

import StyledMenu from "./StyledDropDown";

const Explorers = ({ handleClose, anchorEl, data }) => {
  const open = Boolean(anchorEl);
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Box>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {data &&
          Object.keys(data)?.map((key, i) => {
            if (data[key] <= 0) {
              return null;
            }
            return (
              <Box key={data[key] + i}>
                <Typography variant="subtitle1" color="#fff">
                  {key.toUpperCase()}{" "}
                </Typography>
                <CopyToClipboard
                  text={data[key]}
                  onCopy={() => {
                    enqueueSnackbar("Copied", {
                      variant: "success",
                    });
                  }}
                >
                  <MenuItem
                    onClick={handleClose}
                    disableRipple
                    sx={{ color: "text.secondary" }}
                  >
                    {data[key]} <ContentCopyIcon sx={{ ml: 1 }} />
                  </MenuItem>
                </CopyToClipboard>
              </Box>
            );
          })}
      </StyledMenu>
    </Box>
  );
};
export default Explorers;
