import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmail, signUpWithEmail, signOut, getCurrentUser, getSession } from '../../supabase';

// Estado inicial simplificado
const initialState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  isSessionChecked: false, // Flag para saber si ya se verificó la sesión al menos una vez
  error: null,
  lastAction: null, // Último tipo de acción realizada (login, register, logout)
};

// Thunks para operaciones asincrónicas
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, redirectTo = '/dashboard' }, { rejectWithValue }) => {
    try {
      console.log('Iniciando proceso de login para:', email);
      
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        console.error('Error en signInWithEmail:', error);
        throw error;
      }
      
      console.log('Login exitoso:', data?.user?.email);
      
      // En producción, registrar la URL de redirección para depuración
      console.log('Redirección programada a:', redirectTo);
      
      return { data, redirectTo };
    } catch (error) {
      console.error('Error en loginUser thunk:', error);
      return rejectWithValue({
        message: error.message || 'Error al iniciar sesión', 
        code: error.code
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, metadata, redirectTo = '/dashboard' }, { rejectWithValue }) => {
    try {
      const { data, error } = await signUpWithEmail(email, password, metadata);
      if (error) throw error;
      
      // Si es confirmación por email, el usuario no estará autenticado inmediatamente
      const needsEmailConfirmation = !data.session;
      
      return { 
        data, 
        redirectTo,
        needsEmailConfirmation 
      };
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Error al registrar usuario', 
        code: error.code
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async ({ redirectTo = '/login' }, { rejectWithValue }) => {
    try {
      console.log('Iniciando cierre de sesión...');
      
      const { error } = await signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error);
        throw error;
      }
      
      console.log('Cierre de sesión exitoso, redireccionando a:', redirectTo);
      
      // Si estamos en el cliente, forzar una redirección
      if (typeof window !== 'undefined') {
        // Pequeño timeout para permitir que se complete la actualización del estado
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 100);
      }
      
      return { redirectTo };
    } catch (error) {
      console.error('Error en logoutUser thunk:', error);
      return rejectWithValue({
        message: error.message || 'Error al cerrar sesión', 
        code: error.code
      });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // Primero obtenemos la sesión
      const { data: sessionData, error: sessionError } = await getSession();
      
      if (sessionError) throw sessionError;
      
      // Si no hay sesión, no estamos autenticados
      if (!sessionData.session) {
        return { user: null, session: null };
      }
      
      // Si hay sesión, obtenemos los datos del usuario
      const { data, error } = await getCurrentUser();
      if (error) throw error;
      
      return { 
        user: data.user,
        session: sessionData.session
      };
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Error al obtener datos del usuario', 
        code: error.code
      });
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = !!action.payload.user;
      state.isSessionChecked = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      // Mantenemos isSessionChecked en true porque ya sabemos que no hay sesión
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLastAction: (state, action) => {
      state.lastAction = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.lastAction = 'login_pending';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.session = action.payload.data.session;
        state.isAuthenticated = true;
        state.isSessionChecked = true;
        state.error = null;
        state.lastAction = 'login_success';
        
        // Manejar la redirección aquí para asegurar que ocurra después de actualizar el estado
        const redirectTo = action.payload.redirectTo || '/dashboard';
        console.log("Login exitoso, aplicando redirección a:", redirectTo);
        
        // En un entorno de navegador, realizar la redirección
        if (typeof window !== 'undefined') {
          // Dar un pequeño tiempo para que la UI se actualice
          setTimeout(() => {
            window.location.href = redirectTo;
          }, 100);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.lastAction = 'login_failed';
      })
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.lastAction = 'register_pending';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Si necesita confirmación por email, no establecemos la sesión
        if (action.payload.needsEmailConfirmation) {
          state.lastAction = 'register_email_confirmation';
        } else {
          state.user = action.payload.data.user;
          state.session = action.payload.data.session;
          state.isAuthenticated = !!action.payload.data.user;
          state.lastAction = 'register_success';
        }
        
        state.isSessionChecked = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.lastAction = 'register_failed';
      })
      // Logout user
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.lastAction = 'logout_pending';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.session = null;
        state.userData = null;
        state.isAuthenticated = false;
        state.error = null;
        state.lastAction = 'logout_success';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.lastAction = 'logout_failed';
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.lastAction = 'session_check_pending';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = !!action.payload.user;
        state.isSessionChecked = true;
        state.error = null;
        state.lastAction = 'session_check_success';
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isSessionChecked = true; // Aún si falla, consideramos que intentamos verificar
        state.lastAction = 'session_check_failed';
      });
  },
});

export const { 
  setCredentials, 
  clearCredentials, 
  setError, 
  clearError, 
  setLastAction
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectSession = (state) => state.auth.session;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserId = (state) => state.auth.user?.id;
export const selectUserEmail = (state) => state.auth.user?.email;
export const selectUserMetadata = (state) => state.auth.user?.user_metadata;
export const selectIsSessionChecked = (state) => state.auth.isSessionChecked;
export const selectLastAuthAction = (state) => state.auth.lastAction;

export const selectIsLoginPending = (state) => 
  state.auth.isLoading && state.auth.lastAction === 'login_pending';

export const selectIsRegisterPending = (state) => 
  state.auth.isLoading && state.auth.lastAction === 'register_pending';

export default authSlice.reducer;