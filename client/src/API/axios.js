import axios from "axios";


const apiBaseURL =
  process.env.REACT_APP_API_BASE_URL;
  console.log(apiBaseURL)
export default axios.create({
  baseURL: apiBaseURL,
});
