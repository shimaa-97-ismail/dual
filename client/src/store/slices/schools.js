// import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
// import { schoolApi } from "@/api/config";

// export const fetchSchools = createAsyncThunk(
//   'schools/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await schoolApi.getAll();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data|| 'فشل في جلب المدارس');
//     }
//   }
// );

// export const addSchool = createAsyncThunk(
//   'school/add',
//   async (schoolData, { rejectWithValue }) => {
//     try {
//       console.log("schoolData",schoolData);

//       const response = await schoolApi.create(schoolData);

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data|| 'فشل في إضافة المدرسة');
//     }
//   }
// );

// export const updateSchool = createAsyncThunk(
//   'schools/update',
//   async ({ id, schoolData }, { rejectWithValue }) => {
//     try {
//       const response = await schoolApi.update(id, schoolData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data|| 'فشل في تحديث المدرسة');
//     }
//   }
// );

// export const deleteSchool = createAsyncThunk(
//   'schools/delete',
//   async (id, { rejectWithValue }) => {
//     try {
//       await schoolApi.delete(id);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response.data|| 'فشل في حذف المدرسة');
//     }
//   }
// );
// const initialState = {
//   schools: [],
//   departments: [],
//   specials: [],
//   loading: {
//     fetchSchools: false,
//     fetchDepartments: false,
//     fetchSpecials: false,
//     addSchool: false,
//     updateSchool: {},
//     deleteSchool: {}
//   },
//   errors: {
//     fetchSchools: null,
//     fetchDepartments: null,
//     fetchSpecials: null,
//     addSchool: null,
//     updateSchool: {},
//     deleteSchool: {}
//   },
//   pagination: {
//     page: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 10
//   },
//   filters: {
//     type: '',
//     department: '',
//     search: ''
//   }
// };
// const schoolSlice = createSlice({
//   name: 'schools',
//   initialState: {
//     schools: [],
//     currentSchool: null,
//     loading: false,
//     error: null,
//   modalOpen: false,
//     modalMode: 'add'
//   },
//   reducers: {
//     setCurrentSchool: (state, action) => {
//       state.currentSchool = action.payload;
//     },
//      openAddModal: (state) => {
//       state.modalOpen = true;
//       state.modalMode = 'add';
//       state.currentSchool = null;
//     },
//     openEditModal: (state, action) => {
//       state.modalOpen = true;
//       state.modalMode = 'edit';
//       state.currentSchool = action.payload;
//     },
//     closeModal: (state) => {
//       state.modalOpen = false;
//       state.currentSchool = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//     extraReducers: (builder) => {
//     builder
//     .addCase(fetchSchools.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schools = action.payload;
//       })
//       .addCase(fetchSchools.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//        .addCase(addSchool.fulfilled, (state, action) => {

//         state.loading = false;
//         state.schools.push(action.payload);
//         state.modalOpen = false;
//       })
//       .addCase(addSchool.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(updateSchool.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.schools.findIndex(s => s._id === action.payload._id);
//         if (index !== -1) {
//           state.schools[index] = action.payload;
//         }
//         state.modalOpen = false;
//         state.currentSchool = null;
//       })
//       .addCase(updateSchool.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(deleteSchool.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schools = state.schools.filter(s => s._id !== action.payload);
//       })
//       .addCase(deleteSchool.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addMatcher(
//         (action) => action.type.endsWith('/pending') && action.type.includes('schools'),
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       )

//   },
// });

// export const {
//   setCurrentSchool,
//   openAddModal,
//   openEditModal,
//   closeModal,
//   clearError
// } = schoolSlice.actions;
// export default schoolSlice.reducer;

// store/slices/schoolSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioInstance } from "../../api/config";

