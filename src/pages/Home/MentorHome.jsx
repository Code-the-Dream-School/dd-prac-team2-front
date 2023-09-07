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
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import styles from "./MentorHome.module.css";
import Loader from "../../components/Loader/Loader";
import AuthFormControl from "../../components/FormControl/AuthFormControl";

const MentorHome = () => {
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useOutletContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const res = await axiosPrivate.get("/profile");
        if (res.data.profile.cohorts.length === 1) {
          const cohort = res.data.profile.cohorts[0];
          setSelectedCohort(cohort);
          navigate(`/cohort/${cohort._id}`, { state: cohort });
        }
        setCohorts(res.data.profile.cohorts);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    if (!selectedCohort || queryParams.get("resetCohort")) {
      fetchCohorts();
    } else {
      navigate(`/cohort/${selectedCohort._id}`);
    }
  }, [axiosPrivate]);

  if (cohorts.length === 1) {
    setSelectedCohort(cohorts[0]);
    navigate(`/cohort/${cohorts[0]._id}`, { state: cohorts[0] });
  }

  const getCohort = (id) => {
    return cohorts.find((c) => c._id === id);
  };

  const handleClick = (id) => {
    const selected = cohorts.find((c) => c._id === id);
    setSelectedCohort(selected);
    navigate(`/cohort/${id}`, { state: getCohort(id) });
    return;
  };

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <>
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
                    sx={{ width: "90%" }}
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
                                  cursor: "pointer",
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

export default MentorHome;
