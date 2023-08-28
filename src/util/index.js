import axios from "axios";
import { format } from "date-fns";

const getCurrentYear = () => {
  const date = new Date().getFullYear();
  return date;
};

const formatDateAndTime = (dateTimeString) => {
  const options = {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(dateTimeString)
  );

  return formattedDate;
};

export { getCurrentYear, formatDateAndTime };
