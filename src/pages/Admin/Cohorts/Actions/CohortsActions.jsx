/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import AppButton from "../../../../components/Button/AppButton";
import { Container } from "@mui/material";
import {
  ChecklistRounded,
  DeleteRounded,
  EditRounded,
  PeopleAltRounded,
} from "@mui/icons-material";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
/*
    ==========================
    =          HOOKS         =
    ==========================
*/
import useAuth from "../../../../hooks/useAuth";
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import EditCohort from "./EditCohort";
import Loader from "../../../../components/Loader/Loader";

const CohortsActions = ({ params, onHandleCohorts }) => {
  /*
        ==========================
        =          HOOKS         =
        ==========================
    */
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  /*
        ==========================
        =         STATES         =
        ==========================
    */
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  /*
        ==========================
        =         HANDLERS       =
        ==========================
    */

  const handleOpenEditCohort = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditCohort = () => {
    setOpenEditDialog(false);
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "5px",
          "&": { paddingLeft: 0, paddingRight: 0 },
          paddingLeft: 0,
        }}
      >
        <AppButton
          text={"Edit"}
          type="button"
          width="auto"
          color="#F3950D"
          handlerFunction={() => {
            handleOpenEditCohort();
          }}
        >
          <EditRounded></EditRounded>
        </AppButton>
      </Container>
      {openEditDialog ? (
        <EditCohort
          openDialog={openEditDialog}
          cohortInfo={params}
          onCloseDialog={handleCloseEditCohort}
          onHandleCohorts={onHandleCohorts}
        />
      ) : null}
    </>
  );
};

export default CohortsActions;
