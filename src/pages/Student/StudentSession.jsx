import {
  Box,
  Container,
  Typography,
  List,
  Card,
  CardContent,
} from "@mui/material";
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
  };

  console.log(currentSession);

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
    console.log(data);
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
          {currentSession?.type} Session
        </Typography>
        <Typography
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
          {currentSession?.creator.name}
        </Typography>
        <Typography
          sx={{
            backgroundColor: "#055c1c",
            borderRadius: 2,
            padding: 2,
            margin: 1,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          My Current Status: {userStatus}
        </Typography>
      </Box>
      <Typography
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 2,
          padding: 1,
          margin: 1,
          textAlign: "center",
          fontSize: 20,
        }}
      >
        Start: {currentSession?.start}
      </Typography>
      <Typography
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 2,
          padding: 1,
          margin: 1,
          textAlign: "center",
          fontSize: 20,
        }}
      >
        End: {currentSession?.end}
      </Typography>
      <Review sessionId={sessionId} />
      <List>
        {currentSession?.participant?.length > 0 ? (
          currentSession?.participant.map((p) => (
            <Card
              key={p._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <CardContent>
                  <Typography variant="h5">{`${p.name}`}</Typography>
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
            No students in this session
          </Typography>
        )}
      </List>
      <br />
      <br />

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
        Discussion
      </Typography>

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
      <List>
        {currentSession?.discussion?.length > 0 ? (
          currentSession?.discussion.map((d) => (
            <Card
              key={d._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <CardContent>
                  <Typography variant="h5">{`${d.content}`}</Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography>{`${d.name.name}`}</Typography>
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
            No discussions in this session
          </Typography>
        )}
      </List>
    </Container>
  );
};

export default StudentSession;