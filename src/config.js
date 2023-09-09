export let BASE_URL;

if (process.env.NODE_ENV === "production") {
  BASE_URL = "https://prac-team2.onrender.com";
} else {
  BASE_URL = "http://localhost:8000";
}
