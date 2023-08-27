/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { Container, Paper, Box, Typography } from "@mui/material";
import {
  AccountBoxRounded,
  AdminPanelSettingsRounded,
  BadgeRounded,
  CloudDownloadRounded,
  Email,
  FindInPageRounded,
  PersonAddRounded,
  PersonSearch,
} from "@mui/icons-material";

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "./RegisterOnCohort.module.css";

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
import AppDataGrid from "../../../../components/DataGrid/AppDataGrid";
import AppButton from "../../../../components/Button/AppButton";
import UserRoleRender from "./TableRenders/UserRoleRender";
import UserStatusRender from "./TableRenders/UserStatusRender";
import RegisterOnCohortActions from "./Actions/RegisterOnCohortActions";
import AuthFormControl from "../../../../components/FormControl/AuthFormControl";
import FormTextField from "../../../../components/TextField/FormTextField";
import FormSelect from "../../../../components/Select/FormSelect";
import RegisterCohortUser from "./Actions/RegisterCohortUser";

const RegisterOnCohort = () => {
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
  //Fetched data states:
  const [cohortUsers, setCohortUsers] = useState([]);
  const [cohortData, setCohortData] = useState({});
  // Dialog states
  const [openNewUserDialog, setOpenNewUserDialog] = useState(false);
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
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <RegisterOnCohortActions
          params={params}
          cohortData={cohortData}
          onHandleCohortUsers={setCohortUsers}
        ></RegisterOnCohortActions>
      ),
    },
  ];
  /*
    ==========================
    =    ASYNC FUNCTIONS     =
    ==========================
  */
  const fetchCohortUsers = async () => {
    try {
      const response = await axiosPrivate(`cohort/${cohortId}`);
      console.log(response);
      if (response.status === 200) {
        const participants = response.data.cohort[0].participants;
        const formattedUsers = participants.map((participant) => {
          return {
            id: participant._id,
            userName: participant.name,
            userEmail: participant.email,
            userRole: participant.role,
            userActivatedStatus: participant.isActivated,
          };
        });
        const formattedCohortData = {
          cohortId: cohortId,
          cohortName: response.data.cohort[0].name,
        };
        console.log(formattedUsers);
        setCohortUsers(formattedUsers);
        setCohortData(formattedCohortData);
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
  //1. Function to navigate back
  const goBack = () => {
    navigate(-1);
  };

  /* 
    ==========================
    =        EFFECTS         =
    ==========================
  */
  useEffect(() => {
    fetchCohortUsers();
  }, []);

  return (
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
          {cohortData.cohortName}'S users management{" "}
        </Typography>
        <div className={styles.formContainer}>
          <AuthFormControl width="75%">
            <AppButton
              text={"Add new user"}
              type="button"
              width="100%"
              handlerFunction={() => setOpenNewUserDialog(true)}
            >
              <PersonAddRounded fontSize="large"></PersonAddRounded>
            </AppButton>
            <AppButton
              text={"Add existing user"}
              type="button"
              width="100%"
              handlerFunction={() => {}}
            >
              <PersonSearch fontSize="large"></PersonSearch>
            </AppButton>
            <AppButton
              text={"Add users from Slack"}
              type="button"
              width="100%"
              handlerFunction={() => {}}
            >
              <CloudDownloadRounded fontSize="large"></CloudDownloadRounded>
            </AppButton>
          </AuthFormControl>
        </div>
        <AppDataGrid
          columns={columns}
          rows={cohortUsers}
          pageSize={15}
          fieldToBeSorted={"userName"}
          sortType={"asc"}
        />
        <div className={styles.buttonContainer}>
          <AppButton
            text={"Go back"}
            type="button"
            width="100%"
            handlerFunction={() => {
              goBack();
            }}
          ></AppButton>
        </div>
        {openNewUserDialog ? <RegisterCohortUser open={openNewUserDialog} handleOpen={setOpenNewUserDialog} onRegisterOnCohortSubmit={setCohortUsers}></RegisterCohortUser> : null}
      </Paper>
    </Container>
  );
};

export default RegisterOnCohort;
