import { Container } from "@mui/material";
import React, { useState } from "react";
import AppButton from "../../../../components/Button/AppButton";
import { CloudDownloadRounded } from "@mui/icons-material";
import AddCohort from "./AddCohort";

const CohortsSlackAction = ({ params, onRegisterSlackChannel, onRegisterCohort }) => {
  const [openNewCohortDialog, setOpenNewCohortDialog] = useState(false);

  const slackChannelData = params.row;
  const handleOpenNewCohortDialog = (open) => {
    setOpenNewCohortDialog(open)
  }
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
