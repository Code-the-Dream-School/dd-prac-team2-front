import { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useOutletContext } from "react-router-dom";
import AppDateTimePicker from "../../components/DateTimePicker/AppDateTimePicker";
import AppButton from "../../components/Button/AppButton";

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

  const handleChangeStartDate = (val) => {
    setStart(val);
    if (isOneHour) {
      const newEnd = val.add(1, "h");
      setEnd(newEnd);
    }
  };

  const handleChangeEndDate = (val) => {
    setEnd(val);
  };

  return (
    <Box sx={{ backgroundColor: "#fefefe", padding: 4 }}>
      <Typography component="h1" sx={{ fontSize: "2rem", marginBlockEnd: 1 }}>
        Create new session
      </Typography>
      <FormGroup>
        <AppDateTimePicker
          value={start}
          handleChange={handleChangeStartDate}
          label="Start"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isOneHour}
              color="error"
              onChange={(e) => setIsOneHour(e.target.checked)}
            />
          }
          label="1 hour session"
        ></FormControlLabel>
        {!isOneHour && (
          <AppDateTimePicker
            value={end}
            handleChange={handleChangeEndDate}
            label="End"
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldRepeat}
              color="error"
              onChange={(e) => setShouldRepeat(e.target.checked)}
            />
          }
          label="Repeat in the next weeks"
        ></FormControlLabel>
      </FormGroup>
      <AppButton
        text="Create session"
        type="button"
        handlerFunction={handleClick}
        width="auto"
      />
    </Box>
  );
}

export default CreateSession;
