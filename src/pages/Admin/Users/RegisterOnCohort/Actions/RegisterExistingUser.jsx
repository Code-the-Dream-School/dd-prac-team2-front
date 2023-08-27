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
import { Close, GroupAddRounded } from "@mui/icons-material";
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
import AppButton from "../../../../../components/Button/AppButton";
import AuthFormControl from "../../../../../components/FormControl/AuthFormControl";
import FormAutocomplete from "../../../../../components/Autocomplete/Autocomplete";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RegisterExistingUser = ({ open, handleOpen, onRegisterCohortSubmit }) => {
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
  // Fetched data states:
  const [users, setUsers] = useState([]);
  const [usersValueSelected, setUsersValueSelected] = useState([
    {
      id: "",
      name: "",
    },
  ]);
  const [usersInputValueSelected, setUsersInputValueSelected] = useState("");
  const [formError, setFormError] = useState({
    usersError: {
      error: false,
      errorMessage: "Please add a cohort for this user",
    },
  });
  /*
    ==========================
    =    ASYNC FUNCTIONS     =
    ==========================
  */
  const fetchAvailableUsers = async () => {
    try {
      const response = await axiosPrivate.get("/users");
      if (response.status === 200) {
        const availableUsers = response.data.users.filter((user) => {
          const userCohorts = user.cohorts.map((cohort) => cohort._id);
          if (!userCohorts.includes(cohortId)) {
            return user;
          }
        });
        console.log(availableUsers);
        setUsers(availableUsers);
        setUsersValueSelected([availableUsers[0]]);
      } else {
        console.error("There was an error fetching the users of this cohort");
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
    =   HANDLER FUNCTIONS    =
    ==========================
  */
  //User cohorts
  const handleValueSelectedChange = (newValue) => {
    setUsersValueSelected(newValue);
  };

  //Users submission
  const handleExistingUserSubmission = async (event) => {
    event.preventDefault();
    const formattedUserRegistration = {
      users: usersValueSelected.map((user) => ({
        name: user.name,
        email: user.email,
        role: user.roles,
      })),
      cohort: cohortId,
    };
    const errors = Object.values(formError);
    try {
      if (!errors.some((error) => error.error === true)) {
        const response = await axiosPrivate.post(
          "auth/register",
          formattedUserRegistration
        );
        console.log(...response.data.users);
        if (response.data.users.length > 0) {
          onRegisterCohortSubmit((prevState) => [
            ...prevState,
            ...response.data.users.map((user) => ({
              id: user._id,
              userName: user.name,
              userEmail: user.email,
              userRole: user.role,
              userActivatedStatus: user.isActivated,
            })),
          ]);
          handleOpen(false);
        } else if (response.data.errors.length > 0) {
          console.error(response.data.errors);
        }
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
  /* 
    ==========================
    =        EFFECTS         =
    ==========================
 */
  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  useEffect(() => {
    setFormError((prevState) => ({
      ...prevState,
      usersError: {
        ...prevState.usersError,
        error: usersValueSelected.length === 0 ? true : false,
      },
    }));
  }, [usersValueSelected]);

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
            Add an existing user:
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
          onSubmit={handleExistingUserSubmission}
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
                  <GroupAddRounded fontSize="large" />
                  <br></br>
                  <br></br>
                </Box>
                <AuthFormControl width="100%" isNested={true}>
                  <FormAutocomplete
                    multiple={true}
                    value={usersValueSelected}
                    computedIdProperty={"id"}
                    computedProperty={"name"}
                    onHandleSelectedValueChange={handleValueSelectedChange}
                    inputValue={usersInputValueSelected}
                    onHandleInputValueChange={setUsersInputValueSelected}
                    options={users}
                    error={formError.usersError}
                    variant={"dark"}
                  ></FormAutocomplete>
                </AuthFormControl>
              </AuthFormControl>
            </div>
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <AppButton
              text={"Add user(s)"}
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

export default RegisterExistingUser;
