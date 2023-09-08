/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {
  Box,
  Container,
  Typography,
  List,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Chip,
  Stack,
  Badge,
  Tooltip,
  ListItemText,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { CancelOutlined, CheckCircleOutlineRounded } from "@mui/icons-material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from "../../components/Button/AppButton";
import Loader from "../../components/Loader/Loader";
import useAuth from "../../hooks/useAuth";

import styles from "./Student.module.css";

const StudentCohort = () => {
  /*
      ==========================
      =          HOOKS         =
      ==========================
  */
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const { state } = useLocation();
  const location = useLocation();
  /*
      ==========================
      =         STATES         =
      ==========================
  */
  const [currentWeek, setCurrentWeek] = useState();
  const [loading, setLoading] = useState(true);
  const cohortId = state._id;
  const navigate = useNavigate();
  /*
      ==========================
      =      AUX FUNCTION      =
      ==========================
  */
  const isUserOnSession = (sessionID) => {
    const sessionToBeChecked = currentWeek.sessions.filter(
      (session) => session._id === sessionID
    );
    if (sessionToBeChecked[0].participant.includes(auth.userId)) {
      return true;
    } else {
      return false;
    }
  };
  const convertLocalTime = (val) => {
    const utcTime = new Date(val);
    let hour = utcTime.getHours() % 12;
    if (hour === 0) {
      hour = 12;
    }
    let minute = utcTime.getMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }
    const ampm = utcTime.getHours() < 12 ? "AM" : "PM";
    const localTime = `${
      utcTime.getMonth() + 1
    }/${utcTime.getDate()} — ${hour}:${minute} ${ampm}`;
    return localTime;
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

  const getCurrentWeek = async () => {
    try {
      const { data } = await axiosPrivate.get(`/week/${cohortId}/current`);
      setCurrentWeek(data.currentWeek);
      setLoading(false);
      console.log(data);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleConfirmStatus = async (sessionID) => {
    if (!isUserOnSession(sessionID)) {
      try {
        const data = await axiosPrivate.patch(
          `/session/${sessionID}/student/updateStatus`,
          {
            status: true,
          }
        );
        console.log(data);
        setCurrentWeek((prevState) => ({
          ...prevState,
          sessions: prevState.sessions.map((session) => {
            if (session._id === sessionID) {
              return {
                ...session,
                participant: [...session.participant, auth.userId],
              };
            } else {
              return session;
            }
          }),
        }));
      } catch (error) {
        if (error.response.status === 403) {
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
    }
  };

  const handleCancelStatus = async (sessionID) => {
    if (isUserOnSession(sessionID)) {
      try {
        await axiosPrivate.patch(`/session/${sessionID}/student/updateStatus`, {
          status: false,
        });
        setCurrentWeek((prevState) => ({
          ...prevState,
          sessions: prevState.sessions.map((session) => {
            if (session._id === sessionID) {
              return {
                ...session,
                participant: session.participant.filter(
                  (participant) => participant !== auth.userId
                ),
              };
            } else {
              return session;
            }
          }),
        }));
      } catch (error) {
        if (error.response.status === 403) {
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
    }
  };

  const handleClick = (sessionId) => {
    if (sessionId) {
      navigate(`/student/session/${sessionId}`);
    }
  };
  /* 
      ==========================
      =        EFFECTS         =
      ==========================
  */
  useEffect(() => {
    getCurrentWeek();
  }, []);

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Container>
          <Typography
            component={"h1"}
            sx={{
              backgroundColor: "#C84B31",
              padding: 2,
              color: "background.paper",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 25,
              borderRadius: 2,
              marginBottom: 4,
            }}
          >
            {`${state.name} Sessions`}
          </Typography>
          <Box
            sx={{
              justifyContent: "center",
              padding: 3,
              backgroundColor: "#1a1a2e",
              fontSize: 25,
              borderRadius: 2,
              marginBottom: 4,
            }}
          >
            {currentWeek?.sessions?.length > 0 ? (
              <>
                <Box
                  sx={{
                    width: "60%",
                    margin: "auto",
                    backgroundColor: "#C84B31",
                    borderRadius: 2,
                    marginBottom: 4,
                    p: 0.5,
                    fontSize: 22,
                  }}
                >
                  <Typography
                    sx={{
                      color: "background.paper",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 25,
                    }}
                  >
                    {currentWeek?.name}
                  </Typography>
                </Box>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 2, md: 4 }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Chip
                    label={`Start Date:  ${new Date(
                      currentWeek?.start
                    ).toLocaleDateString()}`}
                    sx={{
                      backgroundColor: "#C84B31",
                      color: "white",
                      fontWeight: "bold",
                      transform: "scale(1.00)",
                      transition: "0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                  />
                  <Chip
                    label={`End Date:  ${new Date(
                      currentWeek?.end
                    ).toLocaleDateString()}`}
                    sx={{
                      backgroundColor: "#C84B31",
                      color: "white",
                      fontWeight: "bold",
                      transform: "scale(1.00)",
                      transition: "0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                  />
                </Stack>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    backgroundColor: "#f2f2f2",
                    padding: 2,
                    borderRadius: 2,
                    textAlign: "center",
                    fontWeight: "bold",
                    width: "85%",
                  }}
                >
                  No sessions scheduled for this week
                </Typography>
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
              </Box>
            )}
          </Box>
          <List>
            {currentWeek?.sessions.map((session) => (
              <Card
                key={session._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <Box onClick={() => handleClick(session._id)} display="flex" justifyContent={"flex-start"} width="30%" sx={{padding:0}} className={"animate__animated animate__bounceIn"}>
                  <CardContent
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    <Typography variant="h6" color="#112f58">
                      <b>{`${session.type} Session`}</b>
                      <Typography variant="body2" color="#c84b31">
                        <b>{convertLocalTime(session.start)}</b>
                      </Typography>
                    </Typography>
                  </CardContent>
                </Box>
                <Box display="flex" width="35%">
                  <ListItemText
                    sx={{
                      "& .MuiListItemText-primary": {
                        marginBottom: "8px",
                        fontSize: 18,
                      },
                    }}
                    primary={
                      <Box sx={{ display: "inline-flex" }}>
                        {`Host: `}
                        <Typography
                          component={"p"}
                          variant="h7"
                          color="#112f58"
                        >
                          {` ${session.creator.name ?? "Not assigned"}`}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body1"
                          color="text.primary"
                          textAlign="center"
                          fontWeight={"bold"}
                        >
                          {`Attendees:  `}
                        </Typography>
                        <Badge
                          sx={{
                            "& .MuiBadge-badge": {
                              backgroundColor:
                                session.participant.length > 0
                                  ? { main: "#2196f3", contrastText: "white" }
                                  : "gray",
                            },
                          }}
                          badgeContent={`${session.participant.length}`}
                          color="success"
                        >
                          <GroupIcon />
                        </Badge>
                      </>
                    }
                  />
                </Box>
                <CardActions>
                  {session.participant.includes(auth.userId) ? (
                    <>
                      <AppButton
                        text={"Yes"}
                        type="button"
                        width="auto"
                        color={"#609966"}
                        handlerFunction={() => handleConfirmStatus(session._id)}
                      >
                        <CheckCircleOutlineRounded></CheckCircleOutlineRounded>
                      </AppButton>
                      <AppButton
                        text={"No"}
                        type="button"
                        width="auto"
                        color={"white"}
                        textColor={"#1A1A2E"}
                        handlerFunction={() => handleCancelStatus(session._id)}
                      >
                        <CancelOutlined></CancelOutlined>
                      </AppButton>
                    </>
                  ) : (
                    <>
                      <AppButton
                        text={"Yes"}
                        type="button"
                        width="auto"
                        color={"white"}
                        textColor={"#1A1A2E"}
                        handlerFunction={() => handleConfirmStatus(session._id)}
                      >
                        <CheckCircleOutlineRounded></CheckCircleOutlineRounded>
                      </AppButton>
                      <AppButton
                        text={"No"}
                        type="button"
                        width="auto"
                        color="#CD1818"
                        handlerFunction={() => handleCancelStatus(session._id)}
                      >
                        <CancelOutlined></CancelOutlined>
                      </AppButton>
                    </>
                  )}
                </CardActions>
              </Card>
            ))}
          </List>
        </Container>
      )}
    </>
  );
};

export default StudentCohort;
