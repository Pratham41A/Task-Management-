import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {getCurrentUser as getCurrentUserService, login as loginService, logout as logoutService, register as registerService, refresh as refreshService, getUsers as getUsersService} from "../services/authService.js";

  export const login = createAsyncThunk(
    "auth/login",
    async function (body, thunkAPI) {
      try {
        return await loginService(body);
      } catch (error) {
        const { response: { data: { error: serverError } = {} } = {} } = error || {};
        const {message: catchError} = error || {};
        const Error = serverError || catchError;
        return thunkAPI.rejectWithValue(
          Error
        );
      }
    }
  );

export const register = createAsyncThunk(
  "auth/register",
  async function (body, thunkAPI) {
    try {
      return await registerService(body);
    } catch (error) {
      const { response: { data: { error: serverError } = {} } = {} } = error || {};
      const {message: catchError} = error || {};
      const Error = serverError || catchError;
      return thunkAPI.rejectWithValue(
        Error
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async function (_, thunkAPI) {
    try {
      return await logoutService();
    } catch (error) {
      const { response: { data: { error: serverError } = {} } = {} } = error || {};
      const {message: catchError} = error || {};
      const Error = serverError || catchError;
      return thunkAPI.rejectWithValue(
        Error
      );
    }
  }
);

export const refresh = createAsyncThunk(
  "auth/refresh",
  async function (_, thunkAPI) {
    try {
      return await refreshService();
    } catch (error) {
      const { response: { data: { error: serverError } = {} } = {} } = error || {};
      const {message: catchError} = error || {};
      const Error = serverError || catchError;
      return thunkAPI.rejectWithValue(
        Error
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/users/me",
  async function (_, thunkAPI) {
    try {
      return await getCurrentUserService();
    } catch (error) {
      const { response: { data: { error: serverError } = {} } = {} } = error || {};
      const {message: catchError} = error || {};
      const Error = serverError || catchError;
      return thunkAPI.rejectWithValue(
        Error
      );
    }
  }
);

export const getUsers = createAsyncThunk(
  "auth/users",
  async function (body, thunkAPI) {
    try {
      return await getUsersService(body);
    } catch (error) {
      const { response: { data: { error: serverError } = {} } = {} } = error || {};
      const {message: catchError} = error || {};
      const Error = serverError || catchError;

      return thunkAPI.rejectWithValue(Error);
    }
  }
);

const initialState = {
  user: {},
  error: null,
  isLoggedIn: false,
  isLoading: true,
  isAuthenticationChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
 extraReducers: function (builder) {
  builder
    .addCase(login.pending, function (state) {
      state.isLoading = true;
    })
    .addCase(login.fulfilled, function (state) {
      state.isLoading = false;
      state.error = null
      state.isLoggedIn = true;
    })
    .addCase(login.rejected, function (state, action) {
      const { payload } = action || {};
      state.isLoading = false;
      state.error = payload;
    })

    .addCase(register.pending, function (state) {
      state.isLoading = true;
    })
    .addCase(register.fulfilled, function (state) {
      state.isLoading = false;
      state.error = null
    })
    .addCase(register.rejected, function (state, action) {
      const { payload } = action  || {};
      state.isLoading = false;
      state.error = payload;
    })

    .addCase(logout.pending, function (state) {
      state.isLoading = true;
    })
    .addCase(logout.fulfilled, function (state) {
      state.isLoading = false;
      state.user = {};
      state.isLoggedIn = false;
      state.error = null
    })
    .addCase(logout.rejected, function (state, action) {
      const { payload } = action || {};
      state.isLoading = false;
      state.error = payload;
    })
    
    .addCase(refresh.pending, function (state) {
      state.isLoading = true;
    })
    .addCase(refresh.fulfilled, function (state) {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.error = null;
      state.isAuthenticationChecked = true;
    })
    .addCase(refresh.rejected, function (state,action) {
      const { payload } = action || {};
      state.isLoading = false;
      state.isAuthenticationChecked = true;
      state.error = payload;
    })

    .addCase(getCurrentUser.pending, function (state) {
      state.isLoading = true;
    })
    .addCase(getCurrentUser.fulfilled, function (state, action) {
      const {payload} = action || {};
      state.isLoading = false;
      state.error = null;
      state.user = payload;
    })
    .addCase(getCurrentUser.rejected, function (state, action) {
      const {payload}=action || {};
      state.isLoading = false;
      state.error = payload;
    })

    .addCase(getUsers.pending, function (state) {
      state.isLoading = true;
    })
    .addCase(getUsers.fulfilled, function (state) {
      state.isLoading = false;
      state.error = null;
    })
    .addCase(getUsers.rejected, function (state, action) {
      const { payload } = action || {};
      state.isLoading = false;
      state.error = payload;
    });
  }
});

export const {reducer: authReducer} = authSlice || {};