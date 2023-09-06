import { DateTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useOutletContext } from "react-router-dom";

function CreateSession({ updateSessions }) {
  const navigate = useNavigate();
  const [start, setStart] = useState(dayjs(Date.now()));
  const [end, setEnd] = useState(dayjs(Date.now() + 60 * 60 * 1000));
  const [isOneHour, setIsOneHour] = useState(true);
  const [shouldRepeat, setShouldRepeat] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [cohort] = useOutletContext();

  useEffect(() => {
    if (!cohort) {
      navigate("/mentor");
    }
  }, []);

  const handleClick = async () => {
    const res = await axiosPrivate.post("/session", {
      start: start.toDate(),
      end: end.toDate(),
      type: "Mentor",
      link: "https://us02web.zoom.us/j/88579364493?pwd=loNkjaIa9sJA9slajs2jY5dz09",
      cohortId: cohort._id,
      multipleSessions: shouldRepeat,
    });

    updateSessions(res.data.session);
  };

  return (
    <Box sx={{ backgroundColor: "#fefefe", padding: 4 }}>
      <Typography sx={{ paddingBottom: "2rem", fontSize: 20 }}>
        Create new session
      </Typography>
      <FormGroup>
        <DateTimePicker
          value={start}
          onChange={(newVal) => setStart(newVal)}
          label="Start"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isOneHour}
              onChange={(e) => setIsOneHour(e.target.checked)}
            />
          }
          label="1 hour session"
        ></FormControlLabel>
        {!isOneHour && (
          <DateTimePicker
            value={end}
            onChange={(newVal) => setEnd(newVal)}
            label="End"
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldRepeat}
              onChange={(e) => setShouldRepeat(e.target.checked)}
            />
          }
          label="Repeat in the next weeks"
        ></FormControlLabel>
      </FormGroup>
      <Button variant="contained" onClick={handleClick}>
        Create session
      </Button>
    </Box>
  );
}

export default CreateSession;
