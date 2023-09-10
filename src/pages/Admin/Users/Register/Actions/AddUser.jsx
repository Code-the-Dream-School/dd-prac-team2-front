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
  School,
} from "@mui/icons-material";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { forwardRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "../RegisterUsers.module.css";

/*
    ==========================
    =         HOOKS          =
    ==========================
*/
import useAuth from "../../../../../hooks/useAuth";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from "../../../../../components/Button/AppButton";
import AuthFormControl from "../../../../../components/FormControl/AuthFormControl";
import FormTextField from "../../../../../components/TextField/FormTextField";
import FormAutocomplete from "../../../../../components/Autocomplete/Autocomplete";
import FormSelect from "../../../../../components/Select/FormSelect";
import Loader from "../../../../../components/Loader/Loader";

/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const rolesList = ["Admin", "Mentor", "Student"];
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddUser = ({ open, cohorts, handleOpen, onHandleUsers, onToast }) => {
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
  // From states
  const [userRoles, setUserRoles] = useState([]);
  const [cohortsValueSelected, setCohortsValueSelected] = useState(cohorts[0]);
  const [cohortsInputValueSelected, setCohortsInputValueSelected] =
    useState("");
  const [formError, setFormError] = useState({
    userNameError: {
      error: false,
      errorMessage: "Please enter a valid name",
    },
    userEmailError: {
      error: false,
      errorMessage: "Please enter a valid e-mail address",
    },
    userCohortError: {
      error: false,
      errorMessage: "Please add a cohort for this user",
    },
    userRolesError: {
      error: true,
      errorMessage: "Please select a role for this user",
    },
  });
  const [reset, setReset] = useState(false);
  const [loading, setLoading] = useState(false);

  /*
    ==========================
    =   HANDLER FUNCTIONS    =
    ==========================
  */
  // User name:
  const handleUserNameError = (inputError) => {
    setFormError((prevState) => ({
      ...prevState,
      userNameError: {
        ...prevState.userNameError,
        error: inputError,
      },
    }));
  };

  //User email
  const handleUserEmailError = (inputError) => {
    setFormError((prevState) => ({
      ...prevState,
      userEmailError: {
        ...prevState.userEmailError,
        error: inputError,
      },
    }));
  };

  //User cohorts
  const handleValueSelectedChange = (newValue) => {
    setCohortsValueSelected(newValue);
  };

  // onSelect Role:
  const handleOnSelectRole = (selectedRoleName) => {
    setUserRoles(selectedRoleName);
  };

  // Form submit:
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const errors = Object.values(formError);
    try {
      setLoading(true);
      if (!errors.some((error) => error.error === true)) {
        const formattedUserRegistration = {
          users: [
            {
              name: event.target.userName.value.trim(),
              email: event.target.userEmail.value.trim(),
              role: userRoles.map((role) => role.toLowerCase()),
            },
          ],
          cohort: cohortsValueSelected.id,
        };
        const response = await axiosPrivate.post(
          "auth/register",
          formattedUserRegistration
        );
        if (response.data.users.length > 0) {
          onHandleUsers((prevState) => [
            ...prevState,
            {
              id: response.data.users[0]._id,
              userName: response.data.users[0].name,
              userEmail: response.data.users[0].email,
              userCohort: [cohortsValueSelected],
              userRole: response.data.users[0].role,
              userActivatedStatus: response.data.users[0].isActivated,
            },
          ]);
          onToast({
            isOpened: true,
            severity: "success",
            message: `Success! User ${response.data.users[0].name} has been registered`,
          });
          setLoading(false);
          setReset(true);
          setCohortsValueSelected(cohorts[0]);
          setUserRoles([]);
        } else if (response.data.errors.length > 0) {
          onToast({
            isOpened: true,
            severity: "error",
            message: `Error! ${response.data.errors}`,
          });
          setLoading(false);
        }
      } else {
        setLoading(false);
        onToast({
          isOpened: true,
          severity: "warning",
          message: `Warning! Please enter valid data into the form fields`,
        });
      }
    } catch (error) {
      if (error.response.status === 403) {
        setLoading(false);
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
        setLoading(false);
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
        error: cohortsValueSelected === null ? true : false,
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
          Add a new user:
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
        onSubmit={handleRegisterSubmit}
      >
        {loading ? (
          <DialogContent
            sx={{ width: "100%", height: "auto", paddingX: 0, paddingY: 1 }}
            dividers
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100px",
              }}
            >
              <Loader />
            </Box>
          </DialogContent>
        ) : (
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
                  <BadgeRounded fontSize="large"></BadgeRounded>
                  <br></br>
                  <br></br>
                </Box>
                <FormTextField
                  required
                  type="text"
                  label="Name:"
                  name="userName"
                  isFocused={true}
                  width="100%"
                  variant="dark"
                  regex={/^(?!\s)(.{3,})(?<!\s)$/}
                  onHandleError={handleUserNameError}
                  errorMessage={"Please enter a valid name"}
                  reset={reset}
                ></FormTextField>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Email fontSize="large"></Email>
                  <br></br>
                  <br></br>
                </Box>
                <FormTextField
                  required
                  type="text"
                  label="E-mail:"
                  name="userEmail"
                  isFocused={false}
                  width="100%"
                  variant="dark"
                  regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
                  onHandleError={handleUserEmailError}
                  errorMessage={"Please enter a valid e-mail address"}
                  reset={reset}
                ></FormTextField>
              </AuthFormControl>
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
                    multiple={false}
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
        )}
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <AppButton
            text={"Add user"}
            type="submit"
            width="100%"
            handlerFunction={() => {}}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddUser;

AddUser.propTypes = {
  open: PropTypes.bool,
  cohorts: PropTypes.array,
  handleOpen: PropTypes.func,
  onHandleUsers: PropTypes.func,
  onToast: PropTypes.func,
};
