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

const RegisterExistingSlackUserActions = ({
  params,
  newCohortId,
  onLoading,
  onRegisterCohortSubmit,
  onHandleNewExistingUsers,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const handleRegisterExistingSlackUser = async () => {
    try {
      onLoading(true);
      const body = {
        cohorts: [
          newCohortId,
          ...params.row.cohorts.map((cohort) => cohort._id),
        ],
      };
      console.log(body);
      const response = await axiosPrivate.patch(
        `/users/${params.row.id}`,
        body
      );
      console.log(response);
      onRegisterCohortSubmit((prevCohortUsers) => [
        ...prevCohortUsers,
       {
          id: response.data.profile.id,
          slackId: response.data.profile.slackId,
          userAvatar: response.data.profile.avatarUrl,
          userName: response.data.profile.name,
          userEmail: response.data.profile.email,
          userRole: response.data.profile.roles.sort(),
          userActivatedStatus: response.data.profile.isActivated,
        },
      ]);
      onHandleNewExistingUsers((prevNewExistingUsers) =>
        prevNewExistingUsers.filter(
          (prevNewExistingUser) => prevNewExistingUser.id !== params.row.id
        )
      );
      onLoading(false);
    } catch (error) {
      console.error(error);
    }
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
          text={"Add"}
          type="button"
          width="auto"
          color="#609966"
          handlerFunction={() => handleRegisterExistingSlackUser(true)}
        >
          <CloudDownloadRounded></CloudDownloadRounded>
        </AppButton>
      </Container>
    </>
  );
};

export default RegisterExistingSlackUserActions;
