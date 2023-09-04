/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Container } from "@mui/material";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import PropTypes from "prop-types";

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from "react";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from "../../../../../components/Button/AppButton";
import EditUser from "./EditUser";

const RegisterUserActions = ({ params, fetchedCohorts, onHandleUsers }) => {
  /*
    ==========================
    =         STATES         =
    ==========================
  */
  const [openEditDialog, setOpenEditDialog] = useState(false);

  /*
    ==========================
    =   HANDLER FUNCTIONS    =
    ==========================
  */
  const handleOpenEditUserDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditUserDialog = () => {
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
          handlerFunction={handleOpenEditUserDialog}
        >
          <EditRounded></EditRounded>
        </AppButton>
      </Container>
      {openEditDialog ? (
        <EditUser
          openDialog={openEditDialog}
          userInfo={params}
          fetchedCohorts={fetchedCohorts}
          onCloseDialog={handleCloseEditUserDialog}
          onHandleUsers={onHandleUsers}
        ></EditUser>
      ) : null}
    </>
  );
};

export default RegisterUserActions;

RegisterUserActions.propTypes = {
  params: PropTypes.object.isRequired,
  fetchedCohorts: PropTypes.array.isRequired,
  onHandleUsers: PropTypes.func.isRequired,
};
