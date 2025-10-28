import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer,FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // LocalStorage (No Expiry)
import authReducer from './slices/authSlice'; 
import taskReducer from './slices/taskSlice'; 


const persistConfig = {
  key: 'auth', 
  storage,     
  whitelist: [ 'isLoggedIn','user'], 
};

const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),    
  task: taskReducer,    
});
 


const store = configureStore({
  reducer: rootReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
  devTools: true,  
});


const persistor = persistStore(store);

export { store, persistor };
