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

const StudentSession = () => {
  const [currentSession, setCurrentSession] = useState();
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [reset, setReset] = useState(false);

  useEffect(() => {
    const getCurrentSession = async () => {
      setLoading(true);
      const { data } = await axiosPrivate.get(`/session/${sessionId}`);

      setCurrentSession(data.session);
      setLoading(false);
    };

    getCurrentSession();
  }, [sessionId]);
  console.log(currentSession);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
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
          {currentSession?.type}
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
          Host: {currentSession?.creator.name}
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
          My Current Status: Confirm
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
                  <Typography variant="h5">{`Student: ${p.user.userInfo.name}`}</Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography>{`Status: ${p.user.userStatus}`}</Typography>
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
    </Container>
  );
};

export default StudentSession;
