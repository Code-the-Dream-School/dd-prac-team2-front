/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { AdminPanelSettingsRounded, Close, School } from "@mui/icons-material";
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
import useAuth from "../../../../../hooks/useAuth";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";

/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "../RegisterUsers.module.css";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from "../../../../../components/Button/AppButton";
import AuthFormControl from "../../../../../components/FormControl/AuthFormControl";
import FormAutocomplete from "../../../../../components/Autocomplete/Autocomplete";
import FormSelect from "../../../../../components/Select/FormSelect";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const rolesList = ["Admin", "Mentor", "Student"];

const EditUser = ({
  openDialog,
  userInfo,
  fetchedCohorts,
  onCloseDialog,
  onHandleUsers,
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
  //Fetched data states:
  const [cohorts, setCohorts] = useState(fetchedCohorts);
  const [userRoles, setUserRoles] = useState(
    userInfo.row.userRole.map((role) => role[0].toUpperCase() + role.slice(1))
  );
  //Form states:
  const [cohortsValueSelected, setCohortsValueSelected] = useState(
    userInfo.row.userCohort
  );
  const [cohortsInputValueSelected, setCohortsInputValueSelected] =
    useState("");
  const [formError, setFormError] = useState({
    userCohortError: {
      error: false,
      errorMessage: "Please add a cohort for this user",
    },
    userRolesError: {
      error: true,
      errorMessage: "Please select a role for this user",
    },
  });
  console.log(cohorts, userInfo.row.userCohort);
  /*
    ==========================
    =   HANDLER FUNCTIONS    =
    ==========================
  */
  //User cohorts
  const handleValueSelectedChange = (newValue) => {
    setCohortsValueSelected(newValue);
  };
  // onSelect Role:
  const handleOnSelectRole = (selectedRoleName) => {
    setUserRoles(selectedRoleName);
  };

  //Edit dialog onSubmit:
  const handleEditUserSubmit = async (event) => {
    event.preventDefault();
    const userToBeUpdated = userInfo.row.id;
    const formattedUpdatedUser = {
      id: userToBeUpdated,
      userCohort: cohortsValueSelected,
      userRole: userRoles.map((role) => role.toLowerCase()).sort(),
    };
    const body = {
      role: formattedUpdatedUser.userRole,
      cohorts: formattedUpdatedUser.userCohort.map((cohort) => cohort.id),
    };
    const errors = Object.values(formError);
    try {
      if (!errors.some((error) => error.error === true)) {
        const response = await axiosPrivate.patch(
          `users/${userToBeUpdated}`,
          body
        );
        console.log(response);
        onHandleUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user.id === userToBeUpdated) {
              return {
                ...user,
                userCohort: formattedUpdatedUser.userCohort,
                userRole: formattedUpdatedUser.userRole,
              };
            } else {
              return user;
            }
          })
        );
        onCloseDialog();
      } else {
        console.error(
          "There are some errors preventing the form to be submitted"
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
  /* 
    ==========================
    =        EFFECTS         =
    ==========================
  */
  useEffect(() => {
    setFormError((prevState) => ({
      ...prevState,
      userCohortError: {
        ...prevState.userCohortError,
        error: cohortsValueSelected.length === 0 ? true : false,
      },
    }));
  }, [cohortsValueSelected]);

  useEffect(() => {
    setFormError((prevState) => ({
      ...prevState,
      userRolesError: {
        ...prevState.userRolesError,
        error: userRoles.length === 0 ? true : false,
      },
    }));
  }, [userRoles]);

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
        onSubmit={handleEditUserSubmit}
      >
        <DialogContent
          sx={{ width: "100%", height: "auto", paddingX: 0, paddingY: 1 }}
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
                <School fontSize="large" />
                <br></br>
                <br></br>
              </Box>
              <AuthFormControl width="100%" isNested={true}>
                <FormAutocomplete
                  multiple={true}
                  value={cohortsValueSelected}
                  computedIdProperty={"id"}
                  computedProperty={"cohort"}
                  onHandleSelectedValueChange={handleValueSelectedChange}
                  inputValue={cohortsInputValueSelected}
                  onHandleInputValueChange={setCohortsInputValueSelected}
                  options={cohorts}
                  error={formError.userCohortError}
                  variant={"dark"}
                ></FormAutocomplete>
              </AuthFormControl>
            </AuthFormControl>
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

export default EditUser;

EditUser.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired,
  fetchedCohorts: PropTypes.array.isRequired,
  onCloseDialog: PropTypes.func.isRequired,
  onHandleUsers: PropTypes.func.isRequired,
};
