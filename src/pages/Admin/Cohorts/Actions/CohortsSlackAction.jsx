/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Container } from "@mui/material";
import { CloudDownloadRounded } from "@mui/icons-material";
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
import AppButton from "../../../../components/Button/AppButton";
import AddCohort from "./AddCohort";

const CohortsSlackAction = ({
  params,
  onRegisterSlackChannel,
  onRegisterCohort,
}) => {
  /*
    ==========================
    =         STATES         =
    ==========================
  */
  const [openNewCohortDialog, setOpenNewCohortDialog] = useState(false);
  /*
    ==========================
    =      AUX VARIABLES     =
    ==========================
  */
  const slackChannelData = params.row;
  /*
    ==========================
    =         HANDLERS       =
    ==========================
  */
  const handleOpenNewCohortDialog = (open) => {
    setOpenNewCohortDialog(open);
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
          text={"Create cohort"}
          type="button"
          width="auto"
          color="#609966"
          handlerFunction={() => handleOpenNewCohortDialog(true)}
        >
          <CloudDownloadRounded></CloudDownloadRounded>
        </AppButton>
      </Container>
      {openNewCohortDialog ? (
        <AddCohort
          open={openNewCohortDialog}
          handleOpen={handleOpenNewCohortDialog}
          onRegisterSlackChannel={onRegisterSlackChannel}
          onRegisterCohort={onRegisterCohort}
          slackChannelData={slackChannelData}
        ></AddCohort>
      ) : null}
    </>
  );
};

export default CohortsSlackAction;

CohortsSlackAction.propTypes = {
  params: PropTypes.object.isRequired,
  onRegisterSlackChannel: PropTypes.func.isRequired,
  onRegisterCohort: PropTypes.func.isRequired,
};
