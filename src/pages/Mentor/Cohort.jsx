import {
  Box,
  Container,
  Typography,
  List,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

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
            backgroundColor: "#C84B31",
            borderRadius: 2,
            padding: 2,
            margin: 1,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          {cohort?.name}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "#C84B31",
          display: "flex",
          justifyContent: "space-between",
          borderRadius: 2,
        }}
      >
        <IconButton onClick={handlePreviousWeek}>
          <NavigateBefore fontSize="large" />
        </IconButton>
        <Typography
          sx={{
            padding: 1,
            margin: 1,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 25,
            flexGrow: 1,
          }}
        >
          {currentWeek?.name}
        </Typography>
        <IconButton onClick={handleNextWeek}>
          <NavigateNext fontSize="large" />
        </IconButton>
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
                  marginBlockEnd: 2,
                }}
              >
                <Box>
                  <CardContent>
                    <Link to={`/mentor/session/${session._id}`}>
                      {" "}
                      {`${session.type} session`}
                    </Link>
                    <Typography variant="subtitle1">
                      {new Date(session.start).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Box>
                <Box>
                  <CardContent>
                    <Typography>{`${session.participant.length} students confirmed`}</Typography>
                  </CardContent>
                </Box>
                <CardActions>
                  <Button size="small">Details</Button>
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

export default Cohort;
