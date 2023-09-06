/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

import styles from "./AdminHome.module.css";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import Loader from "../../components/Loader/Loader";
import {
  Avatar,
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DashboardFormControl from "../../components/FormControl/DashboardFormControl";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AdminHome = () => {
  /*
    ==========================
    =          HOOKS         =
    ==========================
  */
  const axiosPrivate = useAxiosPrivate();
  /*
    ==========================
    =         STATES         =
    ==========================
  */
  const [adminDashboardData, setAdminDashboardData] = useState({
    adminTotal: 0,
    mentorTotal: 0,
    studentLeaderTotal: 0,
    studentTotal: 0,
    slackUsersTotal: 0,
    appUsersTotal: 0,
    cohortsTotal: 0,
    slackCohortsTotal: 0,
    introTotal: 0,
    reactTotal: 0,
    nodeTotal: 0,
    rubyTotal: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const users = await axiosPrivate.get("/users");
      const userStats = {
        adminTotal: users.data.users.filter((user) =>
          user.roles.includes("admin")
        ).length,
        mentorTotal: users.data.users.filter((user) =>
          user.roles.includes("mentor")
        ).length,
        studentLeaderTotal: users.data.users.filter((user) =>
          user.roles.includes("student-leader")
        ).length,
        studentTotal: users.data.users.filter((user) =>
          user.roles.includes("student")
        ).length,
        slackUsersTotal: users.data.users.filter(
          (user) => user.slackId !== undefined
        ).length,
        appUsersTotal: users.data.users.filter(
          (user) => user.slackId === undefined
        ).length,
      };
      const cohorts = await axiosPrivate.get("/cohort");
      const cohortStats = {
        cohortsTotal: cohorts.data.cohorts.length,
        slackCohortsTotal: cohorts.data.cohorts.filter(
          (cohort) => cohort.slackId !== null
        ).length,
        introTotal: cohorts.data.cohorts.filter(
          (cohort) => cohort.type === "Intro to programming"
        ).length,
        reactTotal: cohorts.data.cohorts.filter(
          (cohort) => cohort.type === "React.js"
        ).length,
        nodeTotal: cohorts.data.cohorts.filter(
          (cohort) => cohort.type === "Node.js/Express"
        ).length,
        rubyTotal: cohorts.data.cohorts.filter(
          (cohort) => cohort.type === "Ruby on Rails"
        ).length,
      };
      setAdminDashboardData({
        adminTotal: userStats.adminTotal,
        mentorTotal: userStats.mentorTotal,
        studentLeaderTotal: userStats.studentLeaderTotal,
        studentTotal: userStats.studentTotal,
        slackUsersTotal: userStats.slackUsersTotal,
        appUsersTotal: userStats.appUsersTotal,
        cohortsTotal: cohortStats.cohortsTotal,
        slackCohortsTotal: cohortStats.slackCohortsTotal,
        introTotal: cohortStats.introTotal,
        reactTotal: cohortStats.reactTotal,
        nodeTotal: cohortStats.nodeTotal,
        rubyTotal: cohortStats.rubyTotal,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
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
                fontWeight: "bold",
                fontSize: 25,
              }}
            >
              ADMIN DASHBOARD
            </Typography>
            <div className={styles.formContainer}>
              <DashboardFormControl width="100%">
                <Box
                  sx={{ width: { xs: "90%", sm: "90%", md: "50%" } }}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  marginX={2}
                >
                  <Typography
                    component={"h1"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#0F3460",
                      borderRadius: 2,
                      padding: 1,
                      margin: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 25,
                      width: "100%",
                    }}
                  >
                    ALL CLASSES
                  </Typography>
                  <Stack
                    direction={"column"}
                    spacing={1}
                    overflow={"auto"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 1,
                      backgroundColor: "white",
                      borderRadius: 3,
                      width: "100%",
                    }}
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Avatar
                        alt={"Intro to Programming"}
                        src="/images/html.png"
                        sx={{
                          width: 64,
                          height: 64,
                          transform: "scale(1.0)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.15)",
                            transition: "0.2s ease-in-out",
                          },
                        }}
                        variant="square"
                      />
                      <Typography
                        component={"h2"}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#0F3460",
                          borderRadius: 2,
                          padding: 1,
                          margin: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        {`Intro to Programming classes: ${adminDashboardData.introTotal}`}
                      </Typography>
                    </Box>

                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Avatar
                        alt={"React.js"}
                        src="/images/react.png"
                        sx={{
                          width: 64,
                          height: 64,
                          transform: "scale(1.0)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.15)",
                            transition: "0.2s ease-in-out",
                          },
                        }}
                        variant="square"
                      />
                      <Typography
                        component={"h2"}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#0F3460",
                          borderRadius: 2,
                          padding: 1,
                          margin: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        {`React.js classes: ${adminDashboardData.reactTotal}`}
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Avatar
                        alt={"Node.js/Express"}
                        src="/images/nodejs.png"
                        sx={{
                          width: 64,
                          height: 64,
                          transform: "scale(1.0)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.15)",
                            transition: "0.2s ease-in-out",
                          },
                        }}
                        variant="square"
                      />
                      <Typography
                        component={"h2"}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#0F3460",
                          borderRadius: 2,
                          padding: 1,
                          margin: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        {`Node.js/Express classes: ${adminDashboardData.nodeTotal}`}
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Avatar
                        alt={"Ruby on Rails"}
                        src="/images/ruby.png"
                        sx={{
                          width: 64,
                          height: 64,
                          transform: "scale(1.0)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.15)",
                            transition: "0.2s ease-in-out",
                          },
                        }}
                        variant="square"
                      />
                      <Typography
                        component={"h2"}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#0F3460",
                          borderRadius: 2,
                          padding: 1,
                          margin: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        {`Ruby on Rails classes: ${adminDashboardData.rubyTotal}`}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <Box
                  sx={{ width: { xs: "90%", sm: "90%", md: "50%" } }}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  marginX={1}
                >
                  <Typography
                    component={"h1"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#0F3460",
                      borderRadius: 2,
                      padding: 1,
                      margin: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 25,
                      width: "100%",
                    }}
                  >
                    USERS STATS
                  </Typography>
                  <Stack
                    direction={"column"}
                    spacing={1}
                    overflow={"auto"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 1,
                      backgroundColor: "white",
                      borderRadius: 3,
                      width: "100%",
                    }}
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Avatar
                        alt={"Admin role"}
                        src="/images/admin.png"
                        sx={{
                          width: 64,
                          height: 64,
                          transform: "scale(1.0)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.15)",
                            transition: "0.2s ease-in-out",
                          },
                        }}
                        variant="square"
                      />
                      <Typography
                        component={"h2"}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#0F3460",
                          borderRadius: 2,
                          padding: 1,
                          margin: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        {`Admins: ${adminDashboardData.adminTotal}`}
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Avatar
                        alt={"Mentor role"}
                        src="/images/mentor.png"
                        sx={{
                          width: 64,
                          height: 64,
                          transform: "scale(1.0)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.15)",
                            transition: "0.2s ease-in-out",
                          },
                        }}
                        variant="square"
                      />
                      <Typography
                        component={"h2"}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#0F3460",
                          borderRadius: 2,
                          padding: 1,
                          margin: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        {`Mentors: ${adminDashboardData.mentorTotal}`}
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Avatar
                        alt={"Student leader role"}
                        src="/images/student-leader.png"
                        sx={{
                          width: 64,
                          height: 64,
                          transform: "scale(1.0)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.15)",
                            transition: "0.2s ease-in-out",
                          },
                        }}
                        variant="square"
                      />
                      <Typography
                        component={"h2"}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#0F3460",
                          borderRadius: 2,
                          padding: 1,
                          margin: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        {`Student Leaders: ${adminDashboardData.studentLeaderTotal}`}
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Avatar
                        alt={"Student role"}
                        src="/images/student.png"
                        sx={{
                          width: 64,
                          height: 64,
                          transform: "scale(1.0)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.15)",
                            transition: "0.2s ease-in-out",
                          },
                        }}
                        variant="square"
                      />
                      <Typography
                        component={"h2"}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#0F3460",
                          borderRadius: 2,
                          padding: 1,
                          margin: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        {`Students: ${adminDashboardData.studentTotal}`}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <Box
                  sx={{ width: { xs: "90%", sm: "90%", md: "50%" } }}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  marginX={1}
                >
                  <Typography
                    component={"h1"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#0F3460",
                      borderRadius: 2,
                      padding: 1,
                      margin: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 25,
                      width: "100%",
                    }}
                  >
                    COHORT STATS
                  </Typography>
                  <Stack
                    direction={"column"}
                    spacing={1}
                    overflow={"auto"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 1,
                      backgroundColor: "white",
                      borderRadius: 3,
                      width: "100%",
                    }}
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Avatar
                        alt={"Admin role"}
                        src="/images/cohort.png"
                        sx={{
                          width: 64,
                          height: 64,
                          transform: "scale(1.0)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.15)",
                            transition: "0.2s ease-in-out",
                          },
                        }}
                        variant="square"
                      />
                      <Typography
                        component={"h2"}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#0F3460",
                          borderRadius: 2,
                          padding: 1,
                          margin: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        {`Cohorts: ${adminDashboardData.cohortsTotal}`}
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Avatar
                        alt={"Mentor role"}
                        src="/images/slack-cohort.png"
                        sx={{
                          width: 64,
                          height: 64,
                          transform: "scale(1.0)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.15)",
                            transition: "0.2s ease-in-out",
                          },
                        }}
                        variant="square"
                      />
                      <Typography
                        component={"h2"}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#0F3460",
                          borderRadius: 2,
                          padding: 1,
                          margin: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        {`Slack Cohorts: ${adminDashboardData.slackCohortsTotal}`}
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Avatar
                        alt={"Student leader role"}
                        src="/images/slack.png"
                        sx={{
                          width: 64,
                          height: 64,
                          transform: "scale(1.0)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.15)",
                            transition: "0.2s ease-in-out",
                          },
                        }}
                        variant="square"
                      />
                      <Typography
                        component={"h2"}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#0F3460",
                          borderRadius: 2,
                          padding: 1,
                          margin: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        {`Slack Users: ${adminDashboardData.slackUsersTotal}`}
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Avatar
                        alt={"Student role"}
                        src="/images/small-logo.png"
                        sx={{
                          width: 64,
                          height: 64,
                          transform: "scale(1.0)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.15)",
                            transition: "0.2s ease-in-out",
                          },
                        }}
                        variant="square"
                      />
                      <Typography
                        component={"h2"}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          backgroundColor: "#0F3460",
                          borderRadius: 2,
                          padding: 1,
                          margin: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        {`MentorUp Users: ${adminDashboardData.appUsersTotal}`}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </DashboardFormControl>
            </div>
            <div className={styles.formContainer}>
            </div>
          </Paper>
        </Container>
      )}
    </>
  );
};

export default AdminHome;
