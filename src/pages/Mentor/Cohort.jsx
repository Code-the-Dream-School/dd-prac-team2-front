import {
  Box,
  Container,
  Typography,
  List,
  Card,
  CardContent,
  ListItemText,
  Badge,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CohortHeader from "../../components/CohortHeader/CohortHeader";
import Loader from "../../components/Loader/Loader";

const Cohort = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [currentWeek, setCurrentWeek] = useState();
  const [loading, setLoading] = useState(false);
  const [cohort] = useOutletContext();

  useEffect(() => {
    const getCurrentWeek = async () => {
      try {
        setLoading(true);
        const res = await axiosPrivate.get(`/week/${cohort._id}/current`);
        setCurrentWeek(res.data.currentWeek);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    if (!cohort) {
      navigate("/mentor");
    }
    getCurrentWeek();
  }, []);

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
          <CohortHeader
            cohort={cohort}
            currentWeek={currentWeek}
            getWeek={getWeek}
          />
          <List>
            {currentWeek?.sessions.length > 0 ? (
              currentWeek?.sessions.map((session) => (
                <Card
                  key={session._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Box
                    onClick={() => handleClick(session._id)}
                    display="flex"
                    justifyContent={"flex-start"}
                    width="30%"
                    sx={{ padding: 0 }}
                    className={"animate__animated animate__bounceIn"}
                  >
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
                        <Box
                          sx={{ display: "inline-flex", fontWeight: "bold" }}
                        >
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
        </Container>
      )}
    </>
  );
};

export default Cohort;
