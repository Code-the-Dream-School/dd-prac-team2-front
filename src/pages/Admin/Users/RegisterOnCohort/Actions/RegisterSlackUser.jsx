/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Slide,
  Typography,
} from "@mui/material";
import { Close, GroupAddRounded } from "@mui/icons-material";
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
import Loader from "../../../../../components/Loader/Loader";
import AuthFormControl from "../../../../../components/FormControl/AuthFormControl";
import Slack from "../../../Cohorts/TableRender/Slack";
import UserRoleRender from "../TableRenders/UserRoleRender";
import AppDataGrid from "../../../../../components/DataGrid/AppDataGrid";
import UserAvatarRender from "../TableRenders/UserAvatarRender";
import UserCohortRender from "../../Register/TableRenders/UserCohortRender";
import RegisterSlackUserActions from "./RegisterSlackUserActions";
import RegisterExistingSlackUserActions from "./RegisterExistingSlackUserActions";
/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RegisterSlackUser = ({
  open,
  cohortData,
  handleOpen,
  onRegisterCohortSubmit,
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
  const [newUsers, setNewUsers] = useState([]);
  const [newUsersToCohort, setNewUsersToCohort] = useState([]);
  const [newCohortId, setNewCohortId] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [loadingCoverUsers, setLoadingCoverUsers] = useState(false);
  const [loadingCoverExistingUsers, setLoadingCoverExistingUsers] = useState(false);

  /*
    ==========================
    =     AUX VARIABLES      =
    ==========================
  */
  const newUsersColumns = [
    { field: "id", headerName: "ID", maxWidth: 130, flex: 1 },
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
      field: "avatarUrl",
      headerName: "Avatar:",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 70,
      maxWidth: 70,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <UserAvatarRender
          name={params.row.name}
          avatarUrl={params.row.avatarUrl}
        ></UserAvatarRender>
      ),
    },
    {
      field: "name",
      headerName: "Name:",
      minWidth: 200,
      maxWidth: 200,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email:",
      minWidth: 275,
      maxWidth: 275,
      flex: 1,
    },
    {
      field: "role",
      headerName: "Roles: ",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 175,
      maxWidth: 175,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <UserRoleRender params={params} rowField="role"></UserRoleRender>
      ),
    },
    {
      field: "actions",
      headerName: "Actions: ",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 125,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <RegisterSlackUserActions
          params={params}
          onHandleNewUsers={setNewUsers}
        ></RegisterSlackUserActions>
      ),
    },
  ];

  const newUsersToCohortColumns = [
    { field: "id", headerName: "ID", maxWidth: 130, flex: 1 },
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
      field: "avatarUrl",
      headerName: "Avatar:",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 70,
      maxWidth: 70,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <UserAvatarRender
          name={params.row.name}
          avatarUrl={params.row.avatarUrl}
        ></UserAvatarRender>
      ),
    },
    {
      field: "name",
      headerName: "Name:",
      minWidth: 175,
      maxWidth: 175,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email:",
      minWidth: 250,
      maxWidth: 250,
      flex: 1,
    },
    {
      field: "roles",
      headerName: "Roles: ",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 150,
      maxWidth: 150,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <UserRoleRender params={params} rowField="roles"></UserRoleRender>
      ),
    },
    {
      field: "cohorts",
      headerName: "Cohorts: ",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 225,
      maxWidth: 225,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <UserCohortRender params={params} rowField="cohorts"></UserCohortRender>
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
        <RegisterExistingSlackUserActions
          params={params}
          newCohortId={newCohortId}
          onLoading={setLoadingCoverExistingUsers}
          onRegisterCohortSubmit={onRegisterCohortSubmit}
          onHandleNewExistingUsers={setNewUsersToCohort}
        ></RegisterExistingSlackUserActions>
      ),
    },
  ];
  /*
    ==========================
    =   HANDLER FUNCTIONS    =
    ==========================
  */
  const fetchNewUsersFromSlack = async () => {
    try {
      const response = await axiosPrivate.get(
        `slack/channels/${cohortData.cohortSlackId}/members`,
        { withCredentials: true }
      );
      setNewUsers(
        response.data.newUsers.list.map((user) => ({
          ...user,
          isSelected: false,
        }))
      );
      setNewUsersToCohort(
        response.data.newToCohort.list.map((user) => ({
          ...user,
          isSelected: false,
        }))
      );
      setNewCohortId(response.data.cohort.id);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleRegisterNewUsers = async () => {
    const users = newUsers
      .filter((newUser) => newUser.isSelected)
      .map((newUser) => {
        delete newUser.isSelected;
        return newUser;
      });
    if (users.length > 0) {
      try {
        setLoadingCoverUsers(true);
        const body = {
          users,
          cohort: newCohortId,
        };
        console.log(body);
        const response = await axiosPrivate.post("/auth/register", body);
        setNewUsers((prevNewUsers) =>
          prevNewUsers.filter((newUser) => newUser.isSelected === false)
        );
        onRegisterCohortSubmit((prevCohortUsers) => [
          ...prevCohortUsers,
          ...response.data.users.map((user) => ({
            id: user._id,
            slackId: user.slackId,
            userAvatar: user.avatarUrl,
            userName: user.name,
            userEmail: user.email,
            userRole: user.role.sort(),
            userActivatedStatus: user.isActivated,
          })),
        ]);
        setLoadingCoverUsers(false);
      } catch (error) {
        if (error.response.status === 403) {
          console.error(error);
          setLoadingCoverUsers(false);
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
          setLoadingCoverUsers(false);
          console.error(error);
        }
      }
    } else {
      console.warn("Select at least one user");
    }
  };

  const handleRegisterNewUsersToCohort = async () => {
    const users = newUsersToCohort.filter(
      (newUsersToCohort) => newUsersToCohort.isSelected
    );
    console.log(users);
    if (users.length > 0) {
      try {
        setLoadingCoverExistingUsers(true);
        const body = {
          userIDs: users.map((user) => user.id),
        };
        console.log(body);
        console.log(newCohortId)
        const response = await axiosPrivate.patch(
          `/users/add-to-cohort/${newCohortId}`,
          body
        );
        setNewUsersToCohort((prevNewUsersToCohort) =>
          prevNewUsersToCohort.filter(
            (newUserToCohort) => newUserToCohort.isSelected === false
          )
        );
        onRegisterCohortSubmit((prevCohortUsers) => [
          ...prevCohortUsers,
          ...users.map((user) => ({
            id: user.id,
            slackId: user.slackId,
            userAvatar: user.avatarUrl,
            userName: user.name,
            userEmail: user.email,
            userRole: user.roles.sort(),
            userActivatedStatus: user.isActivated,
          })),
        ]);
        setLoadingCoverExistingUsers(false);
      } catch (error) {
        if (error.response.status === 403) {
          console.error(error);
          setLoadingCoverExistingUsers(false);
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
          setLoadingCoverExistingUsers(false);
          console.error(error);
        }
      }
    } else {
      console.warn("Select at least one user");
    }
  };

  useEffect(() => {
    fetchNewUsersFromSlack();
  }, []);

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={() => handleOpen(false)}
        fullWidth
        maxWidth="lg"
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
            {`Slack members available for ${cohortData.cohortName}:`}
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
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#C84B31",
          }}
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
                  height: "800px",
                }}
              >
                <Loader />
              </Box>
            </DialogContent>
          ) : (
            <DialogContent
              sx={{ width: "95%", height: "auto", paddingX: 1, paddingY: 1 }}
              dividers
            >
              <div className={styles.formContainer}>
                <AuthFormControl width="100%">
                  <Typography
                    variant="h2"
                    textAlign={"center"}
                    fontSize={"30px"}
                    fontWeight={"bold"}
                    color={"black"}
                  >
                    New Users:
                  </Typography>
                </AuthFormControl>
                <AuthFormControl width="100%">
                  <AppDataGrid
                    columns={newUsersColumns}
                    rows={newUsers}
                    fieldToBeSorted={"name"}
                    sortType={"asc"}
                    loading={loadingCoverUsers}
                    rowId="slackId"
                    checkBoxSelection={true}
                    onSelectBox={setNewUsers}
                    variant={"dark"}
                  />
                </AuthFormControl>
                <AuthFormControl width="75%">
                  <AppButton
                    text={"Register selected users"}
                    type="button"
                    width="50%"
                    handlerFunction={handleRegisterNewUsers}
                  >
                    <GroupAddRounded fontSize="large"></GroupAddRounded>
                  </AppButton>
                </AuthFormControl>
                <Divider
                  flexItem
                  sx={{
                    "&::before, &::after": {
                      borderColor: "white",
                      borderWidth: "1px",
                    },
                  }}
                ></Divider>
                <AuthFormControl width="100%">
                  <Typography
                    variant="h2"
                    textAlign={"center"}
                    fontSize={"30px"}
                    fontWeight={"bold"}
                    color={"black"}
                  >
                    {`New to ${cohortData.cohortName}:`}
                  </Typography>
                </AuthFormControl>
                <AuthFormControl width="100%">
                  <AppDataGrid
                    columns={newUsersToCohortColumns}
                    rows={newUsersToCohort}
                    fieldToBeSorted={"name"}
                    sortType={"asc"}
                    loading={loadingCoverExistingUsers}
                    checkBoxSelection={true}
                    onSelectBox={setNewUsersToCohort}
                    variant={"dark"}
                  />
                </AuthFormControl>
                <AuthFormControl width="75%">
                  <AppButton
                    text={"Add selected users"}
                    type="button"
                    width="50%"
                    handlerFunction={handleRegisterNewUsersToCohort}
                  >
                    <GroupAddRounded fontSize="large"></GroupAddRounded>
                  </AppButton>
                </AuthFormControl>
              </div>
            </DialogContent>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default RegisterSlackUser;

RegisterSlackUser.propTypes = {
  open: PropTypes.bool.isRequired,
  cohortData: PropTypes.object.isRequired,
  handleOpen: PropTypes.func.isRequired,
  onRegisterCohortSubmit: PropTypes.func.isRequired,
};
