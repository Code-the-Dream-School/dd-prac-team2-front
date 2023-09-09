/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import AppButton from "../../../../components/Button/AppButton";
import { Container } from "@mui/material";
import { EditRounded } from "@mui/icons-material";
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from "react";
/*
    ==========================
    =       COMPONENTS       =
    ==========================
*/
import EditCohort from "./EditCohort";

const CohortsActions = ({ params, onHandleCohorts, onLoading }) => {
  /*
      ==========================
      =         STATES         =
      ==========================
  */
  const [openEditDialog, setOpenEditDialog] = useState(false);
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
          onLoading={onLoading}
        />
      ) : null}
    </>
  );
};

export default CohortsActions;

CohortsActions.propTypes = {
  params: PropTypes.object.isRequired,
  onHandleCohorts: PropTypes.func.isRequired,
  onLoading: PropTypes.func
};
