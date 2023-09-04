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

const UserAvatarRender = ({ params }) => {
  return (
    <>
      {params.row.avatarUrl === undefined ? (
        <Avatar
          alt={params.row.name}
          src={"/images/userLarge.png"}
          sx={{ width: 50, height: 50 }}
        />
      ) : (
        <Avatar
          alt={params.row.name}
          src={params.row.avatarUrl}
          sx={{ width: 50, height: 50 }}
        />
      )}
    </>
  );
};

export default UserAvatarRender;

UserAvatarRender.propTypes = {
  params: PropTypes.object.isRequired,
};
