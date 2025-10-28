import axios from 'axios';

const SERVER = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL + "/api/task",
  withCredentials: true,
});


export const createTask = async (data) => {
  const res = await SERVER.post("/createTask", data);
  return res.data.message;
};

export const getTasks = async () => {
  const res = await SERVER.get("/getTasks");
  return res.data.message;
};

export const updateTask = async (data) => {
  const res = await SERVER.patch("/updateTask", data);
  return res.data.message;
};


export const deleteTask = async (id) => {
  const res = await SERVER.delete(`/deleteTask/${id}`);
  return res.data.message;
};

export const getTaskById = async (id) => {
  const res = await SERVER.get(`/getTaskById/${id}`);
  return res.data.message;
}