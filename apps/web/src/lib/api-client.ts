import axios from "axios";
import { env } from "@judge_system/env/web";

export const api = axios.create({
  baseURL: env.VITE_SERVER_URL,
  withCredentials: true,
});
