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
import useAuth from "../../hooks/useAuth";

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
  const [loading, setLoading] = useState(false);
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
  const getCurrentWeek = async () => {
    setLoading(true);
    const { data } = await axiosPrivate.get(`/week/${cohortId}/current`);
    setCurrentWeek(data.currentWeek);
    setLoading(false);
  };

  const handleConfirmStatus = async (sessionID) => {
    if (!isUserOnSession(sessionID)) {
      setLoading(true);
      try {
        const { data } = await axiosPrivate.patch(
          `/session/${sessionID}/student/updateStatus`,
          {
            status: true,
          }
        );
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
        setLoading(false);
      } catch (error) {
        if (error.response.status === 403) {
          setLoading(false);
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
    }
  };

  const handleCancelStatus = async (sessionID) => {
    if (isUserOnSession(sessionID)) {
      setLoading(true);
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
        setLoading(false);
      } catch (error) {
        if (error.response.status === 403) {
          setLoading(false);
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
    }
  };

  const handleClick = (sessionId) => {
    navigate(`/student/session/${sessionId}`);
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
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          bgcolor: "transparent",
        }}
      >
        <Typography
          component={"h1"}
          sx={{
            backgroundColor: "#112f58",
            border: 2,
            borderColor: "#C84B31",
            borderRadius: 2,
            padding: 2,
            margin: 1,
            color: "background.paper",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 25,
            "&:hover": {
              backgroundColor: "#f3950d",
            },
          }}
        >
          {state.name}
        </Typography>
      </Box>
      <Typography
        sx={{
          backgroundColor: "#C84B31",
          borderRadius: 2,
          padding: 1,
          margin: 1,
          color: "background.paper",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 25,
        }}
        component={"div"}
      >
        <Box
          sx={{
            backgroundColor: "#112f58",
            borderRadius: 2,
            marginBottom: 1,
            p: 0.5,
            fontSize: 22,
            "&:hover": {
              transform: "scale(1.02)",
              transition: "all 0.2s ease-in-out",
            },
          }}
        >
          {currentWeek?.name}
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
              backgroundColor: "#112f57",
              color: "white",
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
              backgroundColor: "#112f57",
              color: "white",
              "&:hover": {
                transform: "scale(1.05)",
                transition: "all 0.2s ease-in-out",
              },
            }}
          />
        </Stack>
      </Typography>
      {loading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", paddingBlock: 2 }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {currentWeek?.sessions?.length > 0 ? (
            currentWeek?.sessions.map((session) => (
              <Card
                key={session._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "1px",
                }}
              >
                <Box sx={{ p: 0.3 }}>
                  <CardContent
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#f3950d",
                        borderRadius: 1.5,
                      },
                    }}
                  >
                    <Typography
                      onClick={() => handleClick(session._id)}
                      variant="h6"
                      color="#112f58"
                    >
                      <Tooltip
                        title="Click to see session details."
                        followCursor
                        placement="top"
                      >
                        <b>{`${session.type} Session`}</b>
                      </Tooltip>
                    </Typography>
                    <Typography variant="subtitle1" color="#c84b31">
                      <b> {convertLocalTime(session.start)}</b>
                    </Typography>
                  </CardContent>
                </Box>
                <Box display="flex">
                  <CardContent>
                    <ListItemText
                      sx={{
                        "& .MuiListItemText-primary": {
                          marginBottom: "8px",
                        },
                      }}
                      primary={
                        <Box>
                          Host:
                          <Typography
                            sx={{ display: "inline" }}
                            paragraph={true}
                            variant="h7"
                            color="#112f58"
                          >
                            <b>
                              {` ${session.creator.name ?? "Not assigned"}`}
                            </b>
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
                  </CardContent>
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
            ))
          ) : (
            <Typography
              sx={{
                backgroundColor: "#f2f2f2",
                padding: 2,
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              No sessions scheduled for this week
            </Typography>
          )}
        </List>
      )}
    </Container>
  );
};

export default StudentCohort;
