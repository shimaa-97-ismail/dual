import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axioInstance } from '../../api/config';


export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async () => {
    const response = await axioInstance.get('/api/students');
    return response.data;
  }
);

// إضافة طالب جديد
export const addStudent = createAsyncThunk(
  'students/addStudent',
  async (studentData) => {
    const response = await axioInstance.post('/api/students', studentData);
    return response.data;
  }
);

// تحديث طالب
export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, updatedData }) => {
    const response = await axioInstance.put(`/api/students/${id}`, updatedData);
    return response.data;
  }
);

// حذف طالب
export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id) => {
    await axioInstance.delete(`/api/students/${id}`);
    return id;
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    error: null,
  },
  reducers: {
    // يمكنك إضافة reducers متزامنة هنا إذا لزم الأمر
  },
  extraReducers(builder) {
    builder
      // حالة جلب الطلاب
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // حالة إضافة طالب جديد
      .addCase(addStudent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students.push(action.payload);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // حالة تحديث طالب
      .addCase(updateStudent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.students.findIndex(
          (student) => student._id === action.payload._id
        );
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // حالة حذف طالب
      .addCase(deleteStudent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = state.students.filter(
          (student) => student._id !== action.payload
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default studentSlice.reducer;

// يمكنك تصدير الـ actions المتزامنة إذا قمت بتعريفها في reducers
// export const {  } = studentSlice.actions;