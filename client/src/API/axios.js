import axios from 'axios';
import dotenv from 'dotenv';
const port = process.env.PORT;
export default axios.create({
    baseURL: 'http://localhost:3000' || port
});