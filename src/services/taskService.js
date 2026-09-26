import axios from "axios";

const BACKEND_SERVER = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_SERVER_URL}/task`,
  withCredentials: true
});

export async function createTask (body) {
  await BACKEND_SERVER.post("", body);
};

export async function getTasks () {
  const { data: {message} = {}} = await BACKEND_SERVER.get("");
  return message;
};

export async function getSpecificTask (id) {
  const { data: {message} = {}} = await BACKEND_SERVER.get(`/${id}`);
  return message;
};

export async function updateTask (body) {
  await BACKEND_SERVER.patch("", body);
};

export async function deleteTask (id) {
  await BACKEND_SERVER.delete(`/${id}`);
};