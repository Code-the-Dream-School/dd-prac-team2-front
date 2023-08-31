import {
  Box,
  Container,
  Typography,
  List,
  CardContent,
  ListItem,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const MentorSessionDetails = () => {
  const { sessionId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [currentSession, setCurrentSession] = useState();
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

  const getCurrentSession = async () => {
    setLoading(true);
    const { data } = await axiosPrivate.get(`/session/${sessionId}`);
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
    newComment.name = { _id: auth.userId, name: auth.userName };
    const newSession = {
      ...currentSession,
      discussion: [...currentSession.discussion, newComment],
    };
    setCurrentSession(newSession);
    setComment("");
  };

  useEffect(() => {
    getCurrentSession();
  }, [sessionId]);

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

  const getInitials = (name) => {
    const words = name.split(" ");
    let initials = "";
    for (let w of words) {
      initials += w[0].toUpperCase();
    }
    return initials;
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

  return (
    <>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <Container
          sx={{ backgroundColor: "#f2f2f2", marginBlock: 4, borderRadius: 2 }}
        >
          <Typography component="h1" sx={{ fontSize: "2rem" }}>
            Session Details
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              paddingBlock: 1,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "1.2rem" }}>
                {convertDate(currentSession?.start)}
              </Typography>
              <Typography sx={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                Duration: 60 minutes
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                sx={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  padding: 1,
                  lineHeight: "40px",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  backgroundColor: "cornflowerblue",
                }}
              >
                {getInitials(currentSession?.creator.name)}
              </Typography>
              <Box>
                <Typography>{"Mentor:"}</Typography>
                <Typography>{currentSession?.creator.name}</Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography
              component="h3"
              sx={{ fontSize: "1.5rem", paddingBlock: 1 }}
            >
              Confirmed Participants:
            </Typography>
            {currentSession?.participant.length > 0 ? (
              <List>
                {currentSession?.participant.map((student) => (
                  <ListItem key={student._id}>
                    <Typography
                      sx={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        lineHeight: "40px",
                        textAlign: "center",
                        backgroundColor: getColor(student.name),
                      }}
                    >
                      {getInitials(student.name)}
                    </Typography>
                    <Typography sx={{ paddingLeft: "8px" }}>
                      {student.name}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No students in this session at the moment</Typography>
            )}
          </Box>
          <Typography
            component="h3"
            sx={{ fontSize: "1.5rem", paddingBlock: 1 }}
          >
            Discussion:
          </Typography>

          <Box
            component="form"
            autoComplete="off"
            onSubmit={handleCommentSubmit}
            sx={{
              alignItems: "center",
            }}
          >
            <TextField
              required
              type="text"
              label="Add new comment"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ display: "flex" }}
            ></TextField>
            <Box
              sx={{ display: "flex", justifyContent: "center", marginBlock: 1 }}
            >
              <Button
                type="submit"
                sx={{
                  color: "white",
                  backgroundColor: "#C84B31",
                  "&:hover": {
                    backgroundColor: "#C84B31",
                    transform: "scale(1.05)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
              >
                Add new Comment
              </Button>
            </Box>
          </Box>

          <List sx={{ marginBlockEnd: 4 }}>
            {currentSession?.discussion?.length > 0 ? (
              currentSession?.discussion.map((d) => (
                <Box
                  key={d._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBlockEnd: 1,
                    backgroundColor: "#fefefe",
                    borderRadius: 2,
                  }}
                >
                  <Box>
                    <CardContent>
                      <Typography>{d.content}</Typography>
                    </CardContent>
                  </Box>
                  <Box>
                    <CardContent>
                      <Typography>{d.name.name}</Typography>
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
