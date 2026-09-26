import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {authReducer} from './slices/authSlice.js';
import {taskReducer} from './slices/taskSlice.js';

const rootReducer = combineReducers({
  auth: authReducer,
  task: taskReducer,
});

const store = configureStore({
  reducer: rootReducer
});

export { store };