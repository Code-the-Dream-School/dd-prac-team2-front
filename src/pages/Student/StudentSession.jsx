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

  const getComment = async () => {
    setLoading(true);
    const { data } = await axiosPrivate.get("/session/comment");
    console.log("Comments Array", data);
    // setComment((prev)=>[...prev, data]);
    setLoading(false);
  };

  useEffect(() => {
    getCurrentSession();
    loggedInUserStatus();
    getComment();
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
      </Box>
      <Box
        sx={{
          justifyContent: "center",
          padding: 2,
          gap: 2,
          backgroundColor: "#1a1a2e",
          fontSize: 25,
          borderRadius: 2,
          marginBottom: 4,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#1a1a2e",
            padding: 3,
            textAlign: "center",
            fontSize: 20,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            alignItems="center"
            justifyContent="center"
          >
            <Chip
              label=<Typography>{`Start Time: ${
                currentSession?.start
                  ? getSessionTime(currentSession?.start)
                  : null
              }`}</Typography>
              sx={{
                backgroundColor: "#C84B31",
                color: "white",
                fontSize: 20,
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            />
            <Chip
              label=<Typography>
                {`End Time: ${
                  currentSession?.end
                    ? getSessionTime(currentSession?.end)
                    : null
                }`}
              </Typography>
              sx={{
                backgroundColor: "#C84B31",
                color: "white",
                fontSize: 20,
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            />
          </Stack>
        </Box>
        <Box sx={{ backgroundColor: "#1a1a2e", padding: 3 }}>
          <Typography component="div" sx={{ maxWidth: "60%", margin: "auto" }}>
            <Review sessionId={sessionId} />
          </Typography>
        </Box>
        <Box
          sx={{
            padding: 3,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 25,
            color: "white",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Session Attendees
          </Typography>
          <br />
          <Stack
            direction="row"
            spacing={1}
            divider={<Divider orientation="vertical" flexItem />}
            flexWrap="wrap"
            useFlexGap
            justifyContent="center"
          >
            {currentSession?.participant?.length > 0 ? (
              currentSession?.participant.map((p) => (
                <Chip
                  key={p._id}
                  avatar={
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      <SchoolOutlinedIcon />
                    </Avatar>
                  }
                  label=<Typography color="white">{`${p.name}`}</Typography>
                  variant="outlined"
                  color="success"
                />
              ))
            ) : (
              <Typography
                component="div"
                sx={{
                  width: "75%",
                  margin: "auto",
                  backgroundColor: "#C84B31",
                  borderRadius: 2,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 25,
                  padding: 1,
                }}
              >
                <Typography
                  variant="h6"
                  color="text.primary"
                  fontWeight="bold"
                  sx={{
                    backgroundColor: "#f2f2f2",
                    padding: 2,
                    width: "75%",
                    margin: "auto",
                    borderRadius: 2,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  No students in this session
                </Typography>
              </Typography>
            )}
          </Stack>
        </Box>
        <br />
        <Box
          component={"form"}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: 2,
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
              width="60%"
              handlerFunction={() => {}}
            />
          </div>
        </Box>

        <Typography
          component="div"
          sx={{
            width: "75%",
            margin: "auto",
            backgroundColor: "#C84B31",
            borderRadius: 2,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          <Divider sx={{ color: "#FFFFFF" }}>Discussion</Divider>
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {currentSession?.discussion?.length > 0 ? (
              currentSession?.discussion.map((d) => (
                <ListItem alignItems="flex-start" key={d._id}>
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
        </Typography>
      </Box>
    </Container>
  );
};

export default StudentSession;
