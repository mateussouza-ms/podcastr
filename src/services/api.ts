import axios from "axios";

const url =
  process.env.VERCEL == "1"
    ? "https://podcastr-server.vercel.app/"
    : "http://localhost:3333/";

export const api = axios.create({
  baseURL: url,
});
