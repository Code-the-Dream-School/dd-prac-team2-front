import { DateTimePicker } from "@mui/x-date-pickers";

function AppDateTimePicker({ value, handleChange, label }) {
  const style = {
    width: "100%",
    label: {
      fontWeight: "bold",
      color: "black",
      "&.Mui-focused": {
        color: "black",
      },
    },
    "& fieldset": {
      borderColor: "#0F3460",
      borderWidth: 2,
      transition: "ease-in-out 0.2s",
    },
    "& .Mui-fcosued fieldset.MuiOutlinedInput-notchedOutLine": {
      borderColor: "#C84B31",
      borderWidth: 2,
      transition: "ease-in-out 0.2s",
    },
    "&:hover": {
      "&& fieldset": {
        border: "2px solid #C84B31",
        transition: "ease-in-out 0.2s",
      },
    },
    "&, & .MuiSvgIcon-root": {
      color: "black",
      fontWeight: "bold",
    },
    "& .MuiOutlinedInput-root": {
      fontWeight: "bold",
      color: "black",
      "&.Mui-focused fieldset": {
        borderColor: "#C84B31",
      },
    },
  };

  const slotProps = {
    leftArrowIcon: {
      sx: {
        fontWeight: "bold",
        color: "#C84B31",
      },
    },
    rightArrowIcon: {
      sx: {
        fontWeight: "bold",
        color: "#C84B31",
      },
    },
    day: {
      sx: {
        "&.MuiPickersDay-root.MuiPickersDay-today": {
          color: "white",
          backgroundColor: "#1A1A2E",
          border: 0,
        },
        "&.MuiPickersDay-root.Mui-selected": {
          backgroundColor: "#C84B31",
        },
        "&.MuiPickersDay-root:hover": {
          color: "white",
          backgroundColor: "#C84B31",
        },
      },
    },
    year: {
      sx: {
        color: "red",
      },
    },
    textField: {
      required: true,
    },
  };

  return (
    <DateTimePicker
      sx={style}
      slotProps={slotProps}
      value={value}
      onChange={(newVal) => handleChange(newVal)}
      label={label}
    />
  );
}

export default AppDateTimePicker;
