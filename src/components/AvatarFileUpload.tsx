import { Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material";

import React, { ChangeEvent, HtmlHTMLAttributes, useState } from "react";
const useStyles = makeStyles(() => ({
  avatar: {},
  input: {
    display: "none",
  },
  uploadButton: {
    marginTop: "1em",
  },
}));

const AvatarContainer = styled((props: HtmlHTMLAttributes<HTMLDivElement>) => (
  <div {...props} />
))`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  & .MuiAvatar-root {
    width: 5em;
    height: 5em;
    cursor: pointer;
  }
`;

type AvatarFileUploadProps = {
  // eslint-disable-next-line no-unused-vars
  onAvatarChange: (file: File) => void;
  initPreviewUrl: string;
};

function AvatarFileUpload({
  onAvatarChange,
  initPreviewUrl,
}: AvatarFileUploadProps) {
  const classes = useStyles();
  const [previewUrl, setPreviewUrl] = useState<string | null>(initPreviewUrl);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
      onAvatarChange(file);
    }
  };

  return (
    <AvatarContainer>
      <label htmlFor="avatar-upload">
        <Avatar src={previewUrl || ""} className={classes.avatar} />
      </label>
      <input
        accept="image/*"
        className={classes.input}
        id="avatar-upload"
        type="file"
        onChange={handleFileChange}
      />
    </AvatarContainer>
  );
}

export default AvatarFileUpload;
