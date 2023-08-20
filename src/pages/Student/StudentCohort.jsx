import {
  Box,
  Container,
  Typography,
  List,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AppButton from "../../components/Button/AppButton";
import CheckIcon from "@mui/icons-material/Check";
import confirmStudentCount from "../../util/countConfirm";
import { useNavigate } from "react-router-dom";

const StudentCohort = () => {
  const { state } = useLocation();
  const [currentWeek, setCurrentWeek] = useState();
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const cohortId = state._id;
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentWeek = async () => {
      setLoading(true);
      const res = await axiosPrivate.post("/week/current", {
        cohortId,
        userTimeZone: "America/New_York",
      });

      setCurrentWeek(res.data.currentWeek);
      setLoading(false);
    };

    getCurrentWeek();
  }, []);

  const handleStatus = async (sessionID) => {
    console.log(sessionID);
    setLoading(true);
    const { data } = await axiosPrivate.patch(
      `/session/${sessionID}/student/updateStatus`,
      {
        userStatus: "Confirm",
      }
    );
    console.log(data);

    setLoading(false);
    // setCurrentWeek((prevWeeks) => [...prevWeeks, {

    // }]);
  };

  const handleClick = (sessionId) => {
    navigate(`/student/session/${sessionId}`);
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
          {state.name}
        </Typography>
      </Box>
      <Typography
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
        {currentWeek?.name}
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
                }}
                onClick={() => handleClick(session._id)}
              >
                <Box>
                  <CardContent>
                    <Typography variant="h5">{`${session.type} session`}</Typography>
                    <Typography variant="subtitle1">
                      {new Date(session.start).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Box>
                <Box>
                  <CardContent>
                    <Typography>{`Mentor: ${session.creator.name}`}</Typography>
                    <Typography>
                      {confirmStudentCount(session)} {"students confirmed"}
                    </Typography>
                  </CardContent>
                </Box>
                <CardActions>
                  <AppButton
                    text={"Confirm"}
                    type="button"
                    width="auto"
                    color="#055c1c"
                    handlerFunction={() => handleStatus(session._id)}
                  >
                    <CheckIcon></CheckIcon>
                  </AppButton>
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
