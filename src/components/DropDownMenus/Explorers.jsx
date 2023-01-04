import { Box, MenuItem, Link as MuiLink } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import RedditIcon from "@mui/icons-material/Reddit";
import TelegramIcon from "@mui/icons-material/Telegram";

import StyledMenu from "./StyledDropDown";

let iconsList = [
  OpenInNewIcon,
  FacebookIcon,
  RedditIcon,
  TelegramIcon,
  OpenInNewIcon,
  OpenInNewIcon,
  OpenInNewIcon,
  TwitterIcon,
];

const Explorers = ({ handleClose, anchorEl, data, name: type }) => {
  const open = Boolean(anchorEl);

  return (
    <Box>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {data?.map((text, i) => {
          if (text.length <= 0) {
            return null;
          }
          let domain = new URL(text);
          let name = text.split(`https://${domain.hostname}/`);
          let Icon = iconsList[i];
          return (
            <MuiLink
              key={text}
              href={text}
              target="_blank"
              rel="noreferrer noopener"
              sx={{ textDecoration: "none" }}
            >
              <MenuItem
                onClick={handleClose}
                disableRipple
                sx={{ color: "text.primary" }}
              >
                {type === "currency" ? (
                  <OpenInNewIcon sx={{ mr: 1 }} />
                ) : (
                  <Icon sx={{ mr: 1 }} />
                )}

                {type === "currency"
                  ? domain.hostname.toUpperCase()
                  : i === 0
                  ? "WEBSITE"
                  : name[1].toUpperCase()}
              </MenuItem>
            </MuiLink>
          );
        })}
      </StyledMenu>
    </Box>
  );
};
export default Explorers;
