/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Avatar } from "@mui/material";
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";

const UserAvatarRender = ({ name, avatarUrl }) => {
  return (
    <>
      {avatarUrl === undefined ? (
        <Avatar
          alt={name}
          src={"/images/userLarge.png"}
          sx={{ width: 50, height: 50 }}
        />
      ) : (
        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{ width: 50, height: 50 }}
        />
      )}
    </>
  );
};

export default UserAvatarRender;

UserAvatarRender.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
};
