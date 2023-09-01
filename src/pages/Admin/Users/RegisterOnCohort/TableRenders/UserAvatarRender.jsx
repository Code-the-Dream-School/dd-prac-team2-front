import { Avatar } from "@mui/material";
import React from "react";

const UserAvatarRender = ({ params }) => {
  return (
    <Avatar
      alt={params.row.name}
      src={params.row.avatarUrl}
      sx={{ width: 50, height: 50 }}
    />
  );
};

export default UserAvatarRender;
