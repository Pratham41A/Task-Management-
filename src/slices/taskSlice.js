import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {createTask as createTaskService, getTasks as getTasksService, getSpecificTask as getSpecificTaskService, updateTask as updateTaskService, deleteTask as deleteTaskService } from "../services/taskService.js";

export const createTask = createAsyncThunk(
  "task/create",
  async function (body, thunkAPI) {
    try {
      return await createTaskService(body);
    } catch (error) {
      const { response: { data: { error: serverError } = {} } = {} } = error || {};
      const {message: catchError} = error || {};
      const Error = serverError || catchError;

      return thunkAPI.rejectWithValue(Error);
    }
  }
);

export const getTasks = createAsyncThunk(
  "task/all",
  async function (_, thunkAPI) {
    try {
      return await getTasksService();
    } catch (error) {
      const { response: { data: { error: serverError } = {} } = {} } = error || {};
      const {message: catchError} = error || {};
      const Error = serverError || catchError;

      return thunkAPI.rejectWithValue(Error);
    }
  }
);

export const getSpecificTask = createAsyncThunk(
  "task/specific",
  async function (id, thunkAPI) {
    try {
      return await getSpecificTaskService(id);
    } catch (error) {
      const { response: { data: { error: serverError } = {} } = {} } = error || {};
      const {message: catchError} = error || {};
      const Error = serverError || catchError;

      return thunkAPI.rejectWithValue(Error);
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/update",
  async function (body, thunkAPI) {
    try {
      return await updateTaskService(body);
    } catch (error) {
      const { response: { data: { error: serverError } = {} } = {} } = error || {};
      const {message: catchError} = error || {};
      const Error = serverError || catchError;

      return thunkAPI.rejectWithValue(Error);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/delete",
  async function (id, thunkAPI) {
    try {
      return await deleteTaskService(id);
    } catch (error) {
      const { response: { data: { error: serverError } = {} } = {} } = error || {};
      const {message: catchError} = error || {};
      const Error = serverError || catchError;

      return thunkAPI.rejectWithValue(Error);
    }
  }
);

const initialState = {
  tasks: [],
  task: {},
  error: null,
  isLoading: true,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  extraReducers: function (builder) {
    builder

      .addCase(createTask.pending, function (state) {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, function (state) {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createTask.rejected, function (state, action) {
        const {payload} = action || {};
        state.isLoading = false;
        state.error = payload;
      })

      .addCase(getTasks.pending, function (state) {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, function (state, action) {
        const {payload} = action || {};
        state.isLoading = false;
        state.error = null;
        state.tasks = payload;
      })
      .addCase(getTasks.rejected, function (state, action) {
        const {payload} = action || {};
        state.isLoading = false;
        state.error = payload;
      })

      .addCase(getSpecificTask.pending, function (state) {
        state.isLoading = true;
      })
      .addCase(getSpecificTask.fulfilled, function (state, action) {
        const {payload} = action || {};
        state.isLoading = false;
        state.error = null;
        state.task = payload;
      })
      .addCase(getSpecificTask.rejected, function (state, action) {
        const {payload} = action || {};
        state.isLoading = false;
        state.error = payload;
      })

      .addCase(updateTask.pending, function (state) {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, function (state) {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateTask.rejected, function (state, action) {
        const {payload} = action || {};
        state.isLoading = false;
        state.error = payload;
      })

      .addCase(deleteTask.pending, function (state) {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, function (state) {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteTask.rejected, function (state, action) {
        const {payload} = action || {};
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const {reducer: taskReducer} = taskSlice