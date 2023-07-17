import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import Link from "./common/Link";
import { styled } from "@mui/material";

type StyledMenuProps = {
  minWidth?: number;
};

export const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))<StyledMenuProps>`
  .MuiPaper-root {
    min-width: ${(props) => (props.minWidth ? props.minWidth : 150)}px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
`;

export const StyledMenuItem = styled((props: MenuItemProps) => (
  <MenuItem {...props} />
))`
  .MuiListItem-root {
    padding: "3px 8px";
    border-radius: 5;
    display: flex;
  }
`;

export const StyledLink = styled((props: any) => <Link {...props} />)`
  text-decoration: none;
  .MuiTypography-root {
    text-decoration: none;
  }
`;
