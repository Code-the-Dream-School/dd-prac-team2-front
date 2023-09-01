/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Avatar, Chip, Container, Stack } from "@mui/material";
import PropTypes from "prop-types";

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";

const UserRoleRender = ({ params, rowField="userRole"}) => {
  const roles = params.row[rowField];

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "5px",
        "&": { paddingLeft: 0, paddingRight: 0 },
        paddingLeft: 0,
      }}
    >
      <Stack direction={"row"} spacing={1}>
        {roles.map((role) => (
          <Avatar
            key={`${role}-${params.row.userId}`}
            alt={role}
            variant="square"
            src={role==="admin" ? "/images/admin.png" : role==="mentor" ? "/images/mentor.png":"/images/student.png"}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default UserRoleRender;

UserRoleRender.propTypes = {
  params: PropTypes.object.isRequired,
};
