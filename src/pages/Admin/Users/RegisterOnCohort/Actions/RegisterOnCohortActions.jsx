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
import EditCohortUser from "./EditCohortUser";

const RegisterOnCohortActions = ({
  params,
  cohortData,
  onLoading,
  onHandleCohortUsers,
  onToast,
}) => {
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

  /*
    ==========================
    =    HANDLER FUNCTIONS   =
    ==========================
  */
  const handleDeleteCohortUser = async () => {
    onLoading(true);
    const cohortUserToBeDeleted = params.row.id;
    try {
      //Fetch the user information
      const userToBeDeletedFromCohort = await axiosPrivate.get(
        `users/${cohortUserToBeDeleted}`
      );
      //Gather the user cohorts
      const userCohorts = userToBeDeletedFromCohort.data.user.cohorts;
      //Create an array which would have the new cohort list of the user by removing the present cohort
      const newUserCohorts = userCohorts.filter(
        (userCohort) => userCohort._id !== cohortData.cohortId
      );
      //Create a body for the following request:
      const body = {
        cohorts: newUserCohorts.map((newUserCohort) => newUserCohort._id),
      };
      //Create a new request to update the user cohort's:
      const response = await axiosPrivate.patch(
        `/users/${cohortUserToBeDeleted}`,
        body
      );
      onHandleCohortUsers((prevCohortUsers) => {
        return prevCohortUsers.filter(
          (user) => user.id !== cohortUserToBeDeleted
        );
      });
      onToast({
        isOpened: true,
        severity: "success",
        message: `Success! User ${userToBeDeletedFromCohort.data.user.name} has been deleted from cohort`,
      });
      onLoading(false);
    } catch (error) {
      if (error.response.status === 403) {
        onLoading(false);
        console.error(error);
        //User is required to validate auth again
        navigate("/login", { state: { from: location }, replace: true });
        setAuth({
          userId: "",
          userName: "",
          userEmail: "",
          role: [],
          loggedIn: false,
          avatarUrl: "",
          isActive: undefined,
          accessToken: "",
        });
      } else {
        onLoading(false);
        console.error(error);
      }
    }
  };

  const handleOpenEditCohortUserDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditCohortUserDialog = () => {
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
          handlerFunction={handleOpenEditCohortUserDialog}
        >
          <EditRounded></EditRounded>
        </AppButton>
        <AppButton
          text={"Delete"}
          type="button"
          width="auto"
          color="#CD1818"
          handlerFunction={handleDeleteCohortUser}
        >
          <DeleteRounded></DeleteRounded>
        </AppButton>
      </Container>
      {openEditDialog ? (
        <EditCohortUser
          openDialog={openEditDialog}
          cohortUserInfo={params}
          onCloseDialog={handleCloseEditCohortUserDialog}
          onLoading={onLoading}
          onHandleCohortUsers={onHandleCohortUsers}
          onToast={onToast}
        ></EditCohortUser>
      ) : null}
    </>
  );
};

export default RegisterOnCohortActions;

RegisterOnCohortActions.propTypes = {
  params: PropTypes.object.isRequired,
  cohortData: PropTypes.object.isRequired,
  onLoading: PropTypes.func.isRequired,
  onHandleCohortUsers: PropTypes.func.isRequired,
  onToast: PropTypes.func,
};
