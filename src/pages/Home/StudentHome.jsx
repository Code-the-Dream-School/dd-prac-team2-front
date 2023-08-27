import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";

const StudentHome = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [cohorts, setCohorts] = useState([]);
  // const [selectedCohort, setSelectedCohort] = useOutletContext();

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const { data } = await axiosPrivate.get("/profile", {});
        console.log(data);
        setCohorts(data.profile.cohorts);
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
      <Paper sx={{ padding: "8px", marginBlock: "16px", fontSize: 18 }}>
        <Typography>Current Cohorts</Typography>
      </Paper>
      {cohorts.length === 0 ? (
        <Paper
          sx={{
            padding: "8px",
            marginBlock: "16px",
            fontSize: 16,
            backgroundColor: "#C84B31",
          }}
        >
          <Typography>Not enrolled in any cohorts</Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {cohorts.map((c) => (
            <Button
              variant="contained"
              key={c._id}
              sx={{ backgroundColor: "#C84B31" }}
              onClick={() => handleClick(c._id)}
            >
              {c.name}
            </Button>
          ))}
        </Box>
      )}
    </>
  );
};

export default StudentHome;
