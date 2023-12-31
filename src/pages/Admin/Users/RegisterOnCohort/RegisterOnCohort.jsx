/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Container, Paper, Box, Typography } from "@mui/material";
import {
  CloudDownloadRounded,
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
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

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
import RegisterCohortUser from "./Actions/RegisterCohortUser";
import RegisterExistingUser from "./Actions/RegisterExistingUser";
import RegisterSlackUser from "./Actions/RegisterSlackUser";
import Loader from "../../../../components/Loader/Loader";
import Slack from "../../Cohorts/TableRender/Slack";
import UserAvatarRender from "./TableRenders/UserAvatarRender";
import ToastMessage from "../../../../components/ToastMessage/ToastMessage";

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
  const [loading, setLoading] = useState(true);
  const [loadingCover, setLoadingCover] = useState(false);
  const [toast, setToast] = useState({
    isOpened: false,
    severity: "",
    message: "",
  });
  //Fetched data states:
  const [cohortUsers, setCohortUsers] = useState([]);
  const [cohortData, setCohortData] = useState({
    cohortId: "",
    cohortSlackId: null,
    cohortName: "",
  });
  // Dialog states
  const [openNewUserDialog, setOpenNewUserDialog] = useState(false);
  const [openExistingUserDialog, setOpenExistingUserDialog] = useState(false);
  const [openNewSlackUserDialog, setOpenNewSlackUserDialog] = useState(false);

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
      headerName: "Created with:",
      minWidth: 100,
      maxWidth: 100,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => <Slack params={params}></Slack>,
      sortComparator: (v1, v2) => {
        v1.value = v1.row.slackId === undefined ? "0" : "1";
        v2.value = v2.row.slackId === undefined ? "0" : "1";
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
      minWidth: 225,
      maxWidth: 225,
      flex: 1,
    },
    {
      field: "userEmail",
      headerName: "E-mail:",
      minWidth: 225,
      maxWidth: 325,
      flex: 1,
    },
    {
      field: "userRole",
      headerName: "Roles: ",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 160,
      maxWidth: 160,
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
          onLoading={setLoadingCover}
          onHandleCohortUsers={setCohortUsers}
          onToast={setToast}
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
      if (response.status === 200) {
        const participants = response.data.cohort[0].participants;
        const formattedUsers = participants.map((participant) => {
          return {
            id: participant._id,
            slackId: participant.slackId,
            userAvatar: participant.avatarUrl,
            userName: participant.name,
            userEmail: participant.email,
            userRole: participant.role.sort(),
            userActivatedStatus: participant.isActivated,
          };
        });
        const formattedCohortData = {
          cohortId: cohortId,
          cohortSlackId: response.data.cohort[0].slackId,
          cohortName: response.data.cohort[0].name,
        };
        setCohortUsers(formattedUsers);
        setCohortData(formattedCohortData);
        setLoading(false);
      } else {
        console.error("There was an error fetching the users of this cohort");
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
                    handlerFunction={() => setOpenExistingUserDialog(true)}
                  >
                    <PersonSearch fontSize="large"></PersonSearch>
                  </AppButton>
                  {cohortData.cohortSlackId !== null ? (
                    <AppButton
                      text={"Add users from Slack"}
                      type="button"
                      width="100%"
                      handlerFunction={() => setOpenNewSlackUserDialog(true)}
                    >
                      <CloudDownloadRounded fontSize="large"></CloudDownloadRounded>
                    </AppButton>
                  ) : null}
                </AuthFormControl>
              </div>
              {loading ? (
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
              ) : (
                <AppDataGrid
                  columns={columns}
                  rows={cohortUsers}
                  pageSize={15}
                  fieldToBeSorted={"userName"}
                  sortType={"asc"}
                  loading={loadingCover}
                />
              )}
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
              {openNewUserDialog ? (
                <RegisterCohortUser
                  open={openNewUserDialog}
                  handleOpen={setOpenNewUserDialog}
                  onRegisterCohortSubmit={setCohortUsers}
                  onLoading={setLoadingCover}
                  onToast={setToast}
                ></RegisterCohortUser>
              ) : null}
              {openExistingUserDialog ? (
                <RegisterExistingUser
                  open={openExistingUserDialog}
                  handleOpen={setOpenExistingUserDialog}
                  onRegisterCohortSubmit={setCohortUsers}
                  onLoading={setLoadingCover}
                  onToast={setToast}
                ></RegisterExistingUser>
              ) : null}
              {openNewSlackUserDialog ? (
                <RegisterSlackUser
                  open={openNewSlackUserDialog}
                  cohortData={cohortData}
                  handleOpen={setOpenNewSlackUserDialog}
                  onRegisterCohortSubmit={setCohortUsers}
                />
              ) : null}
            </Paper>
          </Container>
        </>
      )}
    </>
  );
};

export default RegisterOnCohort;
