import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth/authSlice';
import {createLogger} from 'redux-logger';

const logger = createLogger({});

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
