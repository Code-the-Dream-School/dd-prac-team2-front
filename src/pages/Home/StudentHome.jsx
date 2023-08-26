import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [cohorts, setCohorts] = useState([]);

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

  return (
    <>
      <h1>Student Home</h1>
      {cohorts.map((c) => (
        <Box key={c._id}>
          <Typography>{c.name}</Typography>
        </Box>
      ))}
    </>
  );
};

export default StudentHome;
