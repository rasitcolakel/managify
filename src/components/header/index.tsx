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

const StyledHamburgerMenu = styled(HamburgerMenu)`
  button {
    color: yellow;
  }
`;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode, profile } = useContext(ColorModeContext);
  const { locale: currentLocale, locales, pathname, query } = useRouter();
  const theme = useTheme();

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
                gap="16px"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                  }}
                >
                  {profile?.full_name}
                </Typography>
                <ImageAvatar user={profile} tooltip={false} />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
