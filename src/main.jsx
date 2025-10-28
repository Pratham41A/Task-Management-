import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import {store, persistor} from './store'
import App from './App'
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//Handles Date Operations

createRoot(document.getElementById('root')).render(   
  <StrictMode>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
     <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
  <App />
  </PersistGate>
  </Provider>
      </LocalizationProvider>
  </StrictMode>
)