// الحالة الابتدائية
const initialState = {
  schools: [],
  departments: [],
  specials: [],
  loading: {
    fetchSchools: false,
    fetchDepartments: false,
    fetchSpecials: false,
    addSchool: false,
    updateSchool: {},
    deleteSchool: {},
  },
  errors: {
    fetchSchools: null,
    fetchDepartments: null,
    fetchSpecials: null,
    addSchool: null,
    updateSchool: {},
    deleteSchool: {},
  },
  pagination: {
    page: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  filters: {
    type: "",
    department: "",
    search: "",
  },
};

// Async Thunks لجميع العمليات

// 1. جلب جميع المدارس
export const fetchSchools = createAsyncThunk(
  "schools/fetchSchools",
  async (params = {}, { rejectWithValue }) => {
    try {
      //   const { page = 1, limit = 10, type, department, search } = params;
      //   let url = `/school?page=${page}&limit=${limit}`;

      // if (type) url += `&type=${type}`;
      // if (department) url += `&departement=${department}`;
      // if (search) url += `&search=${search}`;

      const response = await axioInstance.get("school");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 2. إضافة مدرسة جديدة
export const addSchool = createAsyncThunk(
  "schools/addSchool",
  async (schoolData, { rejectWithValue }) => {
    try {
      console.log("api redux", schoolData);

      const response = await axioInstance.post("school", { schoolData });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 3. تحديث مدرسة
export const updateSchool = createAsyncThunk(
  "schools/updateSchool",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axioInstance.put(`school/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 4. حذف مدرسة
export const deleteSchool = createAsyncThunk(
  "schools/deleteSchool",
  async (id, { rejectWithValue }) => {
    try {
      await axioInstance.delete(`school/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getSchoolByDepatment= createAsyncThunk(
  "schools/getSchoolByDepatment",
  async (departementId, { rejectWithValue }) => {
    try {
      const response = await axioInstance.get(`school/by-department/${departementId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 5. جلب الأقسام
export const fetchDepartments = createAsyncThunk(
  "schools/fetchDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axioInstance.get("departement");
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 6. جلب التخصصات
export const fetchSpecials = createAsyncThunk(
  "schools/fetchSpecials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axioInstance.get("schoolSpecial");
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const schoolSlice = createSlice({
  name: "schools",
  initialState,
  reducers: {
    // إعادة تعيين حالات التحميل
    resetLoading: (state) => {
      state.loading.addSchool = false;
      state.loading.updateSchool = {};
      state.loading.deleteSchool = {};
    },

    // مسح الأخطاء
    clearError: (state, action) => {
      const { actionType, id } = action.payload;
      if (id && state.errors[actionType]) {
        delete state.errors[actionType][id];
      } else if (state.errors[actionType]) {
        state.errors[actionType] = null;
      }
    },

    // تحديث الفلاتر
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // إعادة تعيين الفلاتر
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // تحديث الترقيم
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- جلب المدارس ----------
      .addCase(fetchSchools.pending, (state) => {
        state.loading.fetchSchools = true;
        state.errors.fetchSchools = null;
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.loading.fetchSchools = false;
        state.schools = action.payload.schools || action.payload;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading.fetchSchools = false;
        state.errors.fetchSchools = action.payload;
      })

      // ---------- إضافة مدرسة ----------
      .addCase(addSchool.pending, (state) => {
        state.loading.addSchool = true;
        state.errors.addSchool = null;
      })
      .addCase(addSchool.fulfilled, (state, action) => {
        state.loading.addSchool = false;
        state.schools.unshift(action.payload); // إضافة في البداية
      })
      .addCase(addSchool.rejected, (state, action) => {
        state.loading.addSchool = false;
        state.errors.addSchool = action.payload;
      })

      // ---------- تحديث مدرسة ----------
      .addCase(updateSchool.pending, (state, action) => {
        const id = action.meta.arg.id;
        state.loading.updateSchool[id] = true;
        delete state.errors.updateSchool[id];
        state.currentUpdatedSchool = null;
      })
      .addCase(updateSchool.fulfilled, (state, action) => {
        const id = action.payload._id;
        const index = state.schools.findIndex((s) => s._id === id);
        if (index !== -1) {
          state.schools = state.schools.map((school, i) =>
            i === index ? action.payload : school
          );
        } else {
          state.schools.push(action.payload);
        }
        state.currentUpdatedSchool = action.payload;
        state.loading.updateSchool[id] = false;
        state.lastUpdateTimestamp = Date.now();
        state.updateStatus = "succeeded";
      })
      .addCase(updateSchool.rejected, (state, action) => {
        const id = action.meta.arg.id;
        state.loading.updateSchool[id] = false;
        state.errors.updateSchool[id] = action.payload;
        state.updateStatus = "failed";
        state.errors = action.payload;
      })

      // ---------- حذف مدرسة ----------
      .addCase(deleteSchool.pending, (state, action) => {
        const id = action.meta.arg;
        state.loading.deleteSchool[id] = true;
        delete state.errors.deleteSchool[id];
      })
      .addCase(deleteSchool.fulfilled, (state, action) => {
        const id = action.payload;
        state.schools = state.schools.filter((s) => s._id !== id);
        delete state.loading.deleteSchool[id];
      })
      .addCase(deleteSchool.rejected, (state, action) => {
        const id = action.meta.arg;
        state.loading.deleteSchool[id] = false;
        state.errors.deleteSchool[id] = action.payload;
      })
      .addCase(getSchoolByDepatment.pending, (state) => {
        state.errors.fetchSchools = null;
      })
      .addCase(getSchoolByDepatment.fulfilled, (state, action) => {
        state.schools = action.payload;
      })
      .addCase(getSchoolByDepatment.rejected, (state, action) => {
        state.errors.fetchSchools = action.payload;
      })

      // ---------- جلب الأقسام ----------
      .addCase(fetchDepartments.pending, (state) => {
        state.loading.fetchDepartments = true;
        state.errors.fetchDepartments = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading.fetchDepartments = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading.fetchDepartments = false;
        state.errors.fetchDepartments = action.payload;
      })

      // ---------- جلب التخصصات ----------
      .addCase(fetchSpecials.pending, (state) => {
        state.loading.fetchSpecials = true;
        state.errors.fetchSpecials = null;
      })
      .addCase(fetchSpecials.fulfilled, (state, action) => {
        state.loading.fetchSpecials = false;
        state.specials = action.payload;
      })
      .addCase(fetchSpecials.rejected, (state, action) => {
        state.loading.fetchSpecials = false;
        state.errors.fetchSpecials = action.payload;
      });
  },
});

export const { resetLoading, clearError, setFilters, resetFilters, setPage } =
  schoolSlice.actions;

export default schoolSlice.reducer;
