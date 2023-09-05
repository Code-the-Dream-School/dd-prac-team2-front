import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Box, Button, Paper, Typography } from "@mui/material";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

const MentorHome = () => {
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useOutletContext();

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
      } catch (err) {
        console.log(err);
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

export default MentorHome;
