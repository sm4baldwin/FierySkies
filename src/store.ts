import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice'
import userReducer from './features/user/userSlice'
import databaseReducer from './features/database/databaseSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    database: databaseReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
