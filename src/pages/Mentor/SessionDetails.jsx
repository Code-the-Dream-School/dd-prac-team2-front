import {
  Box,
  Container,
  Typography,
  List,
  Card,
  CardContent,
  Chip,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import AuthFormControl from "../../components/FormControl/AuthFormControl";
import FormTextField from "../../components/TextField/FormTextField";
import AppButton from "../../components/Button/AppButton";
import useAuth from "../../hooks/useAuth";

const MentorSession = () => {
  const [currentSession, setCurrentSession] = useState();
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [reset, setReset] = useState(false);
  //   const [userStatus, setUserStatus] = useState();
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

  //   const loggedInUserStatus = async () => {
  //     setLoading(true);
  //     const { data } = await axiosPrivate.get(
  //       `/session/${sessionId}/student/status`
  //     );
  //     console.log(data);
  //     if (data) {
  //       setUserStatus("Confirm");
  //     } else {
  //       setUserStatus("Not Joining");
  //     }
  //     setLoading(false);
  //   };

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

  // const getComment = async () => {
  //   setLoading(true);
  //   const { data } = await axiosPrivate.get("/session/comment");
  //   console.log(data);
  //   // setComment((prev)=>[...prev, data]);
  //   setLoading(false);
  // };

  useEffect(() => {
    getCurrentSession();
    // loggedInUserStatus();
    // getComment();
  }, [sessionId]);

  const userStatus =
    currentSession?.creator._id === auth.userId ||
    currentSession?.participant?.includes(auth.userId);

  const handleCommentError = (inputError) => {
    setFormError((prevState) => ({
      ...prevState,
      commentError: {
        ...prevState.commentError,
        error: inputError,
      },
    }));
  };

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

  const getRandomColor = () => {
    const colors = [
      "#FFD4B2",
      "#FFF6BD",
      "#CEEDC7",
      "#86C8BC",
      "#FD8A8A",
      "#9EA1D4",
    ];
    const i = Math.floor(Math.random() * colors.length);
    return colors[i];
  };

  return (
    <>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <Container sx={{ backgroundColor: "#f2f2f2" }}>
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

          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              marginBlock: 2,
            }}
          >
            <Typography
              component="h3"
              sx={{ fontSize: "1.5rem", paddingBlock: 1 }}
            >
              Current status:
            </Typography>
            {userStatus ? (
              <Chip label="Confirmed" color="success"></Chip>
            ) : (
              <Chip label="Not Confirmed" color="warning"></Chip>
            )}
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
                        backgroundColor: getRandomColor(),
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
          <Box>
            <Typography
              component="h3"
              sx={{ fontSize: "1.5rem", paddingBlock: 1 }}
            >
              Discussion:
            </Typography>
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
                      <Typography>{d.content}</Typography>
                    </CardContent>
                  </Box>
                  <Box>
                    <CardContent>
                      <Typography>{d.name.name}</Typography>
                    </CardContent>
                  </Box>
                </Card>
              ))
            ) : (
              <Typography>No discussions in this session</Typography>
            )}
          </List>
        </Container>
      )}
    </>
  );
  // return (
  //   <Container>
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         bgcolor: "transparent",
  //       }}
  //     >
  //       <Typography
  //         component={"h1"}
  //         sx={{
  //           backgroundColor: "#C84B31",
  //           borderRadius: 2,
  //           padding: 2,
  //           margin: 1,
  //           textAlign: "center",
  //           fontWeight: "bold",
  //           fontSize: 25,
  //         }}
  //       >
  //         {currentSession?.type} Session
  //       </Typography>
  //       <Typography
  //         sx={{
  //           backgroundColor: "#C84B31",
  //           borderRadius: 2,
  //           padding: 2,
  //           margin: 1,
  //           textAlign: "center",
  //           fontWeight: "bold",
  //           fontSize: 25,
  //         }}
  //       >
  //         {currentSession?.creator.name}
  //       </Typography>
  //       <Typography
  //         sx={{
  //           backgroundColor: "#055c1c",
  //           borderRadius: 2,
  //           padding: 2,
  //           margin: 1,
  //           textAlign: "center",
  //           fontWeight: "bold",
  //           fontSize: 25,
  //         }}
  //       >
  //         My Current Status: {userStatus ? "Confirmed" : "Not confirmed"}
  //       </Typography>
  //     </Box>
  //     <Typography
  //       sx={{
  //         backgroundColor: "#ffffff",
  //         borderRadius: 2,
  //         padding: 1,
  //         margin: 1,
  //         textAlign: "center",
  //         fontSize: 20,
  //       }}
  //     >
  //       Start: {currentSession?.start}
  //     </Typography>
  //     <Typography
  //       sx={{
  //         backgroundColor: "#ffffff",
  //         borderRadius: 2,
  //         padding: 1,
  //         margin: 1,
  //         textAlign: "center",
  //         fontSize: 20,
  //       }}
  //     >
  //       End: {currentSession?.end}
  //     </Typography>
  //     <Typography
  //       sx={{
  //         backgroundColor: "#f2f2f2",
  //         padding: 2,
  //         borderRadius: 2,
  //       }}
  //     >
  //       Confirmed participation:
  //     </Typography>
  //     <List>
  //       {currentSession?.participant?.length > 0 ? (
  //         currentSession?.participant.map((p) => (
  //           <Card
  //             key={p._id}
  //             sx={{
  //               display: "flex",
  //               justifyContent: "space-between",
  //               alignItems: "center",
  //             }}
  //           >
  //             <Box>
  //               <CardContent>
  //                 <Typography variant="h5">{`${p.name}`}</Typography>
  //               </CardContent>
  //             </Box>
  //           </Card>
  //         ))
  //       ) : (
  //         <Typography
  //           sx={{
  //             backgroundColor: "#f2f2f2",
  //             padding: 2,
  //             borderRadius: 2,
  //             textAlign: "center",
  //           }}
  //         >
  //           No students in this session
  //         </Typography>
  //       )}
  //     </List>
  //     <br />
  //     <br />

  //     <Typography
  //       component={"h1"}
  //       sx={{
  //         backgroundColor: "#C84B31",
  //         borderRadius: 2,
  //         padding: 2,
  //         margin: 1,
  //         textAlign: "center",
  //         fontWeight: "bold",
  //         fontSize: 25,
  //       }}
  //     >
  //       Discussion
  //     </Typography>

  //     <Box
  //       component={"form"}
  //       sx={{
  //         display: "flex",
  //         flexDirection: "column",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         width: "100%",
  //       }}
  //       autoComplete="off"
  //       onSubmit={handleCommentSubmit}
  //     >
  //       <div>
  //         <AuthFormControl width="75%">
  //           <Box
  //             sx={{
  //               display: "flex",
  //               flexDirection: "column",
  //               justifyContent: "center",
  //             }}
  //           >
  //             <br></br>
  //           </Box>
  //           <FormTextField
  //             required
  //             type="text"
  //             label="Comment:"
  //             name="comment"
  //             isFocused={true}
  //             width="100%"
  //             variant="light"
  //             reset={reset}
  //             value={comment}
  //             onHandleError={handleCommentError}
  //           ></FormTextField>
  //         </AuthFormControl>
  //         <AppButton
  //           text={"Add new comment"}
  //           type="submit"
  //           width="25%"
  //           handlerFunction={() => {}}
  //         />
  //       </div>
  //     </Box>
  //     <List>
  //       {currentSession?.discussion?.length > 0 ? (
  //         currentSession?.discussion.map((d) => (
  //           <Card
  //             key={d._id}
  //             sx={{
  //               display: "flex",
  //               justifyContent: "space-between",
  //               alignItems: "center",
  //             }}
  //           >
  //             <Box>
  //               <CardContent>
  //                 <Typography variant="h5">{`${d.content}`}</Typography>
  //               </CardContent>
  //             </Box>
  //             <Box>
  //               <CardContent>
  //                 <Typography>{`${d.name.name}`}</Typography>
  //               </CardContent>
  //             </Box>
  //           </Card>
  //         ))
  //       ) : (
  //         <Typography
  //           sx={{
  //             backgroundColor: "#f2f2f2",
  //             padding: 2,
  //             borderRadius: 2,
  //             textAlign: "center",
  //           }}
  //         >
  //           No discussions in this session
  //         </Typography>
  //       )}
  //     </List>
  //   </Container>
  // );
};

export default MentorSession;
