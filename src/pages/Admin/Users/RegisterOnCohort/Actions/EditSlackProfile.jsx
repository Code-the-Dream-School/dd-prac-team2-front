/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import { AdminPanelSettingsRounded, Close } from "@mui/icons-material";
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { forwardRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
/*
    ==========================
    =          HOOKS         =
    ==========================
*/
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../../hooks/useAuth";
/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "../RegisterOnCohort.module.css";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from "../../../../../components/Button/AppButton";
import AuthFormControl from "../../../../../components/FormControl/AuthFormControl";
import FormSelect from "../../../../../components/Select/FormSelect";
/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const rolesList = ["Admin", "Mentor", "Student"];

const EditSlackProfile = ({
  open,
  handleOpen,
  slackProfileInfo,
  onHandleNewUsers,
}) => {
  console.log(slackProfileInfo);
  /*
    ==========================
    =         STATES         =
    ==========================
  */
  //Form states
  const [userRoles, setUserRoles] = useState(
    slackProfileInfo.row.role.map(
      (role) => role[0].toUpperCase() + role.slice(1)
    )
  );
  const [formError, setFormError] = useState({
    userRolesError: {
      error: false,
      errorMessage: "Please select a role for this user",
    },
  });

  /* 
    ==========================
    =        EFFECTS         =
    ==========================
  */
  useEffect(() => {
    setFormError((prevState) => ({
      ...prevState,
      userRolesError: {
        ...prevState.userRolesError,
        error: userRoles.length === 0 ? true : false,
      },
    }));
  }, [userRoles]);
  /*
    ==========================
    =   HANDLER FUNCTIONS    =
    ==========================
  */
  const handleOnSelectRole = (selectedRoleName) => {
    setUserRoles(selectedRoleName);
  };

  const handleEditSlackProfile = (event) => {
    event.preventDefault();
    const errors = Object.values(formError);
    if (!errors.some((error) => error.error === true)) {
      onHandleNewUsers((prevNewUsers) =>
        prevNewUsers.map((prevNewUser) => {
          if (prevNewUser.slackId === slackProfileInfo.row.slackId) {
            return {
              ...prevNewUser,
              role: userRoles.map((userRole) => userRole.toLowerCase()).sort(),
            };
          } else {
            return prevNewUser;
          }
        })
      );
      handleOpen(false);
    } else {
      console.error("There is an error preventing form submission");
    }
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={() => handleOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={"5px"}
          component={"div"}
        >
          <Typography
            variant="h1"
            textAlign={"center"}
            fontSize={"30px"}
            fontWeight={"bold"}
          >
            {`Update ${slackProfileInfo.row.name}'s Slack Profile`}
          </Typography>
          <AppButton
            text={""}
            type="button"
            width="10%"
            handlerFunction={() => handleOpen(false)}
          >
            <Close></Close>
          </AppButton>
        </DialogTitle>
        <Box
          component={"form"}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            color: "#C84B31",
          }}
          autoComplete="off"
          onSubmit={handleEditSlackProfile}
        >
          <DialogContent
            sx={{ width: "100%", paddingX: 0, paddingY: 1 }}
            dividers
          >
            <div className={styles.formContainer}>
              <AuthFormControl width="75%">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <AdminPanelSettingsRounded fontSize="large" />
                  <br></br>
                </Box>
                <AuthFormControl
                  width="100%"
                  isNested={true}
                  error={formError.userRolesError.error}
                >
                  <FormSelect
                    id={"userRoles"}
                    name={"userRoles"}
                    label={`"Roles:"`}
                    selectValue={userRoles}
                    onSelectValue={handleOnSelectRole}
                    list={rolesList}
                    variant={"dark"}
                    multiple={true}
                    error={formError.userRolesError}
                  ></FormSelect>
                </AuthFormControl>
              </AuthFormControl>
            </div>
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <AppButton
              text={"Update profile"}
              type="submit"
              width="100%"
              handlerFunction={() => {}}
            />
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default EditSlackProfile;

EditSlackProfile.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  slackProfileInfo: PropTypes.object.isRequired,
  onHandleNewUsers: PropTypes.func.isRequired,
};
