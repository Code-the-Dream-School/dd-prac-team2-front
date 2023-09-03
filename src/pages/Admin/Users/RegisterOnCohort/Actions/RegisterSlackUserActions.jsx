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
import { useLocation, useNavigate } from "react-router-dom";
/*
    ==========================
    =          HOOKS         =
    ==========================
*/
import useAuth from "../../../../../hooks/useAuth";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from "../../../../../components/Button/AppButton";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import EditSlackProfile from "./EditSlackProfile";

const RegisterSlackUserActions = ({ params, onHandleNewUsers }) => {
  /*
        ==========================
        =         STATES         =
        ==========================
    */
  const [openEditSlackProfileDialog, setOpenEditSlackProfileDialog] =
    useState(false);

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
          text={""}
          type="button"
          width="auto"
          color="#F3950D"
          handlerFunction={() => setOpenEditSlackProfileDialog(true)}
        >
          <EditRounded></EditRounded>
        </AppButton>
      </Container>
      {openEditSlackProfileDialog ? (
        <EditSlackProfile
          open={openEditSlackProfileDialog}
          handleOpen={setOpenEditSlackProfileDialog}
          slackProfileInfo={params}
          onHandleNewUsers={onHandleNewUsers}
        ></EditSlackProfile>
      ) : null}
    </>
  );
};

export default RegisterSlackUserActions;
