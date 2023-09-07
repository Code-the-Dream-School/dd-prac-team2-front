import {
  Box,
  Container,
  Typography,
  List,
  Card,
  CardContent,
  CircularProgress,
  Tooltip,
  ListItemText,
  Badge,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { formatDateAndTime } from "../../util";
import CohortHeader from "../../components/CohortHeader/CohortHeader";

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
    <Container>
      <CohortHeader
        cohort={cohort}
        currentWeek={currentWeek}
        getWeek={getWeek}
      />
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
