import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import  * as taskService from '../services/taskService';

export const createTask = createAsyncThunk('task/createTask', async (data, thunkAPI) => {
  try {
    const response = await taskService.createTask(data);
    return response
  } catch (err) {
     return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});

export const getTasks = createAsyncThunk('task/getTasks', async (_, thunkAPI) => {
  try {
    const response = await taskService.getTasks();
    return response;
  } catch (err) {
     return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});

export const updateTask = createAsyncThunk('task/updateTask', async (data, thunkAPI) => {
  try {
    const response = await taskService.updateTask(data);
    return response;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});

export const deleteTask = createAsyncThunk('task/deleteTask', async (id, thunkAPI) => {
  try {
    const response = await taskService.deleteTask(id);
    return response;
  } catch (err) {
     return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});

export const getTaskById = createAsyncThunk('task/getTaskById', async (id, thunkAPI) => {
  try {
    const response = await taskService.getTaskById(id);
    return response;
  } catch (err) {
     return thunkAPI.rejectWithValue(err?.response?.data?.error || err?.message);
  }
});


const taskSlice = createSlice({
  name: 'task',
  initialState: {
        error: null,
        tasks: []
  },
  reducers: {
  setTaskError: (state, action) => {
    state.error = action.payload
  },
  setTasks: (state, action) => {
    state.tasks = action.payload
  }
},
  extraReducers: (builder) => {
 
  },
});

export default taskSlice.reducer;
export const {setTaskError,setTasks} = taskSlice.actions;