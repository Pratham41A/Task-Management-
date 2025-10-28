import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../services/authService";
import { set } from "react-hook-form";


export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res= await authService.loginUser(data);
    return res
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});

export const register = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    const res= await authService.registerUser(data);
    return res
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const res = await authService.logoutUser();
    return res
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});

export const getUserData = createAsyncThunk("auth/getUser", async (param, thunkAPI) => {
  try {
    const res = await authService.getUsers(param);
    return res
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});

export const refreshToken = createAsyncThunk("auth/refresh", async (_, thunkAPI) => {
  try {
    const res = await authService.refreshToken();
    return res
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});

export const forgotPasswordOtp = createAsyncThunk("auth/forgotPasswordOtp", async (data, thunkAPI) => {
  try {
    const res = await authService.forgotPasswordOtp(data);
    return res
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});

export const verifyForgotPasswordOtp = createAsyncThunk("auth/verifyForgotPasswordOtp", async (data, thunkAPI) => {
  try {
    const res = await authService.verifyForgotPasswordOtp(data);
    return res
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (data, thunkAPI) => {
  try {
    const res = await authService.resetPassword(data);
    return res
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});

const initialState = {
  user: null,
  isLoggedIn: null,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
setIsLoggedIn: (state, action) => {
  state.isLoggedIn = action.payload
},
setAuthError: (state, action) => {
  state.error = action.payload
  },
  setUser: (state, action) => {
    state.user = action.payload
  }
},
  extraReducers: (builder) => {
  

  },
});

export const {setIsLoggedIn,setAuthError,setUser  } = authSlice.actions;
export default authSlice.reducer;