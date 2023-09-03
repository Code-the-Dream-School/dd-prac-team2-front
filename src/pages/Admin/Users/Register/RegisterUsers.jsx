/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Container, Paper, TextField, Typography } from "@mui/material";
import {
  AdminPanelSettingsRounded,
  BadgeRounded,
  Email,
  School,
} from "@mui/icons-material";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "./RegisterUsers.module.css";

/*
    ==========================
    =         HOOKS          =
    ==========================
*/
import useAuth from "../../../../hooks/useAuth";

/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import UserRoleRender from "../RegisterOnCohort/TableRenders/UserRoleRender";
import UserStatusRender from "../RegisterOnCohort/TableRenders/UserStatusRender";
import AppDataGrid from "../../../../components/DataGrid/AppDataGrid";
import RegisterUserActions from "./Actions/RegisterUserActions";
import UserCohortRender from "./TableRenders/UserCohortRender";
import AuthFormControl from "../../../../components/FormControl/AuthFormControl";
import FormAutocomplete from "../../../../components/Autocomplete/Autocomplete";
import FormTextField from "../../../../components/TextField/FormTextField";
import FormSelect from "../../../../components/Select/FormSelect";
import AppButton from "../../../../components/Button/AppButton";
import Loader from "../../../../components/Loader/Loader";
/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const rolesList = ["Admin", "Mentor", "Student"];

const RegisterUsers = () => {
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
  // Fetched data states:
  const [users, setUsers] = useState([]);
  console.log(users);
  const [cohorts, setCohorts] = useState([]);
  // From states
  const [userRoles, setUserRoles] = useState([]);
  const [cohortsValueSelected, setCohortsValueSelected] = useState({
    id: "",
    cohort: "",
  });
  const [cohortsInputValueSelected, setCohortsInputValueSelected] =
    useState("");
  const [loading, setLoading] = useState(false);
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
  /*
        ==========================
        =      AUX VARIABLES     =
        ==========================
    */
  const columns = [
    { field: "id", headerName: "ID", minWidth: 100, maxWidth: 130, flex: 1 },
    {
      field: "userName",
      headerName: "Full name:",
      minWidth: 250,
      maxWidth: 250,
      flex: 1,
    },
    {
      field: "userEmail",
      headerName: "E-mail:",
      minWidth: 200,
      maxWidth: 300,
      flex: 1,
    },
    {
      field: "userCohort",
      headerName: "Cohort: ",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 250,
      maxWidth: 750,
      flex: 2,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <UserCohortRender params={params}></UserCohortRender>
      ),
    },
    {
      field: "userRole",
      headerName: "Roles: ",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 250,
      maxWidth: 250,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => <UserRoleRender params={params}></UserRoleRender>,
    },
    {
      field: "userActivatedStatus",
      headerName: "Status: ",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 100,
      maxWidth: 100,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <UserStatusRender params={params}></UserStatusRender>
      ),
    },
    {
      field: "actions",
      headerName: "Actions: ",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 180,
      flex: 0.5,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <RegisterUserActions
          params={params}
          fetchedCohorts={cohorts}
          onHandleUsers={setUsers}
        ></RegisterUserActions>
      ),
    },
  ];

  /*
    ==========================
    =    ASYNC FUNCTIONS     =
    ==========================
  */
  const fetchUsers = async () => {
    try {
      setLoading(true); //Set loading before sending API request//
      const response = await axiosPrivate.get("/users");
      console.log(response);
      if (response.status === 200) {
        const formattedUsers = response.data.users.map((user) => {
          return {
            id: user.id,
            userName: user.name,
            userEmail: user.email,
            userCohort: user.cohorts.map((cohort) => ({
              id: cohort._id,
              cohort: cohort.name,
            })),
            userRole: user.roles.sort(),
            userActivatedStatus: user.isActivated,
          };
        });
        setUsers(formattedUsers);
        setLoading(false); // Stop loading in case of error
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

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get("/cohort");
      const formattedCohorts = response.data.cohorts.map((cohort) => {
        return {
          id: cohort._id,
          cohort: cohort.name,
        };
      });
      setCohorts(formattedCohorts);
      setCohortsValueSelected(formattedCohorts[0]);
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
    setLoading(false);
  };

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
  const handleRegisterOnCohortSubmit = async (event) => {
    event.preventDefault();
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
    const errors = Object.values(formError);
    try {
      setLoading(true);
      if (!errors.some((error) => error.error === true)) {
        const response = await axiosPrivate.post(
          "auth/register",
          formattedUserRegistration
        );
        console.log(response);
        if (response.data.users.length > 0) {
          setUsers((prevState) => [
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
          setReset(true);
          setCohortsValueSelected(cohorts[0]);
          setUserRoles([]);
        } else if (response.data.errors.length > 0) {
          console.error(response.data.errors);
        }
      } else {
        console.error(
          "There is an error preventing the form submission: check that your entires are correctly validated"
        );
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  /* 
      ==========================
      =        EFFECTS         =
      ==========================
  */
  useEffect(() => {
    fetchUsers();
    fetchCohorts();
  }, []);

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
    <Container maxWidth="xl">
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#1A1A2E",
          color: "#FFFFFF",
          borderRadius: "10px",
          padding: 2,
          height: "auto",
        }}
      >
        <Typography
          component={"h1"}
          sx={{
            backgroundColor: "#C84B31",
            borderRadius: 2,
            padding: 1,
            margin: 1,
            textAlign: "center",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          {" "}
          Users Management{" "}
        </Typography>
        <Box
          component={"form"}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
          autoComplete="off"
          onSubmit={handleRegisterOnCohortSubmit}
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
                variant="light"
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
                variant="light"
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
                  variant={"light"}
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
                  variant={"light"}
                  multiple={true}
                  error={formError.userRolesError}
                ></FormSelect>
              </AuthFormControl>
            </AuthFormControl>
            <AppButton
              text={"Add new user"}
              type="submit"
              width="25%"
              handlerFunction={() => {}}
            />
          </div>
        </Box>
        {loading ? (
          <Loader />
        ) : (
          // null}
          <AppDataGrid
            columns={columns}
            rows={users}
            pageSize={10}
            fieldToBeSorted={"userName"}
            sortType={"asc"}
          />
        )}
      </Paper>
    </Container>
  );
};

export default RegisterUsers;
