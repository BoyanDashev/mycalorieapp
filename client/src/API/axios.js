
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiBaseURL =
  process.env.REACT_APP_API_BASE_URL ;
export default axios.create({
  baseURL: apiBaseURL,
});
