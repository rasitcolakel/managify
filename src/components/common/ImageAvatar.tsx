import { ColorModeContext } from "@contexts/index";
import { Avatar, AvatarProps, Tooltip, styled } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { getImageFromCDN } from "src/services/users";
import { Profile } from "src/types";

type Props = AvatarProps & {
  user: Profile;
  tooltip?: boolean;
  link?: boolean;
};

const StyledAvatar = styled(Avatar)<AvatarProps>``;

export default function ImageAvatar({
  tooltip = true,
  user,
  link = true,
  children,
  ...props
}: Props) {
  const { profile } = useContext(ColorModeContext);

  const Component = (
    <StyledAvatar {...props} alt={user?.full_name || ""} sx={props.sx}>
      {user?.avatar && (
        <Image
          alt={user?.full_name || ""}
          src={user?.avatar ? getImageFromCDN(user.avatar) : ""}
          fill
        />
      )}
      {children}
    </StyledAvatar>
  );

  const Avatar = tooltip ? (
    <Tooltip title={user?.full_name || ""} placement="bottom">
      {Component}
    </Tooltip>
  ) : (
    Component
  );

  const isMe = profile?.id === user?.id;

  return link ? (
    <Link
      href={isMe ? "/profile" : `/profiles/${user?.id}`}
      passHref
      style={{
        textDecoration: "none",
      }}
    >
      {Avatar}
    </Link>
  ) : (
    Avatar
  );
}
