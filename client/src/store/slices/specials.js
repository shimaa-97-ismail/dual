// store/slices/specialsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axioInstance } from '../../api/config';

// جلب جميع التخصصات
export const fetchSpecials = createAsyncThunk(
  'specials/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axioInstance.get('schoolSpecial');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'فشل في جلب التخصصات');
    }
  }
);

// إضافة تخصص جديد
export const addSpecial = createAsyncThunk(
  'specials/add',
  async (specialData, { rejectWithValue }) => {
    try {
      const response = await axioInstance.post('schoolSpecial', specialData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'فشل في إضافة التخصص');
    }
  }
);

// تحديث تخصص
export const updateSpecial = createAsyncThunk(
  'specials/update',
  async ({ id, specialData }, { rejectWithValue }) => {
    try {
      const response = await axioInstance.put(`schoolSpecial/${id}`, specialData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'فشل في تحديث التخصص');
    }
  }
);

// حذف تخصص
export const deleteSpecial = createAsyncThunk(
  'specials/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axioInstance.delete(`schoolSpecial/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'فشل في حذف التخصص');
    }
  }
);

const specialsSlice = createSlice({
  name: 'specials',
  initialState: {
    specials: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // جلب التخصصات
      .addCase(fetchSpecials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecials.fulfilled, (state, action) => {
        state.loading = false;
        state.specials = action.payload;
      })
      .addCase(fetchSpecials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
    //   // إضافة تخصص
    //   .addCase(addSpecial.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(addSpecial.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.specials.push(action.payload);
    //   })
    //   .addCase(addSpecial.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })
      
      // تحديث تخصص
    //   .addCase(updateSpecial.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(updateSpecial.fulfilled, (state, action) => {
    //     state.loading = false;
    //     const index = state.specials.findIndex(spec => spec._id === action.payload._id);
    //     if (index !== -1) {
    //       state.specials[index] = action.payload;
    //     }
    //   })
    //   .addCase(updateSpecial.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })
      
    //   // حذف تخصص
    //   .addCase(deleteSpecial.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(deleteSpecial.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.specials = state.specials.filter(spec => spec._id !== action.payload);
    //   })
    //   .addCase(deleteSpecial.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });
  },
});

export const { clearError } = specialsSlice.actions;
export default specialsSlice.reducer;