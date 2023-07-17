import NextLink from "next/link";
import MuiLink, { LinkProps } from "@mui/material/Link";
import MuiButton, { ButtonProps } from "@mui/material/Button";
import { IconButton, IconButtonProps } from "@mui/material";

type Props = {
  itemType?: "link" | "button" | "iconButton" | "text";
  href: string;
  children: React.ReactNode;
  buttonProps?: ButtonProps;
  iconButtonProps?: IconButtonProps;
  linkProps?: LinkProps;
};

export default function Link({
  itemType = "link",
  href,
  children,
  iconButtonProps,
  buttonProps,
  linkProps,
  ...props
}: Props) {
  if (itemType === "button") {
    return (
      <NextLink href={href} passHref>
        <MuiButton {...props} {...buttonProps}>
          {children}
        </MuiButton>
      </NextLink>
    );
  } else if (itemType === "iconButton") {
    return (
      <NextLink href={href} passHref>
        <IconButton {...props} {...iconButtonProps}>
          {children}
        </IconButton>
      </NextLink>
    );
  } else if (itemType === "text") {
    return (
      <NextLink href={href} passHref {...props}>
        {children}
      </NextLink>
    );
  } else {
    return (
      <NextLink href={href} passHref {...props}>
        <MuiLink {...linkProps}>{children}</MuiLink>
      </NextLink>
    );
  }
}
