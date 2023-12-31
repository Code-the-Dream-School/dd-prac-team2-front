/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Container } from "@mui/material";
import { PeopleAltRounded } from "@mui/icons-material";
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";
import { Link } from "react-router-dom";
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import AppButton from "../../../../components/Button/AppButton";

const Members = ({ params }) => {
  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "5px",
          "&": { paddingLeft: 0, paddingRight: 0 },
          paddingLeft: 0,
        }}
      >
        <Link to={`register/${params.row.id}`}>
          <AppButton
            text={`${params.row.members}`}
            type="button"
            width="auto"
            color="#0F3460"
            handlerFunction={() => {}}
          >
            <PeopleAltRounded></PeopleAltRounded>
          </AppButton>
        </Link>
      </Container>
    </>
  );
};

export default Members;

Members.propTypes = {
  params: PropTypes.object.isRequired,
};
