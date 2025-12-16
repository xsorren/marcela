import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertiesReducer from './slices/propertySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertiesReducer,
    // Aquí puedes agregar más reducers según sea necesario
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 