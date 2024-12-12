//Create the base axios isntance of the student api
import axios from 'axios';
const student_api = axios.create({
    baseURL: 'http://localhost:5000/',
    withCredentials: true
  });


export default student_api;