/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";

import styles from "./AdminHome.module.css";
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import Loader from "../../components/Loader/Loader";
import {
  Avatar,
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AuthFormControl from "../../components/FormControl/AuthFormControl";

const AdminHome = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Container maxWidth="lg">
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
              ADMIN DASHBOARD
            </Typography>
            <div className={styles.formContainer}>
              <AuthFormControl width="75%">
                <Box
                  sx={{ width: "33.33%" }}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  marginX={2}
                >
                  <Typography
                    component={"h1"}
                    sx={{
                      backgroundColor: "#0F3460",
                      borderRadius: 2,
                      padding: 1,
                      margin: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 25,
                      width: "100%",
                    }}
                  >
                    ALL CLASSES
                  </Typography>
                  <Stack
                    direction={"row"}
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
                    <Avatar
                      alt={"Intro to Programming"}
                      src="/images/html.png"
                      sx={{
                        transform: "scale(1.0)",
                        transition: "0.2s ease-in-out",
                        "&:hover": {
                          cursor: "pointer",
                          transform: "scale(1.15)",
                          transition: "0.2s ease-in-out",
                        },
                      }}
                    />
                    <Avatar
                      alt={"React.js"}
                      src="/images/react.png"
                      sx={{
                        transform: "scale(1.0)",
                        transition: "0.2s ease-in-out",
                        "&:hover": {
                          cursor: "pointer",
                          transform: "scale(1.15)",
                          transition: "0.2s ease-in-out",
                        },
                      }}
                    />
                    <Avatar
                      alt={"Node.js/Express"}
                      src="/images/nodejs.png"
                      sx={{
                        transform: "scale(1.0)",
                        transition: "0.2s ease-in-out",
                        "&:hover": {
                          cursor: "pointer",
                          transform: "scale(1.15)",
                          transition: "0.2s ease-in-out",
                        },
                      }}
                    />
                    <Avatar
                      alt={"Ruby on Rails"}
                      src="/images/ruby.png"
                      sx={{
                        transform: "scale(1.0)",
                        transition: "0.2s ease-in-out",
                        "&:hover": {
                          cursor: "pointer",
                          transform: "scale(1.15)",
                          transition: "0.2s ease-in-out",
                        },
                      }}
                      variant="square"
                    />
                  </Stack>
                </Box>
                <Box
                  sx={{ width: "33.33%" }}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  marginX={2}
                >
                  <Typography
                    component={"h1"}
                    sx={{
                      backgroundColor: "#0F3460",
                      borderRadius: 2,
                      padding: 1,
                      margin: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 25,
                      width: "100%",
                    }}
                  >
                    USERS STATS
                  </Typography>
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
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"75%"}
                    >
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
                          width: "100%",
                        }}
                      >
                        <Avatar
                          alt={"Admin role"}
                          src="/images/admin-white.png"
                          sx={{
                            transform: "scale(1.0)",
                            transition: "0.2s ease-in-out",
                            "&:hover": {
                              cursor: "pointer",
                              transform: "scale(1.15)",
                              transition: "0.2s ease-in-out",
                            },
                          }}
                        />
                        ADMINS
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"75%"}
                    >
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
                          width: "100%",
                        }}
                      >
                        <Avatar
                          alt={"Mentor role"}
                          src="/images/mentor-white.png"
                          sx={{
                            transform: "scale(1.0)",
                            transition: "0.2s ease-in-out",
                            "&:hover": {
                              cursor: "pointer",
                              transform: "scale(1.15)",
                              transition: "0.2s ease-in-out",
                            },
                          }}
                          variant="square"
                        />
                        MENTORS
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"75%"}
                    >
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
                          width: "100%",
                        }}
                      >
                        <Avatar
                          alt={"Student role"}
                          src="/images/student-white.png"
                          sx={{
                            transform: "scale(1.0)",
                            transition: "0.2s ease-in-out",
                            "&:hover": {
                              cursor: "pointer",
                              transform: "scale(1.15)",
                              transition: "0.2s ease-in-out",
                            },
                          }}
                          variant="square"
                        />
                        STUDENTS
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <Box
                  sx={{ width: "33.33%" }}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  marginX={2}
                >
                  <Typography
                    component={"h1"}
                    sx={{
                      backgroundColor: "#0F3460",
                      borderRadius: 2,
                      padding: 1,
                      margin: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 25,
                      width: "100%",
                    }}
                  >
                    COHORT STATS
                  </Typography>
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
                    <Avatar
                      alt={"Intro to Programming"}
                      src="/images/html.png"
                      sx={{
                        transform: "scale(1.0)",
                        transition: "0.2s ease-in-out",
                        "&:hover": {
                          cursor: "pointer",
                          transform: "scale(1.15)",
                          transition: "0.2s ease-in-out",
                        },
                      }}
                    />
                    <Avatar
                      alt={"React.js"}
                      src="/images/react.png"
                      sx={{
                        transform: "scale(1.0)",
                        transition: "0.2s ease-in-out",
                        "&:hover": {
                          cursor: "pointer",
                          transform: "scale(1.15)",
                          transition: "0.2s ease-in-out",
                        },
                      }}
                    />
                    <Avatar
                      alt={"Node.js/Express"}
                      src="/images/nodejs.png"
                      sx={{
                        transform: "scale(1.0)",
                        transition: "0.2s ease-in-out",
                        "&:hover": {
                          cursor: "pointer",
                          transform: "scale(1.15)",
                          transition: "0.2s ease-in-out",
                        },
                      }}
                    />
                    <Avatar
                      alt={"Ruby on Rails"}
                      src="/images/ruby.png"
                      sx={{
                        transform: "scale(1.0)",
                        transition: "0.2s ease-in-out",
                        "&:hover": {
                          cursor: "pointer",
                          transform: "scale(1.15)",
                          transition: "0.2s ease-in-out",
                        },
                      }}
                      variant="square"
                    />
                  </Stack>
                </Box>
              </AuthFormControl>
            </div>
          </Paper>
        </Container>
      )}
    </>
  );
};

export default AdminHome;
