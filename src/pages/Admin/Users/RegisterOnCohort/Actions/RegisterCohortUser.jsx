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
import PropTypes from "prop-types";

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { forwardRef, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "../RegisterOnCohort.module.css";
/*
    ==========================
    =          HOOKS         =
    ==========================
*/
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../../hooks/useAuth";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AuthFormControl from "../../../../../components/FormControl/AuthFormControl";
import FormTextField from "../../../../../components/TextField/FormTextField";
import FormSelect from "../../../../../components/Select/FormSelect";
import AppButton from "../../../../../components/Button/AppButton";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const rolesList = ["Admin", "Mentor", "Student"];

const RegisterCohortUser = ({
  open,
  handleOpen,
  onRegisterCohortSubmit,
  onLoading,
  onToast,
}) => {
  /*
    ==========================
    =          HOOKS         =
    ==========================
  */
  const { cohortId } = useParams();
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
  const [userRoles, setUserRoles] = useState([]);
  const [formError, setFormError] = useState({
    userNameError: {
      error: false,
      errorMessage: "Please enter a valid name",
    },
    userEmailError: {
      error: false,
      errorMessage: "Please enter a valid e-mail address",
    },
    userRolesError: {
      error: true,
      errorMessage: "Please select a role for this user",
    },
  });
  const [reset, setReset] = useState(false);

  /*
    ==========================
    =   HANDLER FUNCTIONS    =
    ==========================
  */
  // onSelect Role:
  const handleOnSelectRole = (selectedRoleName) => {
    setUserRoles(selectedRoleName);
  };

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

  //Form submit:
  const handleRegisterOnCohortSubmit = async (event) => {
    event.preventDefault();
    onLoading(true);
    const formattedUserRegistration = {
      users: [
        {
          name: event.target.userName.value.trim(),
          email: event.target.userEmail.value.trim(),
          role: userRoles.map((role) => role.toLowerCase()),
        },
      ],
      cohort: cohortId,
    };
    const errors = Object.values(formError);
    try {
      if (!errors.some((error) => error.error === true)) {
        const response = await axiosPrivate.post(
          "auth/register",
          formattedUserRegistration
        );
        console.log(response);
        if (response.data.users.length > 0) {
          onRegisterCohortSubmit((prevState) => [
            ...prevState,
            {
              id: response.data.users[0]._id,
              slackId: response.data.users[0].slackId,
              userAvatar: response.data.users[0].avatarUrl,
              userName: response.data.users[0].name,
              userEmail: response.data.users[0].email,
              userRole: response.data.users[0].role.sort(),
              userActivatedStatus: response.data.users[0].isActivated,
            },
          ]);
          setReset(true);
          setUserRoles([]);
          handleOpen(false);
          onToast({
            isOpened: true,
            severity: "success",
            message: `Success! User ${response.data.users[0].name} has been added.`,
          });
        } else if (response.data.errors.length > 0) {
          onToast({
            isOpened: true,
            severity: "error",
            message: `Error! ${response.data.errors}`,
          });
        }
        onLoading(false);
      } else {
        onLoading(false);
        onToast({
          isOpened: true,
          severity: "warning",
          message: `Warning! Please enter valid data into the form fields`,
        });
      }
    } catch (error) {
      if (error.response.status === 403) {
        onLoading(false);
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
      userRolesError: {
        ...prevState.userRolesError,
        error: userRoles.length === 0 ? true : false,
      },
    }));
  }, [userRoles]);

  useEffect(() => {
    setReset(false);
  });
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={() => handleOpen(false)}
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
            color: "#C84B31",
          }}
          autoComplete="off"
          onSubmit={handleRegisterOnCohortSubmit}
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
              </AuthFormControl>
              <AuthFormControl width="75%">
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
              text={"Add user"}
              type="submit"
              width="auto"
              handlerFunction={() => {}}
            ></AppButton>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default RegisterCohortUser;

RegisterCohortUser.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  onRegisterCohortSubmit: PropTypes.func.isRequired,
  onLoading: PropTypes.func,
  onToast: PropTypes.func,
};
