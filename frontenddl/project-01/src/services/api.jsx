import axios from "axios";

const API = "http://localhost:8000";

export const startInterview = async (resume_text) => {
  const res = await axios.post(`${API}/start`, { resume_text });
  return res.data;
};

export const nextInterview = async (payload) => {
  const res = await axios.post(`${API}/next`, payload);
  return res.data;
};

export const endInterview = async () => {
  const res = await axios.post(`${API}/end`);
  return res.data;
};