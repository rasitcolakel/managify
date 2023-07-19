import ImageAvatar from "@components/common/ImageAvatar";
import { ColorModeContext } from "@contexts";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import { styled, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { StyledLink, StyledMenu, StyledMenuItem } from "..";
import { useLogout, useTranslate } from "@refinedev/core";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";
const StyledHamburgerMenu = styled(HamburgerMenu)`
  button {
    color: yellow;
  }
`;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const t = useTranslate();
  const { mode, setMode, profile } = useContext(ColorModeContext);
  const { locale: currentLocale, locales, pathname, query } = useRouter();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position={sticky ? "sticky" : "relative"}>
      <Toolbar
        sx={{
          backgroundColor: theme.palette.background.paper,
          "& .MuiIconButton-root": {
            color: theme.palette.text.primary,
          },
        }}
      >
        <Stack direction="row" width="100%" alignItems="center">
          <StyledHamburgerMenu />
          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-end"
            alignItems="center"
            gap="16px"
          >
            <FormControl sx={{ minWidth: 64 }}>
              <Select
                disableUnderline
                defaultValue={currentLocale}
                inputProps={{ "aria-label": "Without label" }}
                variant="standard"
                sx={{
                  "& .MuiStack-root > .MuiTypography-root": {
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                  },
                }}
              >
                {[...(locales ?? [])].sort().map((lang: string) => (
                  // @ts-ignore
                  <MenuItem
                    component={Link}
                    href={{ pathname, query }}
                    locale={lang}
                    selected={currentLocale === lang}
                    key={lang}
                    defaultValue={lang}
                    value={lang}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Avatar
                        sx={{
                          width: "24px",
                          height: "24px",
                          marginRight: "5px",
                        }}
                        src={`/images/flags/${lang}.svg`}
                      />
                      <Typography>
                        {lang === "en"
                          ? "English"
                          : lang === "tr"
                          ? "Turkish"
                          : "German"}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <IconButton
              onClick={() => {
                setMode();
              }}
            >
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
            {profile && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
                <IconButton onClick={handleClick}>
                  <ImageAvatar
                    user={profile}
                    link={false}
                    sx={{
                      bgcolor: generateRandomColorWithName(
                        profile.full_name || ""
                      ),
                    }}
                  >
                    <Typography variant="body2" color="white">
                      {getFirstLettersOfWord(profile.full_name || "")}
                    </Typography>
                  </ImageAvatar>
                </IconButton>
                <StyledMenu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <StyledLink href={`/profile`}>
                    <StyledMenuItem>
                      <ImageAvatar user={profile} link={false} />

                      <Typography
                        variant="inherit"
                        sx={{
                          flex: 1,
                          textAlign: "center",
                          color: "text.primary",
                        }}
                      >
                        {t("profiles.title")}
                      </Typography>
                    </StyledMenuItem>
                  </StyledLink>

                  <Divider />

                  <StyledLink href={`/profile/settings`}>
                    <StyledMenuItem>
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      <Typography
                        variant="inherit"
                        sx={{
                          flex: 1,
                          textAlign: "center",
                          color: "text.primary",
                        }}
                      >
                        {t("profiles.settings")}
                      </Typography>
                    </StyledMenuItem>
                  </StyledLink>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <Typography
                      variant="inherit"
                      sx={{
                        flex: 1,
                        textAlign: "center",
                        color: "text.primary",
                      }}
                    >
                      {t("buttons.logout")}
                    </Typography>
                  </MenuItem>
                </StyledMenu>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
