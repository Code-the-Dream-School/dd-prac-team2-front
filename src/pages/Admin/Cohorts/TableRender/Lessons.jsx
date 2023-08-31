/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import AppButton from "../../../../components/Button/AppButton";
import { Container } from "@mui/material";
import {
    ChecklistRounded,
  PeopleAltRounded,
} from "@mui/icons-material";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";
import { Link } from "react-router-dom";

const Lessons = ({ params }) => {
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
        <Link to={`${params.row.id}`}>
          <AppButton
            text={"Lessons"}
            type="button"
            width="auto"
            color="#609966"
            handlerFunction={() => {}}
          >
            <ChecklistRounded></ChecklistRounded>
          </AppButton>
        </Link>
      </Container>
    </>
  );
};

export default Lessons;
