// // store/slices/departmentsSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { axioInstance } from '../../api/config';

// // جلب جميع الإدارات
// export const fetchDepartments = createAsyncThunk(
//   'departments/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axioInstance.get('departement');
//       console.log(response);
      
//       return response.data.data
//     } catch (error) {
//       console.log(error.response?.data?.message);
      
//       return rejectWithValue(error.response?.data?.message || 'فشل في جلب الإدارات');
//     }
//   }
// );

// // إضافة إدارة جديدة
// export const addDepartment = createAsyncThunk(
//   'departments/add',
//   async (departmentData, { rejectWithValue }) => {
//     try {
//       const response = await axioInstance.post('departement', departmentData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'فشل في إضافة الإدارة');
//     }
//   }
// );

// // تحديث إدارة
// export const updateDepartment = createAsyncThunk(
//   'departments/update',
//   async ({ id, departmentData }, { rejectWithValue }) => {
//     try {
//       const response = await axioInstance.put(`departement/${id}`, departmentData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'فشل في تحديث الإدارة');
//     }
//   }
// );

// // حذف إدارة
// export const deleteDepartment = createAsyncThunk(
//   'departments/delete',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response =await axioInstance.delete(`departement/${id}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'فشل في حذف الإدارة');
//     }
//   }
// );

// const departmentsSlice = createSlice({
//   name: 'departments',
//   initialState: {
//     departments: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // جلب الإدارات
//       .addCase(fetchDepartments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchDepartments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.departments = action.payload;
//       })
//       .addCase(fetchDepartments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // إضافة إدارة
//       .addCase(addDepartment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addDepartment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.departments.push(action.payload);
//       })
//       .addCase(addDepartment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // تحديث إدارة
//       .addCase(updateDepartment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateDepartment.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.departments.findIndex(dept => dept._id === action.payload._id);
//         if (index !== -1) {
//           state.departments[index] = action.payload;
//         }
//       })
//       .addCase(updateDepartment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // حذف إدارة
//       .addCase(deleteDepartment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteDepartment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.departments = state.departments.filter(dept => dept._id !== action.payload);
//       })
//       .addCase(deleteDepartment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError } = departmentsSlice.actions;
// export default departmentsSlice.reducer;




// // src/store/slices/departmentsSlice.js (محدث)
// // import { createSlice } from '@reduxjs/toolkit';

// // const departmentsSlice = createSlice({
// //   name: 'departments',
// //   initialState: {
// //     departments: [],
// //     loading: false,
// //     error: null,
// //     // يمكن إضافة المزيد من البيانات
// //     selectedDepartment: null,
// //     cacheTimestamp: null,
// //   },
// //   reducers: {
// //     clearError: (state) => {
// //       state.error = null;
// //     },
// //     setDepartments: (state, action) => {
// //       state.departments = action.payload;
// //       state.cacheTimestamp = Date.now();
// //     },
// //     selectDepartment: (state, action) => {
// //       state.selectedDepartment = action.payload;
// //     },
// //     clearCache: (state) => {
// //       state.departments = [];
// //       state.cacheTimestamp = null;
// //     },
// //   },
// // });

// // export const { clearError, setDepartments, selectDepartment, clearCache } = departmentsSlice.actions;
// // export default departmentsSlice.reducer;



// store/slices/departmentsSlice.js
import { createSlice } from '@reduxjs/toolkit';

// نحذف جميع createAsyncThunk لأن TanStack Query سيتولى العمليات الغير متزامنة

const departmentsSlice = createSlice({
  name: 'departments',
  initialState: {
    // ❌ نزيل departments لأن TanStack Query سيتولى التخزين المؤقت
    // departments: [], 
    
    // ✅ نحتفظ فقط بحالة الواجهة (UI State)
    selectedDepartment: null,    // الإدارة المحددة حاليًا
    filters: {                   // عوامل التصفية
      search: '',
      sortBy: 'name',
      sortOrder: 'asc',
    },
    ui: {                       // حالة واجهة المستخدم
      isAdding: false,
      isEditing: false,
      isDeleting: false,
      formData: {},             // بيانات النموذج الحالية
    },
    error: null,               // أخطاء الواجهة فقط
    lastUpdated: null,         // وقت آخر تحديث
  },
  reducers: {
    // ✅ إجراءات خاصة بالواجهة فقط
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {
        search: '',
        sortBy: 'name',
        sortOrder: 'asc',
      };
    },
    
    // ✅ إدارة حالة النماذج
    setFormData: (state, action) => {
      state.ui.formData = action.payload;
    },
    
    clearFormData: (state) => {
      state.ui.formData = {};
    },
    
    // ✅ إدارة حالة UI
    setIsAdding: (state, action) => {
      state.ui.isAdding = action.payload;
    },
    
    setIsEditing: (state, action) => {
      state.ui.isEditing = action.payload;
    },
    
    setIsDeleting: (state, action) => {
      state.ui.isDeleting = action.payload;
    },
    
    // ✅ معالجة الأخطاء
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // ✅ تحديث وقت التحديث
    setLastUpdated: (state) => {
      state.lastUpdated = Date.now();
    },
    
    // ✅ قد نترك إجراءات لتحديث البيانات إذا أردنا
    updateDepartmentsList: (state, action) => {
      // يمكن استخدامها إذا أردنا تحديث Redux ببيانات من TanStack Query
      // ولكن الأفضل ترك التخزين المؤقت لـ TanStack Query
    },
  },
});

// ✅ تصدير جميع الإجراءات
export const {
  setSelectedDepartment,
  setFilters,
  clearFilters,
  setFormData,
  clearFormData,
  setIsAdding,
  setIsEditing,
  setIsDeleting,
  setError,
  clearError,
  setLastUpdated,
} = departmentsSlice.actions;

// ✅ التصدير الافتراضي للـ reducer
export default departmentsSlice.reducer;