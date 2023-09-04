/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Chip, Container, Stack } from "@mui/material";
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";

const UserCohortRender = ({ params, rowField="userCohort"}) => {
  /*
    ==========================
    =      AUX VARIABLES     =
    ==========================
  */
  const userCohorts = params.row[rowField];
  const cohortName = rowField==="userCohort" ? "cohort" : "name"
  const cohortId = rowField === "userCohort" ? "userId" : "_id" 
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
        {userCohorts.map((userCohort) => (
          <Chip
            key={`${userCohort[cohortName]}-${params.row[cohortId]}`}
            label={userCohort[cohortName]}
            sx={{
              backgroundColor: "#0F3460",
              color: "white",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default UserCohortRender;

UserCohortRender.propTypes = {
  params: PropTypes.object.isRequired,
  rowField: PropTypes.string
};
