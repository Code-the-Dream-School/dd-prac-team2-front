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
  Badge,
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
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from "../../components/Button/AppButton";
import Loader from "../../components/Loader/Loader";
import useAuth from "../../hooks/useAuth";
import CohortHeader from "../../components/CohortHeader/CohortHeader";

const StudentCohort = () => {
  /*
      ==========================
      =          HOOKS         =
      ==========================
  */
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const location = useLocation();
  const [cohort] = useOutletContext();
  const navigate = useNavigate();
  /*
      ==========================
      =         STATES         =
      ==========================
  */
  const [currentWeek, setCurrentWeek] = useState();
  const [loading, setLoading] = useState(true);
  /*
      ==========================
      =      AUX FUNCTION      =
      ==========================
  */
  const isUserOnSession = (sessionID) => {
    const sessionToBeChecked = currentWeek.sessions.filter(
      (session) => session._id === sessionID
    );
    return sessionToBeChecked[0].participant.includes(auth.userId);
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

  const getCurrentWeek = async () => {
    try {
      const { data } = await axiosPrivate.get(`/week/${cohort._id}/current`);
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

  const getWeek = async (index) => {
    setLoading(true);
    const res = await axiosPrivate.get(`/week/${cohort._id}/index/${index}`);
    setCurrentWeek(res.data.populatedWeek);
    setLoading(false);
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
          <CohortHeader
            cohort={cohort}
            currentWeek={currentWeek}
            getWeek={getWeek}
          />
          {currentWeek?.sessions.length > 0 ? (
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
                  <Box onClick={() => handleClick(session._id)} width="30%">
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
                          fontWeight: "bold",
                          fontSize: 18,
                        },
                      }}
                      primary={
                        <Box sx={{ display: "inline-flex" }}>
                          {`Host `}
                          <Typography
                            component={"p"}
                            variant="h7"
                            color="#112f58"
                          >
                            {`  --   ${session.creator.name ?? "Not assigned"}`}
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
                          >
                            <b>{`Attendees:  `}</b>
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
                          handlerFunction={() =>
                            handleConfirmStatus(session._id)
                          }
                        >
                          <CheckCircleOutlineRounded></CheckCircleOutlineRounded>
                        </AppButton>
                        <AppButton
                          text={"No"}
                          type="button"
                          width="auto"
                          color={"white"}
                          textColor={"#1A1A2E"}
                          handlerFunction={() =>
                            handleCancelStatus(session._id)
                          }
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
                          handlerFunction={() =>
                            handleConfirmStatus(session._id)
                          }
                        >
                          <CheckCircleOutlineRounded></CheckCircleOutlineRounded>
                        </AppButton>
                        <AppButton
                          text={"No"}
                          type="button"
                          width="auto"
                          color="#CD1818"
                          handlerFunction={() =>
                            handleCancelStatus(session._id)
                          }
                        >
                          <CancelOutlined></CancelOutlined>
                        </AppButton>
                      </>
                    )}
                  </CardActions>
                </Card>
              ))}
            </List>
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
            </Box>
          )}
        </Container>
      )}
    </>
  );
};

export default StudentCohort;
