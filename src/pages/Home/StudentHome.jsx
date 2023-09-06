import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import styles from "./StudentHome.module.css";
import AuthFormControl from "./../../components/FormControl/AuthFormControl";

const StudentHome = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [selectedCohort, setSelectedCohort] = useOutletContext();

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const { data } = await axiosPrivate.get("/profile", {});
        console.log(data);
        setCohorts(data.profile.cohorts);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCohorts();
  }, [axiosPrivate]);

  useEffect(() => {
    if (cohorts.length === 1) {
      navigate(`/student/cohort/${cohorts[0]._id}`, { state: cohorts[0] });
    }
  }, [cohorts]);

  const getCohort = (id) => {
    return cohorts.find((c) => c._id === id);
  };

  const handleClick = (id) => {
    console.log(id);
    navigate(`student/cohort/${id}`, { state: getCohort(id) });
  };

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <>
          {" "}
          <Container maxWidth="md">
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#1A1A2E",
                color: "#FFFFFF",
                borderRadius: "10px",
                padding: 2,
                height: "auto",
              }}
            >
              <Typography
                component={"h1"}
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
                Current Cohorts
              </Typography>
              <div className={styles.formContainer}>
                <AuthFormControl width="75%">
                  <Box
                    sx={{ width:"90%" }}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    marginX={2}
                  >
                    <Stack
                      direction={"column"}
                      spacing={1}
                      overflow={"auto"}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 1,
                        backgroundColor: "white",
                        borderRadius: 3,
                        width: "100%",
                      }}
                    >
                      {cohorts.length === 0 ? (
                        <Box
                          display={"flex"}
                          flexDirection={"column"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          width={"100%"}
                        >
                          <Avatar
                              alt={"User Cohort"}
                              src="/images/sad.png"
                              sx={{
                                width: 64,
                                height: 64,
                              }}
                              variant="square"
                            />
                          <Typography
                            component={"h2"}
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 1,
                              backgroundColor: "#0F3460",
                              borderRadius: 2,
                              padding: 1,
                              margin: 1,
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: 16,
                              width: "50%",
                            }}
                          >
                            {`Not enrolled in any cohort`}
                          </Typography>
                        </Box>
                      ) : (
                        cohorts.map((c) => (
                          <Box
                            key={c._id}
                            display={"flex"}
                            flexDirection={"row"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            width={"100%"}
                          >
                            <Avatar
                              alt={"User Cohort"}
                              src="/images/cohort.png"
                              sx={{
                                width: 64,
                                height: 64,
                              }}
                              variant="square"
                            />
                            <Typography
                              component={"h2"}
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                                backgroundColor: "#0F3460",
                                borderRadius: 2,
                                padding: 1,
                                margin: 1,
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: 16,
                                width: "50%",
                                "&:hover": {
                                  transform: "scale(1.03)",
                                  transition: "0.2s ease-in-out",
                                  cursor: "pointer"
                                },
                              }}
                              onClick={() => handleClick(c._id)}
                            >
                              {c.name}
                            </Typography>
                          </Box>
                        ))
                      )}
                    </Stack>
                  </Box>
                </AuthFormControl>
              </div>
            </Paper>
          </Container>
        </>
      )}
    </>
  );
};

export default StudentHome;
