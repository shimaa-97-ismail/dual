import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {axioInstance} from '../../api/config';


export const fetchTrainningPlaces = createAsyncThunk(
  'trainningPlaces/fetchTrainningPlaces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axioInstance.get('trainning-place');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTrainningPlace = createAsyncThunk(
  'trainningPlaces/createTrainningPlace',
  async (trainningPlaceData, { rejectWithValue }) => {
    try {
      const response = await axioInstance.post('trainning-place', trainningPlaceData);
     console.log(response.data);
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTrainningPlace = createAsyncThunk(
  'trainningPlaces/updateTrainningPlace',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axioInstance.put(`trainning-place/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTrainningPlace = createAsyncThunk(
  'trainningPlaces/deleteTrainningPlace',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axioInstance.delete(`trainning-place/${id}`);
      return { id, message: response.data?.message || 'تم الحذف بنجاح' };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  trainningPlaces: [],
  currentTrainningPlace: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  operationStatus: {
    create: 'idle',
    update: 'idle',
    delete: 'idle',
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

const trainningPlaceSlice = createSlice({
  name: 'trainningPlaces',
  initialState,
  reducers: {
    // إعادة تعيين الحالة
    resetOperationStatus: (state) => {
      state.operationStatus = {
        create: 'idle',
        update: 'idle',
        delete: 'idle',
      };
      state.error = null;
    },

      setCurrentTrainningPlace: (state, action) => {
      state.currentTrainningPlace = action.payload;
    },
    
    // مسح المكان الحالي
    clearCurrentTrainningPlace: (state) => {
      state.currentTrainningPlace = null;
    },
       // تحديث الحالة المحلية بدون الاتصال بالخادم
    updateTrainningPlaceInState: (state, action) => {
      const index = state.trainningPlaces.findIndex(
        place => place._id === action.payload._id
      );
      if (index !== -1) {
        state.trainningPlaces[index] = action.payload;
      }
    },
    // إضافة مكان جديد محليًا
    addTrainningPlaceToState: (state, action) => {
      state.trainningPlaces.unshift(action.payload);
    },
    
    // حذف مكان محليًا
    removeTrainningPlaceFromState: (state, action) => {
      state.trainningPlaces = state.trainningPlaces.filter(
        place => place._id !== action.payload
      );
    },
        // إعادة تعيين الحالة بالكامل
    resetTrainningPlaceState: () => initialState,
  },
  
  extraReducers: (builder) => {
    builder
      // ========== جلب جميع أماكن التدريب ==========
      .addCase(fetchTrainningPlaces.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })  .addCase(fetchTrainningPlaces.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainningPlaces = action.payload.data || action.payload;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchTrainningPlaces.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'فشل في جلب أماكن التدريب';
      })
      
       .addCase(createTrainningPlace.pending, (state) => {
        state.operationStatus.create = 'loading';
        state.error = null;
      })
      .addCase(createTrainningPlace.fulfilled, (state, action) => {
        state.operationStatus.create = 'succeeded';
        state.trainningPlaces.unshift(action.payload);
      })
      .addCase(createTrainningPlace.rejected, (state, action) => {
        state.operationStatus.create = 'failed';
        state.error = action.payload || 'فشل في إنشاء مكان التدريب';
      })
       .addCase(updateTrainningPlace.pending, (state) => {
        state.operationStatus.update = 'loading';
        state.error = null;
      })
      .addCase(updateTrainningPlace.fulfilled, (state, action) => {
        state.operationStatus.update = 'succeeded';
        const updatedPlace = action.payload;
        const index = state.trainningPlaces.findIndex(
          place => place._id === updatedPlace._id
        );
        
        if (index !== -1) {
          state.trainningPlaces[index] = updatedPlace;
        }
        
        // تحديث المكان الحالي إذا كان هو المحدث
        if (state.currentTrainningPlace && 
            state.currentTrainningPlace._id === updatedPlace._id) {
          state.currentTrainningPlace = updatedPlace;
        }
      })
      .addCase(updateTrainningPlace.rejected, (state, action) => {
        state.operationStatus.update = 'failed';
        state.error = action.payload || 'فشل في تحديث مكان التدريب';
      })
       .addCase(deleteTrainningPlace.pending, (state) => {
        state.operationStatus.delete = 'loading';
        state.error = null;
      })
      .addCase(deleteTrainningPlace.fulfilled, (state, action) => {
        state.operationStatus.delete = 'succeeded';
        state.trainningPlaces = state.trainningPlaces.filter(
          place => place._id !== action.payload.id
        );
        
        // مسح المكان الحالي إذا كان هو المحذوف
        if (state.currentTrainningPlace && 
            state.currentTrainningPlace._id === action.payload.id) {
          state.currentTrainningPlace = null;
        }
      })
      .addCase(deleteTrainningPlace.rejected, (state, action) => {
        state.operationStatus.delete = 'failed';
        state.error = action.payload || 'فشل في حذف مكان التدريب';
      });
  },
});

export const {
  resetOperationStatus,
  setCurrentTrainningPlace,
  clearCurrentTrainningPlace,
  updateTrainningPlaceInState,
  addTrainningPlaceToState,
  removeTrainningPlaceFromState,
  resetTrainningPlaceState,
} = trainningPlaceSlice.actions;

export default trainningPlaceSlice.reducer;
