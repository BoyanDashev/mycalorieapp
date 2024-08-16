import axios from "axios";


const apiBaseURL = process.env.REACT_APP_API_BASE_URL || "";
  console.log(apiBaseURL)
const axiousInstance = axios.create({
  baseURL: apiBaseURL,
});
export default axiousInstance;
