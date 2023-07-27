import axios from "axios";

const getCurrentYear = () => {
  const date = (new Date()).getFullYear();
  return date;
}



export {getCurrentYear};