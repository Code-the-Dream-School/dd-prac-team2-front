/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Container, Paper, Typography } from "@mui/material";
import { PersonAddRounded } from "@mui/icons-material";

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
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
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
import AppButton from "../../../../components/Button/AppButton";
import Loader from "../../../../components/Loader/Loader";
import Slack from "../../Cohorts/TableRender/Slack";
import UserAvatarRender from "../RegisterOnCohort/TableRenders/UserAvatarRender";
import AddUser from "./Actions/AddUser";
import ToastMessage from './../../../../components/ToastMessage/ToastMessage';

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
  // Fetched data states:
  const [users, setUsers] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    isOpened: false,
    severity: "",
    message: "",
  });
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  /*
    ==========================
    =      AUX VARIABLES     =
    ==========================
  */
  const columns = [
    { field: "id", headerName: "ID", minWidth: 100, maxWidth: 130, flex: 1 },
    {
      field: "slackId",
      headerName: "ID",
      minWidth: 100,
      maxWidth: 130,
      flex: 1,
    },
    {
      field: "slack",
      headerName: "Created on:",
      minWidth: 100,
      maxWidth: 100,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => <Slack params={params}></Slack>,
      sortComparator: (v1, v2) => {
        v1.value = v1.row.slackId === null ? "0" : "1";
        v2.value = v2.row.slackId === null ? "0" : "1";
        return v1.value.localeCompare(v2.value);
      },
    },
    {
      field: "userAvatar",
      headerName: "Avatar:",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 70,
      maxWidth: 70,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <UserAvatarRender
          name={params.row.userName}
          avatarUrl={params.row.userAvatar}
        ></UserAvatarRender>
      ),
    },
    {
      field: "userName",
      headerName: "Name:",
      minWidth: 200,
      maxWidth: 200,
      flex: 1,
    },
    {
      field: "userEmail",
      headerName: "E-mail:",
      minWidth: 225,
      maxWidth: 225,
      flex: 1,
    },
    {
      field: "userCohort",
      headerName: "Cohort: ",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 175,
      maxWidth: 175,
      flex: 1,
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
      minWidth: 150,
      maxWidth: 150,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => <UserRoleRender params={params}></UserRoleRender>,
    },
    {
      field: "userActivatedStatus",
      headerName: "Status: ",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 95,
      maxWidth: 95,
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
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <RegisterUserActions
          params={params}
          fetchedCohorts={cohorts}
          onHandleUsers={setUsers}
          onToast={setToast}
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
      if (response.status === 200) {
        const formattedUsers = response.data.users.map((user) => {
          return {
            id: user.id,
            slackId: user.slackId,
            userAvatar: user.avatarUrl,
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
      =        EFFECTS         =
      ==========================
  */
  useEffect(() => {
    fetchUsers();
    fetchCohorts();
  }, []);

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <>
          <ToastMessage
            open={toast.isOpened}
            severity={toast.severity}
            variant="filled"
            onClose={() =>
              setToast((prevToast) => ({ ...prevToast, isOpened: false }))
            }
            dismissible
            message={toast.message}
          ></ToastMessage>
          <Container maxWidth="lg">
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
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div className={styles.formContainer}>
                  <AuthFormControl width="30%">
                    <AppButton
                      text={"Add new user"}
                      type="button"
                      width="100%"
                      handlerFunction={() => setOpenAddUserDialog(true)}
                    >
                      <PersonAddRounded fontSize="large"></PersonAddRounded>
                    </AppButton>
                  </AuthFormControl>
                </div>
              </Box>
              <AppDataGrid
                columns={columns}
                rows={users}
                pageSize={10}
                fieldToBeSorted={"userName"}
                sortType={"asc"}
              />
              {openAddUserDialog ? (
                <AddUser
                  open={openAddUserDialog}
                  cohorts={cohorts}
                  handleOpen={setOpenAddUserDialog}
                  onHandleUsers={setUsers}
                  onLoading={setLoading}
                  onToast={setToast}
                ></AddUser>
              ) : null}
            </Paper>
          </Container>
        </>
      )}
    </>
  );
};

export default RegisterUsers;
