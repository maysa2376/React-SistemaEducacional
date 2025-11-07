import axios from "axios";

const api = axios.create({
  baseURL: "https://api-estudo-educacao-1.onrender.com/",
});

export default api;
