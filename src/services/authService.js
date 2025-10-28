import axios from "axios";

const SERVER = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL + "/api/auth",
  withCredentials: true,
});

export async function registerUser(data) {
  const res = await SERVER.post("/register", data);
  return res.data.message;
}

export async function loginUser(data) {
  const res = await SERVER.post("/login", data);
  return res.data.message;
}

export async function logoutUser() {
  const res = await SERVER.delete("/logout");
  return res.data.message;
}

export async function refreshToken() {
  const res = await SERVER.post("/refresh");
  return res.data.message;
}

export async function getUsers(param) {
  const res = await SERVER.get(`/users/${param}`);
  return res.data.message;
}

export async function forgotPasswordOtp(data) {
  const res = await SERVER.post("/forgotPasswordOtp", data);
  return res.data.message;
}

export async function verifyForgotPasswordOtp(data) {
  const res = await SERVER.post("/verifyForgotPasswordOtp", data);
  return res.data.message;
}

export async function resetPassword(data) {
  const res = await SERVER.post("/resetPassword", data);
  return res.data.message;
}
