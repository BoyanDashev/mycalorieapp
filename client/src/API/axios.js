
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiBaseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
export default axios.create({
  baseURL: apiBaseURL,
});
