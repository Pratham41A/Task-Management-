import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store.js';
import {App} from './App.jsx';
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </MantineProvider>
  </StrictMode>
);