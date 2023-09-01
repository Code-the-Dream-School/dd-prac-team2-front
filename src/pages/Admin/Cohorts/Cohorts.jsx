/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Box, Container, Paper, Typography } from "@mui/material";
import { Class, CloudDownloadRounded } from "@mui/icons-material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
/*
    ==========================
    =         HOOKS          =
    ==========================
*/
import useAuth from "../../../hooks/useAuth";
/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "./Cohorts.module.css";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AuthFormControl from "../../../components/FormControl/AuthFormControl";
import AppButton from "../../../components/Button/AppButton";
import AppDataGrid from "../../../components/DataGrid/AppDataGrid";
import CohortsActions from "./Actions/CohortsActions";
import Loader from "../../../components/Loader/Loader";
import AddCohort from "./Actions/AddCohort";
import AddCohortSlack from "./Actions/AddCohortSlack";
import Slack from "./TableRender/Slack";
import Members from "./TableRender/Members";
import Lessons from "./TableRender/Lessons";
import ClassType from "./TableRender/ClassType";

const Cohorts = () => {
  /*
    ==========================
    =         STATES         =
    ==========================
  */
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    { field: "id", headerName: "ID", maxWidth: 130, flex: 1 },
    {
      field: "slackId",
      headerName: "Slack ID",
      minWidth: 120,
      maxWidth: 250,
      flex: 1,
    },
    {
      field: "slack",
      headerName: "Created on:",
      minWidth: 90,
      maxWidth: 90,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => <Slack params={params}></Slack>,
      sortComparator: (v1, v2) => {
        v1.value = v1.row.slackId === null ? "0" : "1";
        v2.value = v2.row.slackId === null ? "0" : "1";
        console.log(v1, v2);
        return v1.value.localeCompare(v2.value);
      },
    },
    {
      field: "cohort",
      headerName: "Cohort",
      minWidth: 140,
      maxWidth: 140,
      flex: 1,
    },
    {
      field: "class",
      headerName: "Class",
      minWidth: 100,
      maxWidth: 100,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => <ClassType params={params}></ClassType>,
      sortComparator: (v1, v2) => v1.value.localeCompare(v2.value),
    },
    {
      field: "startEndDate",
      headerName: "Date range",
      type: "dateRange",
      minWidth: 170,
      maxWidth: 170,
      flex: 1,
    },
    {
      field: "members",
      headerName: "Members",
      minWidth: 75,
      maxWidth: 75,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => <Members params={params}></Members>,
    },
    {
      field: "lessons",
      headerName: "Lessons",
      minWidth: 125,
      maxWidth: 125,
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => <Lessons params={params}></Lessons>,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      minWidth: 100,
      maxWidth: 100,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <CohortsActions
          params={params}
          onHandleCohorts={setCohorts}
        ></CohortsActions>
      ),
    },
  ];
  // Dialog states
  const [openNewCohortDialog, setOpenNewCohortDialog] = useState(false);
  const [openNewCohortSlackDialog, setOpenNewCohortSlackDialog] =
    useState(false);

  /*
    ==========================
    =         HOOKS          =
    ==========================
  */
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchCohorts = async () => {
      try {
        const response = await axiosPrivate.get("/cohort", {
          signal: controller.signal,
        });
        console.log(response);
        const options = { year: "2-digit", month: "numeric", day: "numeric" };
        const dateTimeFormat = new Intl.DateTimeFormat("en", options);
        const formattedCohorts = response.data.cohorts.map((cohort) => {
          return {
            id: cohort._id,
            slackId: cohort.slackId,
            cohort: cohort.name,
            class: cohort.type,
            members: cohort.participants.length,
            startEndDate: dateTimeFormat.formatRange(
              new Date(cohort.start),
              new Date(cohort.end)
            ),
          };
        });
        console.log(formattedCohorts);
        isMounted && setCohorts(formattedCohorts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
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
          setLoading(false);
          console.error(error);
        }
      }
    };

    fetchCohorts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <Container maxWidth="md">
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
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          {" "}
          COHORTS MANAGEMENT{" "}
        </Typography>
        <div className={styles.formContainer}>
          <AuthFormControl width="70%">
            <AppButton
              text={"Add new cohort"}
              type="button"
              width="100%"
              handlerFunction={() => setOpenNewCohortDialog(true)}
            >
              <Class fontSize="large"></Class>
            </AppButton>
            <AppButton
              text={"Add from Slack"}
              type="button"
              width="100%"
              handlerFunction={() => setOpenNewCohortSlackDialog(true)}
            >
              <CloudDownloadRounded fontSize="large"></CloudDownloadRounded>
            </AppButton>
          </AuthFormControl>
        </div>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Loader />
          </Box>
        ) : (
          <AppDataGrid
            columns={columns}
            rows={cohorts}
            pageSize={10}
            fieldToBeSorted={"class"}
            sortType={"asc"}
            variant="light"
          />
        )}
        {openNewCohortDialog ? (
          <AddCohort
            open={openNewCohortDialog}
            handleOpen={setOpenNewCohortDialog}
            onRegisterCohort={setCohorts}
          ></AddCohort>
        ) : null}
        {openNewCohortSlackDialog ? (
          <AddCohortSlack
            open={openNewCohortSlackDialog}
            handleOpen={setOpenNewCohortSlackDialog}
            onRegisterCohort={setCohorts}
          ></AddCohortSlack>
        ) : null}
      </Paper>
    </Container>
  );
};

export default Cohorts;
