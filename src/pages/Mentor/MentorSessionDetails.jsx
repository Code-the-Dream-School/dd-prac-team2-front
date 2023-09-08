import {
  Box,
  Container,
  Typography,
  List,
  CardContent,
  ListItem,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { blue } from "@mui/material/colors";
import {
  AddCommentRounded,
  ScheduleRounded,
  TodayRounded,
} from "@mui/icons-material";
import styles from "./Mentor.module.css";
import AuthFormControl from "../../components/FormControl/AuthFormControl";
import FormTextField from "../../components/TextField/FormTextField";
import AppButton from "../../components/Button/AppButton";
import Loader from './../../components/Loader/Loader';

const MentorSessionDetails = () => {
  const { sessionId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [currentSession, setCurrentSession] = useState();
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [reset, setReset] = useState(false);
  const [formError, setFormError] = useState({
    commentError: {
      error: false,
      errorMessage: "Please enter a valid comment",
    },
  });

  const getCurrentSession = async () => {
    setLoading(true);
    const { data } = await axiosPrivate.get(`/session/${sessionId}`);
    console.log(data);
    setCurrentSession(data.session);
    setLoading(false);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axiosPrivate.post("/session/comment", {
      name: auth.userName,
      content: e.target.comment.value.trim(),
      sessionId: sessionId,
    });

    const newComment = data.comment;
    newComment.name = { _id: auth.userId, name: auth.userName, avatarUrl: auth.avatarUrl };
    const newSession = {
      ...currentSession,
      discussion: [...currentSession.discussion, newComment],
    };
    setCurrentSession(newSession);
    setComment("");
    setReset(true);
  };

  useEffect(() => {
    getCurrentSession();
  }, [sessionId]);

  useEffect(()=>{
    setReset(false);
  });

  const convertDate = (date) => {
    if (!date) {
      return;
    }
    const auxDate = new Date(date);
    const i = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    });
    return i.format(auxDate);
  };

  const getColor = (name) => {
    const colors = [
      "#FFD4B2",
      "#FFF6BD",
      "#CEEDC7",
      "#86C8BC",
      "#FD8A8A",
      "#9EA1D4",
    ];
    const letterNum = name[0].toLowerCase().charCodeAt(0) - 97;
    return colors[letterNum % colors.length];
  };

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
    <>
      {loading ? (
        <Loader/>
      ) : (
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            width: "100%",
            backgroundColor: "#1A1A2E",
            marginBlock: 4,
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography
            component={"h1"}
            sx={{
              backgroundColor: "#C84B31",
              padding: 1,
              color: "background.paper",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 25,
              borderRadius: 2,
              marginBottom: 2,
              width: "100%",
            }}
          >
            Session Details
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", md: "row" },
              justifyContent: { xs: "center", md: "space-between" },
              gap: { xs: 1, md: 0 },
              alignItems: "center",
              paddingBlock: 1,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" },
                justifyContent: { xs: "space-between", md: "center" },
                alignItems: "center",
                gap: { xs: 0, md: 1 },
                borderRadius: 2,
                padding: 1,
                width: { xs: "100%", md: "40%" },
                backgroundColor: "white",
              }}
            >
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={{ xs: "center", md: "flex-start" }}
                alignItems={"center"}
                gap={1}
                width={"100%"}
              >
                <TodayRounded
                  fontSize="large"
                  sx={{ color: "#0F3460" }}
                ></TodayRounded>
                <Typography
                  sx={{
                    padding: 1,
                    borderRadius: 2,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    backgroundColor: "#0F3460",
                    color: "white",
                  }}
                >
                  {convertDate(currentSession?.start)}
                </Typography>
              </Box>
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={{ xs: "center", md: "flex-start" }}
                alignItems={"center"}
                gap={1}
                width={"100%"}
              >
                <ScheduleRounded
                  fontSize="large"
                  sx={{ color: "#0F3460" }}
                ></ScheduleRounded>
                <Typography
                  sx={{
                    padding: 1,
                    borderRadius: 2,
                    fontSize: "1.2rem",
                    backgroundColor: "#0F3460",
                    color: "white",
                  }}
                >
                  Duration: 60 minutes
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                borderRadius: 2,
                padding: 1,
                width: { xs: "100%", md: "30%" },
                backgroundColor: "white",
              }}
            >
              <Avatar
                src={currentSession?.creator.avatarUrl}
                alt={currentSession?.creator.name}
                sx={{
                  bgcolor: "#0F3460",
                  color: "white",
                  width: "64px",
                  height: "64px",
                }}
              />
              <Box>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: "#16213E",
                  }}
                >
                  {"Mentor:"}
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", color: "#0F3460" }}>
                  {currentSession?.creator.name}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingBlock: 1,
              width: "100%",
            }}
          >
            <Typography
              component={"h1"}
              sx={{
                backgroundColor: "#C84B31",
                padding: 1,
                color: "background.paper",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 25,
                borderRadius: 2,
                marginBottom: 2,
                width: "100%",
              }}
            >
              Confirmed Participants
            </Typography>
            {currentSession?.participant.length > 0 ? (
              <List
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                {currentSession?.participant.map((student) => (
                  <ListItem key={student._id} sx={{ width: "auto" }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                        padding: 1,
                        borderRadius: 2,
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        backgroundColor: "#0F3460",
                        color: "white",
                      }}
                      component={"div"}
                    >
                      <Avatar
                        src={student.avatarUrl}
                        alt={student.name}
                        sx={{
                          bgcolor: "#0F3460",
                          color: "success",
                          width: "48px",
                          height: "48px",
                        }}
                      />
                      {student.name}
                    </Typography>
                  </ListItem>
                ))}
              </List>
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
                No students in this session
              </Typography>
            )}
          </Box>
          <Typography
            component={"h1"}
            sx={{
              backgroundColor: "#C84B31",
              padding: 1,
              color: "background.paper",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 25,
              borderRadius: 2,
              marginBottom: 2,
              width: "100%",
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
                  errorMessage={"This field is required"}
                ></FormTextField>
              </AuthFormControl>
              <AppButton
                text={"Add a new comment"}
                type="submit"
                width="40%"
                handlerFunction={() => {}}
              >
                <AddCommentRounded></AddCommentRounded>
              </AppButton>
            </div>
          </Box>
          <List sx={{ width: "80%", marginBlockEnd: 4 }}>
            {currentSession?.discussion?.length > 0 ? (
              currentSession?.discussion.map((d) => (
                <Box
                  key={d._id}
                  sx={{
                    display: "flex",
                    flexDirection:{xs:"column", sm:"row"},
                    justifyContent: {xs:"flex-start", sm:"space-between"},
                    alignItems: "center",
                    marginBlockEnd: 1,
                    backgroundColor: "#fefefe",
                    borderRadius: 2,
                    width:"100%",
                  }}
                >
                  <Box display={"flex"} width={{xs:"100%", sm:"30%"}}>
                    <CardContent sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", gap:1}}>
                      <Avatar
                        src={d.name.avatarUrl}
                        alt={d.name.name}
                        sx={{
                          bgcolor: "#0F3460",
                          color: "white",
                          width: "32px",
                          height: "32px",
                        }}
                      />
                      <Typography sx={{fontWeight:"bold"}}>{d.name.name}</Typography>
                    </CardContent>
                  </Box>
                  <Box display={"flex"} width={{xs:"100%", sm:"70%"}}>
                    <CardContent>
                      <Typography>{d.content}</Typography>
                    </CardContent>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>No discussions in this session</Typography>
            )}
          </List>
        </Container>
      )}
    </>
  );
};

export default MentorSessionDetails;
