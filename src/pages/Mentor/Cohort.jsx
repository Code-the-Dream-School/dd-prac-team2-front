import {
  Box,
  Container,
  Typography,
  List,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Tooltip,
  ListItemText,
  Badge,
  Stack,
  Chip,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { formatDateAndTime } from "../../util";
import Loader from "../../components/Loader/Loader";
import styles from "./Mentor.module.css";
import AppButton from "../../components/Button/AppButton";

const Cohort = () => {
  const [currentWeek, setCurrentWeek] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [cohort] = useOutletContext();

  useEffect(() => {
    const getCurrentWeek = async () => {
      setLoading(true);
      const res = await axiosPrivate.get(`/week/${cohort._id}/current`);
      console.log(res);
      setCurrentWeek(res.data.currentWeek);
      setLoading(false);
    };
    if (!cohort) {
      navigate("/mentor");
    }
    getCurrentWeek();
  }, []);

  const goBack = () => {
    navigate(-1);
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

  const getWeek = async (index) => {
    setLoading(true);
    const res = await axiosPrivate.get(`/week/${cohort._id}/index/${index}`);
    setCurrentWeek(res.data.populatedWeek);
    setLoading(false);
  };

  const handleNextWeek = () => {
    if (currentWeek.end === cohort.end) {
      return;
    }
    getWeek(currentWeek.index + 1);
  };

  const handlePreviousWeek = () => {
    if (currentWeek.index === 0) {
      return;
    }
    getWeek(currentWeek.index - 1);
  };

  const handleClick = (sessionId) => {
    if (sessionId) {
      navigate(`/mentor/session/${sessionId}`);
    }
  };

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
            {`${cohort?.name} Sessions`}
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
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "60%",
                    margin: "auto",
                    backgroundColor: "#C84B31",
                    borderRadius: 2,
                    marginBottom: 4,
                    p: 0.5,
                    fontSize: 22,
                  }}
                >
                  <IconButton
                    onClick={handlePreviousWeek}
                    sx={{
                      transform: "scale(1.00)",
                      transition: "0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#0F3460",
                        transform: "scale(1.03)",
                        transition: "0.2s ease-in-out",
                      },
                    }}
                  >
                    <NavigateBefore fontSize="large" sx={{ color: "white" }} />
                  </IconButton>
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
                  <IconButton
                    onClick={handleNextWeek}
                    sx={{
                      transform: "scale(1.00)",
                      transition: "0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#0F3460",
                        transform: "scale(1.03)",
                        transition: "0.2s ease-in-out",
                      },
                    }}
                  >
                    <NavigateNext fontSize="large" sx={{ color: "white" }} />
                  </IconButton>
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
                        transition: " 0.2s ease-in-out",
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
                        transition: "0.2s ease-in-out",
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "60%",
                    margin: "auto",
                    backgroundColor: "#C84B31",
                    borderRadius: 2,
                    marginBottom: 4,
                    p: 0.5,
                    fontSize: 22,
                  }}
                >
                  <IconButton
                    onClick={handlePreviousWeek}
                    sx={{
                      transform: "scale(1.00)",
                      transition: "0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#0F3460",
                        transform: "scale(1.03)",
                        transition: "0.2s ease-in-out",
                      },
                    }}
                  >
                    <NavigateBefore fontSize="large" sx={{ color: "white" }} />
                  </IconButton>
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
                  <IconButton
                    onClick={handleNextWeek}
                    sx={{
                      transform: "scale(1.00)",
                      transition: "0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#0F3460",
                        transform: "scale(1.03)",
                        transition: "0.2s ease-in-out",
                      },
                    }}
                  >
                    <NavigateNext fontSize="large" sx={{ color: "white" }} />
                  </IconButton>
                </Box>
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
                      <Box sx={{ display: "inline-flex", fontWeight: "bold" }}>
                        Host:
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
                                  ? {
                                      main: "#2196f3",
                                      contrastText: "white",
                                    }
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
              </Card>
            ))}
          </List>
        </Container>
      )}
    </>
  );
};

export default Cohort;
