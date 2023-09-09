import axios from "axios";
import { BASE_URL } from "../config";

export default axios.create({
  baseURL: `${BASE_URL}/api/v1`,
});

export const axiosPrivate = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
