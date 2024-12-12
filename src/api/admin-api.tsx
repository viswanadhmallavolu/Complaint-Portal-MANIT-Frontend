// Create the base axios instance of the admin api 
import axios from 'axios';
const admin_api = axios.create({
    baseURL: 'http://localhost:4000/',
    withCredentials: true
  });


export default admin_api;