import {
  Box,
  Container,
  Typography,
  List,
  Card,
  Chip,
  Stack,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Divider,
  ListItem,
  Button,
} from "@mui/material";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";

import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { blue } from "@mui/material/colors";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import AuthFormControl from "../../components/FormControl/AuthFormControl";
import FormTextField from "../../components/TextField/FormTextField";
import AppButton from "../../components/Button/AppButton";
import styles from "./Student.module.css";
import useAuth from "../../hooks/useAuth";
import Review from "./Actions/Review";
import { LocalGasStation } from "@mui/icons-material";
import { formatDateAndTime } from "../../util";

const StudentSession = () => {
  const [currentSession, setCurrentSession] = useState();
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [reset, setReset] = useState(false);
  const [userStatus, setUserStatus] = useState();
  const { auth, setAuth } = useAuth();
  const [comment, setComment] = useState();
  const [formError, setFormError] = useState({
    commentError: {
      error: false,
      errorMessage: "Please enter a valid comment",
    },
  });

  const getCurrentSession = async () => {
    setLoading(true);
    const { data } = await axiosPrivate.get(`/session/${sessionId}`);
    setCurrentSession(data.session);
    setLoading(false);
    console.log(formatDateAndTime(data.session.end));
  };

  const getSessionTime = (val) => {
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
  const loggedInUserStatus = async () => {
    setLoading(true);
    const { data } = await axiosPrivate.get(
      `/session/${sessionId}/student/status`
    );
    console.log(data);
    if (data) {
      setUserStatus("Confirm");
    } else {
      setUserStatus("Not Joining");
    }
    setLoading(false);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axiosPrivate.post("/session/comment", {
      name: auth.userName,
      content: e.target.comment.value.trim(),
      sessionId: sessionId,
    });
    console.log(data);
    setComment("");
  };
  useEffect(() => {
    getCurrentSession();
    loggedInUserStatus();
  }, [sessionId]);

  const handleCommentError = (inputError) => {
    setFormError((prevState) => ({
      ...prevState,
      commentError: {
        ...prevState.commentError,
        error: inputError,
      },
    }));
  };
  console.log(currentSession);
  console.log("Discussion:", currentSession?.discussion);

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 2,
          gap: 2,
          backgroundColor: "#C84B31",
          fontSize: 25,
          borderRadius: 2,
          marginBottom: 4,
        }}
      >
        <Button variant="contained">{currentSession?.type} Session</Button>
        <Button variant="contained" color="success">
          {currentSession?.creator.name}
        </Button>
        <Button
          variant="contained"
          color={userStatus === "Confirm" ? "success" : "error"}
        >
          You're {userStatus === "Confirm" ? "Enrolled" : "Not Enrolled"}
        </Button>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderRightWidth: 3, borderRightColor: "white" }}
        />
        <Typography
          component="div"
          sx={{ border: 2, p: 1, borderRadius: 1, bgcolor: "#1a1a2e" }}
        >
          <Review sessionId={sessionId} />
        </Typography>
      </Box>
      <Box
        sx={{
          justifyContent: "center",
          padding: 2,
          gap: 2,
          backgroundColor: "#1a1a2e",
          fontSize: 25,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#1a1a2e",
            padding: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ marginBottom: 2, color: "white" }}
          >
            Session Time
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            alignItems="center"
            justifyContent="center"
          >
            <Chip
              label=<Typography fontWeight="bold">{`Start Time: ${
                currentSession?.start
                  ? getSessionTime(currentSession?.start)
                  : null
              }`}</Typography>
              sx={{
                backgroundColor: "#C84B31",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            />
            <Chip
              label=<Typography fontWeight="bold">
                {`End Time: ${
                  currentSession?.end
                    ? getSessionTime(currentSession?.end)
                    : null
                }`}
              </Typography>
              sx={{
                backgroundColor: "#C84B31",
                color: "white",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            />
          </Stack>
        </Box>
        <Box
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 25,
            color: "white",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Session Attendees
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            justifyContent="center"
          >
            {currentSession?.participant?.length > 0 ? (
              currentSession?.participant.map((p) => (
                <Chip
                  sx={{
                    paddingX: 0,
                    paddingy: 2,
                  }}
                  key={p._id}
                  avatar={
                    <Avatar sx={{ bgcolor: "white", color: blue[500] }}>
                      <SchoolOutlinedIcon />
                    </Avatar>
                  }
                  label=<Typography
                    fontWeight="bold"
                    color="white"
                  >{`${p.name}`}</Typography>
                  variant="filled"
                  color="success"
                />
              ))
            ) : (
              <Typography
                component="div"
                sx={{
                  minWidth: "75%",
                  margin: "auto",
                  backgroundColor: "#C84B31",
                  borderRadius: 2,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 25,
                  padding: 2,
                }}
              >
                <Typography
                  variant="h6"
                  color="text.primary"
                  fontWeight="bold"
                  sx={{
                    width: "75%",
                    margin: "auto",
                    backgroundColor: "#f2f2f2",
                    padding: 2,
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  No students in this session
                </Typography>
              </Typography>
            )}
          </Stack>
        </Box>

        <Box
          component={"form"}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
          autoComplete="off"
          onSubmit={handleCommentSubmit}
        >
          <div className={styles.formContainer}>
            <AuthFormControl width="75%">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <br></br>
              </Box>
              <FormTextField
                required
                type="text"
                label="Comment:"
                name="comment"
                isFocused={true}
                width="100%"
                variant="light"
                reset={reset}
                value={comment}
                onHandleError={handleCommentError}
              ></FormTextField>
            </AuthFormControl>
            <AppButton
              text={"Add a new comment"}
              type="submit"
              width="40%"
              handlerFunction={() => {}}
            >
              <AddCommentRoundedIcon />
            </AppButton>
          </div>
        </Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="White"
          sx={{ textAlign: "center", marginTop: 1 }}
        >
          Discussion
        </Typography>
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#C84B31",
            borderRadius: 2,
            width: "75%",
            margin: "auto",
          }}
        >
          {currentSession?.discussion?.length > 0 ? (
            currentSession?.discussion.map((d) => (
              <ListItem alignItems="flex-start" key={d._id} sx={{}}>
                <Paper
                  elevation={24}
                  sx={{
                    p: 2,
                    width: "100% ",
                    display: "flex",
                    alignItems: "flex-start",
                    borderRadius: 2,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>{`${d.name.name[0].toUpperCase()}`}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary=<Typography
                      variant="body1"
                      color="text.primary"
                      fontWeight="bold"
                    >{`${d.name.name}`}</Typography>
                    secondary=<Typography
                      variant="body2"
                      fontSize="medium"
                    >{`${d.content}`}</Typography>
                  />
                </Paper>
              </ListItem>
            ))
          ) : (
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight="bold"
              sx={{
                width: "75%",
                margin: "auto",
                backgroundColor: "#f2f2f2",
                padding: 2,
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              No discussions in this session
            </Typography>
          )}
        </List>
      </Box>
    </Container>
  );
};

export default StudentSession;
