import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-estudo-educacao-1.onrender.com/",
});
