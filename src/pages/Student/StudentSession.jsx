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
  Divider,
  ListItem,
  CardContent,
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

  console.log(currentSession);

  const loggedInUserStatus = async () => {
    setLoading(true);
    const { data } = await axiosPrivate.get(
      `/session/${sessionId}/student/status`
    );
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
    const localTime = `${hour}:${minute} ${ampm}`;
    return localTime;
  };
  const getComment = async () => {
    setLoading(true);
    const { data } = await axiosPrivate.get("/session/comment");
    // console.log(data);
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
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          bgcolor: "transparent",
          padding: 1,
          gap: 2,
          fontSize: 25,
        }}
      >
        <Button variant="contained" sx={{ fontSize: 25, bgcolor: "#c84b31" }}>
          {currentSession?.type} Session
        </Button>
        <Button variant="contained" sx={{ fontSize: 25 }}>
          {currentSession?.creator.name}
        </Button>
        <Button
          variant="contained"
          color={userStatus === "Confirm" ? "success" : "error"}
          sx={{ fontSize: 25 }}
        >
          You're {userStatus === "Confirm" ? "Enrolled" : "Not Enrolled"}
        </Button>
      </Box>
      <Typography
        sx={{
          borderRadius: 2,
          padding: 1,
          margin: 1,
          textAlign: "center",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
        >
          <Chip
            label={`From - ${
              currentSession?.start
                ? getSessionTime(currentSession?.start)
                : null
            }`}
            sx={{
              backgroundColor: "#112f57",
              color: "white",
              fontSize: 25,
              "&:hover": {
                transform: "scale(1.05)",
                transition: "all 0.2s ease-in-out",
              },
            }}
          ></Chip>
          <Chip
            label={`To - ${
              currentSession?.end ? getSessionTime(currentSession?.end) : null
            }`}
            sx={{
              backgroundColor: "#112f57",
              color: "white",
              fontSize: 25,

              "&:hover": {
                transform: "scale(1.05)",
                transition: "all 0.2s ease-in-out",
              },
            }}
          ></Chip>
        </Stack>
      </Typography>

      <Typography
        sx={{
          backgroundColor: "#055c1c",
          borderRadius: 2,
          padding: 1,
          margin: 1,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 25,
        }}
      >
        Enrolled Students
        <List
          sx={{
            width: "100%",
            bgcolor: "#F8F0E5",
            borderRadius: 1,
            fontSize: 16,
          }}
        >
          {currentSession?.participant?.length > 0 ? (
            currentSession?.participant.map((p) => (
              <>
                <ListItem
                  key={p._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      <SchoolOutlinedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary=<Typography variant="body1">{`${p.name}`}</Typography>
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
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
              No students in this session
            </Typography>
          )}
        </List>
      </Typography>

      <br />
      <br />

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
            text={"Add new comment"}
            type="submit"
            width="25%"
            handlerFunction={() => {}}
          />
        </div>
      </Box>

      <Typography
        sx={{
          backgroundColor: "#FF9B50",
          borderRadius: 2,
          border: 2,
          borderColor: "#C84B31",
          padding: 1,
          margin: 1,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 25,
        }}
      >
        <Divider>Discussion</Divider>
        <List
          sx={{
            width: "100%",
            bgcolor: "#F8F0E5",
            borderRadius: 1,
          }}
        >
          {currentSession?.discussion?.length > 0 ? (
            currentSession?.discussion.map((d) => (
              <>
                <ListItem alignItems="flex-start" key={d._id}>
                  <ListItemAvatar>
                    <Avatar>{`${d.name.name[0]}`}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary=<Typography
                      // component="h1"
                      variant="body2"
                      color="text.primary"
                      fontWeight="bold"
                    >{`${d.name.name}`}</Typography>
                    secondary=<Typography
                      component="p"
                      variant="body2"
                    >{`${d.content}`}</Typography>
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
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
              No discussions in this session
            </Typography>
          )}
        </List>
      </Typography>
      <Typography
        color="initial"
        sx={{ width: "40%", maxWidth: "50%", margin: "auto" }}
      >
        <Review sessionId={sessionId} />
      </Typography>
    </Container>
  );
};

export default StudentSession;
