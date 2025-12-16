import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchProperties, 
  fetchPropertyById, 
  createProperty as createPropertyInDB, 
  updateProperty as updatePropertySupabase, 
  deleteProperty as deletePropertyFromDB,
  togglePropertyFeatured as togglePropertyFeaturedInDB
} from '@/utils/supabase/properties';
import { buildPropertyFilters, defaultPropertyFilters } from '@/utils/propertyFilters';
import { createSelector } from 'reselect';

// Estado inicial
const initialState = {
  properties: [],
  currentProperty: null,
  isLoading: false,
  error: null,
  filters: { ...defaultPropertyFilters }
};

/**
 * Thunk para obtener todas las propiedades con filtros aplicados
 */
export const fetchAllProperties = createAsyncThunk(
  'properties/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { data, error } = await fetchProperties(filters);
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Thunk para obtener una propiedad por su ID
 */
export const fetchProperty = createAsyncThunk(
  'properties/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data, error } = await fetchPropertyById(id);
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Thunk para crear una nueva propiedad
 */
export const createProperty = createAsyncThunk(
  'properties/create',
  async (propertyData, { rejectWithValue }) => {
    try {
      const result = await createPropertyInDB(propertyData);
      
      if (!result) {
        return rejectWithValue("No se pudo crear la propiedad. Verifica tu sesión.");
      }
      
      return result;
    } catch (error) {
      // Manejo específico para errores comunes
      if (error.message?.includes('foreign key constraint')) {
        return rejectWithValue(
          "Error de autenticación: No se pudo vincular la propiedad a tu cuenta."
        );
      }
      if (error.message?.includes('duplicate key')) {
        return rejectWithValue("Esta propiedad ya existe en el sistema.");
      }
      if (error.message?.includes('permission denied')) {
        return rejectWithValue("No tienes permiso para realizar esta acción.");
      }
      
      return rejectWithValue(error.message || "Error al crear la propiedad");
    }
  }
);

/**
 * Thunk para actualizar una propiedad existente
 */
export const updateProperty = createAsyncThunk(
  'properties/update',
  async ({ id, propertyData }, { rejectWithValue }) => {
    try {
      console.log("Redux updateProperty - Datos recibidos:", { id, propertyData });
      
      const result = await updatePropertySupabase({ id, propertyData });
      
      console.log("Redux updateProperty - Resultado:", result);
      
      if (!result) {
        return rejectWithValue("No se pudo actualizar la propiedad. Verifica tu sesión.");
      }
      
      return result;
    } catch (error) {
      console.error("Redux updateProperty - Error:", error);
      return rejectWithValue(error.message || "Error al actualizar la propiedad");
    }
  }
);

/**
 * Thunk para eliminar una propiedad
 */
export const deleteProperty = createAsyncThunk(
  'properties/delete',
  async (id, { rejectWithValue }) => {
    try {
      const { error } = await deletePropertyFromDB(id);
      if (error) throw error;
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



/**
 * Thunk para activar/desactivar el estado destacado de una propiedad
 */
export const togglePropertyFeatured = createAsyncThunk(
  'properties/toggleFeatured',
  async ({ id, currentFeaturedStatus }, { rejectWithValue }) => {
    try {
      const { data, error } = await togglePropertyFeaturedInDB(id, currentFeaturedStatus);
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        return rejectWithValue("No se pudo actualizar el estado destacado de la propiedad.");
      }
      
      return data[0];
    } catch (error) {
      return rejectWithValue(error.message || "Error al cambiar el estado destacado");
    }
  }
);

// Slice
const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    // Establecer filtros combinando los existentes con los nuevos
    setFilters: (state, action) => {
      // Centraliza la lógica de filtros usando el helper
      state.filters = buildPropertyFilters(action.payload);
    },
    
    // Limpiar todos los filtros excepto listing_type
    clearFilters: (state) => {
      const listingType = state.filters.listing_type || 'sale';
      state.filters = buildPropertyFilters({ listing_type: listingType });
    },
    
    // Limpiar error
    clearError: (state) => {
      state.error = null;
    },
    
    // Limpiar propiedad actual
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all properties
      .addCase(fetchAllProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload;
      })
      .addCase(fetchAllProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch single property
      .addCase(fetchProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProperty = action.payload;
      })
      .addCase(fetchProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create property
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties.unshift(action.payload);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update property
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.properties.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        state.currentProperty = action.payload;
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete property
      .addCase(deleteProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = state.properties.filter(p => p.id !== action.payload);
        if (state.currentProperty && state.currentProperty.id === action.payload) {
          state.currentProperty = null;
        }
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Toggle property featured status
      .addCase(togglePropertyFeatured.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(togglePropertyFeatured.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.properties.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        if (state.currentProperty && state.currentProperty.id === action.payload.id) {
          state.currentProperty = action.payload;
        }
      })
      .addCase(togglePropertyFeatured.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearFilters, clearError, clearCurrentProperty } = propertySlice.actions;

// Selectores básicos
export const selectAllProperties = (state) => state.properties.properties;
export const selectCurrentProperty = (state) => state.properties.currentProperty;
export const selectPropertyFilters = (state) => state.properties.filters;
export const selectPropertyIsLoading = (state) => state.properties.isLoading;
export const selectPropertyError = (state) => state.properties.error;

// Selectores derivados memoizados
export const selectFeaturedProperties = createSelector(
  [selectAllProperties],
  (properties) => properties.filter(property => property.is_featured)
);



export default propertySlice.reducer; 