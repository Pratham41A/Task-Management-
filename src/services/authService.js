import axios from "axios";

const BACKEND_SERVER = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_SERVER_URL}/auth`,
  withCredentials: true,
});

export async function register (body) {
  await BACKEND_SERVER.post("/register", body);
};

export async function login (body) {
  await BACKEND_SERVER.post("/login", body);      
};

export async function logout () {
  await BACKEND_SERVER.delete("/logout");
};

export async function refresh () {
  await BACKEND_SERVER.post("/refresh");
};

export async function getCurrentUser () {
  const { data: {message} = {}} = await BACKEND_SERVER.get("/users/me");    
  return message;
};

export async function getUsers (body) {
  const { page, search } = body || {};
  const { data: {message} = {}} = await BACKEND_SERVER.get(`/users?page=${page}&search=${search}`);
  return message;
};