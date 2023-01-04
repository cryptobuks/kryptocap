import { Box, MenuItem, Typography, Link as MuiLink } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import RedditIcon from "@mui/icons-material/Reddit";
import GitHubIcon from "@mui/icons-material/GitHub";

import StyledMenu from "./StyledDropDown";

const socialIcons = [TwitterIcon, FacebookIcon, RedditIcon];

const LinksMenu = ({ handleClose, anchorEl, data }) => {
  const open = Boolean(anchorEl);
  return (
    <Box>
      {data && (
        <>
          <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MuiLink
              href={data?.website}
              target="_blank"
              rel="noreferrer noopener"
              style={{ textDecoration: "none" }}
            >
              <MenuItem
                onClick={handleClose}
                disableRipple
                sx={{ color: "text.secondary" }}
              >
                <OpenInNewIcon sx={{ mr: 1 }} /> Website
              </MenuItem>
            </MuiLink>

            <Typography variant="subtitle2">Social</Typography>
            {data?.social &&
              Object.keys(data?.social)?.map((key, i) => {
                if (data?.social[key].length <= 0) {
                  return null;
                }
                let domain = new URL(data?.social[key]);
                let name = domain.pathname.split("/");
                let Icon = socialIcons[i];
                return (
                  <Box key={data?.social[key] + i}>
                    <MuiLink
                      href={data?.social[key]}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{ textDecoration: "none" }}
                    >
                      <MenuItem
                        onClick={handleClose}
                        disableRipple
                        sx={{ color: "text.secondary" }}
                      >
                        <Icon sx={{ mr: 1 }} /> {name[1].toUpperCase()}
                      </MenuItem>
                    </MuiLink>
                  </Box>
                );
              })}
            <Typography variant="subtitle2">Chats And Forums</Typography>

            {data["chats and forums"] &&
              Object.keys(data["chats and forums"])?.map((key, i) => {
                let mainObj = data["chats and forums"];
                return (
                  <Box key={key + i}>
                    {mainObj[key].map((text) => {
                      if (text.length <= 0) {
                        return null;
                      }
                      let domain = new URL(text);
                      return (
                        <MuiLink
                          href={text}
                          key={text + i}
                          target="_blank"
                          rel="noreferrer noopener"
                          style={{ textDecoration: "none" }}
                        >
                          <MenuItem
                            onClick={handleClose}
                            disableRipple
                            sx={{ color: "text.secondary" }}
                          >
                            <OpenInNewIcon sx={{ mr: 1 }} />{" "}
                            {domain.hostname.toUpperCase()}
                          </MenuItem>
                        </MuiLink>
                      );
                    })}
                  </Box>
                );
              })}

            {data?.github?.repo.length > 0 && (
              <Box>
                <Typography variant="subtitle2">GitHub</Typography>

                {data["github"] &&
                  Object.keys(data["github"])?.map((key, i) => {
                    let mainObj = data["github"];
                    return (
                      <Box key={key + i}>
                        {mainObj[key].map((text) => {
                          if (text.length <= 0) {
                            return null;
                          }
                          let domain = new URL(text);
                          let name = domain.pathname.split("/");
                          return (
                            <MuiLink
                              href={text}
                              key={text + i}
                              target="_blank"
                              rel="noreferrer noopener"
                              // style={{ textDecoration: "none" }}
                            >
                              <MenuItem
                                onClick={handleClose}
                                disableRipple
                                sx={{ color: "text.secondary" }}
                              >
                                <GitHubIcon sx={{ mr: 1 }} />{" "}
                                {name[1].toUpperCase()}
                              </MenuItem>
                            </MuiLink>
                          );
                        })}
                      </Box>
                    );
                  })}
              </Box>
            )}
          </StyledMenu>
        </>
      )}
    </Box>
  );
};

export default LinksMenu;
