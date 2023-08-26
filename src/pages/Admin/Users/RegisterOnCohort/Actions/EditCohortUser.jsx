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
import {
  AdminPanelSettingsRounded,
  BadgeRounded,
  Close,
  Email,
} from "@mui/icons-material";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import PropTypes from "prop-types";

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState, forwardRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import FormTextField from "../../../../../components/TextField/FormTextField";
import AuthFormControl from "../../../../../components/FormControl/AuthFormControl";
import FormSelect from "../../../../../components/Select/FormSelect";
/*
    ==========================
    =          HOOKS         =
    ==========================
*/
import useAuth from "../../../../../hooks/useAuth";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const rolesList = ["Admin", "Mentor", "Student"];

const EditCohortUser = ({
  openDialog,
  cohortUserInfo,
  onCloseDialog,
  onHandleCohortUsers,
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
  //Form states
  const [userRoles, setUserRoles] = useState(
    cohortUserInfo.row.userRole.map(
      (role) => role[0].toUpperCase() + role.slice(1)
    )
  );
  const [formError, setFormError] = useState({
    userRolesError: {
      error: false,
      errorMessage: "Please select a role for this user",
    },
  });
  const [reset, setReset] = useState(false);

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

  useEffect(() => {
    setReset(false);
  });

  /*
        ==========================
        =   HANDLER FUNCTIONS    =
        ==========================
    */
  // onSelect Role:
  const handleOnSelectRole = (selectedRoleName) => {
    setUserRoles(selectedRoleName);
  };

  //Edit user submit:
  const handleEditCohortUserSubmit = async (event) => {
    event.preventDefault();
    const cohortUserToBeUpdated = cohortUserInfo.row.id;
    console.log(userRoles);
    const body = {
      role: userRoles.map((role) => role.toLowerCase()),
    };
    console.log(body);
    const errors = Object.values(formError);
    try {
      if (!errors.some((error) => error.error === true)) {
        const response = await axiosPrivate.patch(
          `/users/${cohortUserToBeUpdated}`,
          body
        );
        console.log(response);
        onHandleCohortUsers((prevCohortUsers) =>
          prevCohortUsers.map((prevCohortUser) => {
            if (prevCohortUser.id === cohortUserToBeUpdated) {
              return {
                ...prevCohortUser,
                userRole: userRoles.map((role) => role.toLowerCase()),
              };
            } else {
              return prevCohortUser;
            }
          })
        );
        setReset(true);
        setUserRoles([]);
        onCloseDialog();
      } else {
        console.error(
          "There is an error preventing the form submission: check that your entires are correctly validated"
        );
      }
    } catch (error) {
      if (error.response.status === 403) {
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
        console.error(error);
      }
    }
  };

  return (
    <Dialog
      open={openDialog}
      TransitionComponent={Transition}
      onClose={onCloseDialog}
      fullWidth
      maxWidth="sm"
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
          Edit user:{" "}
        </Typography>
        <AppButton
          text={""}
          type="button"
          width="10%"
          handlerFunction={() => {
            onCloseDialog();
          }}
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
        onSubmit={handleEditCohortUserSubmit}
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
                  label={"Roles:"}
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
            text={"Edit user"}
            type="submit"
            width="100%"
            handlerFunction={() => {}}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditCohortUser;

EditCohortUser.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  cohortUserInfo: PropTypes.object.isRequired,
  onCloseDialog: PropTypes.func.isRequired,
  onHandleCohortUsers: PropTypes.func.isRequired,
};
