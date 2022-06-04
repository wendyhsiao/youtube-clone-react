import axios from 'axios';

const baseURL = 'https://www.googleapis.com/youtube/v3/';
const apiHelper = axios.create({
  baseURL
});

export {apiHelper};