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

const Cohort = () => {
  const [currentWeek, setCurrentWeek] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
        {`${cohort?.name} Mentor Session`}
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
          <IconButton onClick={handlePreviousWeek}>
            <NavigateBefore fontSize="large" />
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

          <IconButton onClick={handleNextWeek}>
            <NavigateNext fontSize="large" />
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
            }}
          />
        </Stack>
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingBlock: 2,
          }}
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
                  marginBottom: 2,
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
                      <b>{formatDateAndTime(session.start)}</b>{" "}
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

export default Cohort;
