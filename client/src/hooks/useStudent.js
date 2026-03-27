import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axioInstance } from "@/api/config";

export const studentApi = {
  getAll: () => axioInstance.get("student"),
  getById: (id) => axioInstance.get(`student/${id}`),
  create: (data) => axioInstance.post("student", data),
  addAttendance: (id, data) => axioInstance.post(`student/${id}/attendance`, data),
  getAttendance: (studentId) => axioInstance.get(`/student/${studentId}/attendance`),
    getWeekAttendance: (studentId, weekStart) => 
    axioInstance.get(`/student/${studentId}/attendance/${weekStart}`),
     updateWeekAttendance: (studentId, weekStart, days) =>
    axioInstance.put(`/student/${studentId}/attendance/${weekStart}`, { days }),
      deleteWeekAttendance: (studentId, weekStart) =>
    axioInstance.delete(`/student/${studentId}/attendance/${weekStart}`),

  delete: (id) => axioInstance.delete(`student/${id}`),
  getBySchool: (id) => axioInstance.get(`student/by-school/${id}`),
  getByTrainningPlace: (id) =>
    axioInstance.get(`student/by-trainning-place/${id}`),
  search: (searchTerm) =>
    axioInstance.get("student/search", { params: { query: searchTerm } }),
  changeStatus:(ids,updates)=> axioInstance.patch("student/bulkUpdateStudents",ids,updates)
};
export const studentKeys = {
  all: ["students"],
  lists: () => [...studentKeys.all, "list"],
  list: (filters) => [...studentKeys.lists(), { filters }],
  details: () => [...studentKeys.all, "detail"],
  detail: (id) => [...studentKeys.details(), id],
  bySchool: (schoolId) => [...studentKeys.all, schoolId],
  byTrainnigPlace: (trainningId) => [...studentKeys.all, trainningId],
  search: (query) => [...studentKeys.all, "search", query],
  
};

export const useStudents = () => {
  return useQuery({
    queryKey: studentKeys.lists(),
    queryFn: async () => {
      try {
        let response = await studentApi.getAll();
        console.log(response);

        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error(error.response?.data?.message || error.message);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      console.log(data);

      await studentApi.create(data);
    },

    onSuccess: () => {
      // إعادة جلب البيانات بعد الإضافة
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      alert("تم اضافه طالب جديد");
    },
    onError: (error) => {
      console.error("Error add student:", error);
      alert(
        `فشل في الإنشاء: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axioInstance.put(`/student/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      alert("تم تحديث الطالب بنجاح" )// or relevant query keys
    },
  });
};
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axioInstance.delete(`/student/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
};


export const useChangeStatusOfStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ studentIds, updates }) => {
      const response = await axioInstance.patch('/student/bulk-update', {
        studentIds,
        updates,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate students list to refresh data
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
};
export const useStudentBySchool = (schoolId) => {
  console.log(schoolId);

  return useQuery({
    queryKey: studentKeys.bySchool(schoolId),
    queryFn: () => studentApi.getBySchool(schoolId),
    enabled: !!schoolId,
    select: (data) => data.data,
    onError: (error) => {
      console.error("Error fetching students by department:", error);
      alert(
        `فشل في جلب الطلاب: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};

export const useStudentByTrainningPlace = (trainningId) => {
  // console.log(trainningId);

  return useQuery({
    queryKey: studentKeys.byTrainnigPlace(trainningId),
    queryFn: () => studentApi.getByTrainningPlace(trainningId),
    enabled: !!trainningId,
    select: (data) => data.data,
    onError: (error) => {
      console.error("Error fetching students by department:", error);
      alert(
        `فشل في جلب الطلاب: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};
//absent
export const useAddAttendanceStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, startDate, attendanceData }) =>
      studentApi.addAttendance(studentId, { startDate, attendanceData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      alert("تم تسجيل الحضور والغياب بنجاح");
    },
    onError: (error) => {
      console.error("Attendance error:", error);
      alert(`فشل في التسجيل: ${error.response?.data?.message || error.message}`);
    },
  });
};
export const useStudentAttendance = (studentId) => {
  return useQuery({
    queryKey: ['student-attendance', studentId],
    queryFn: () => studentApi.getAttendance(studentId),
    enabled: !!studentId, // لا يتم الجلب إلا إذا كان studentId موجوداً
    select: (response) => response.data.data, // استخراج المصفوفة من الاستجابة
  });
};


export const useWeekAttendance = (studentId, weekStart, options = {}) => {
  return useQuery({
    queryKey: ['week-attendance', studentId, weekStart],
    queryFn: () => studentApi.getWeekAttendance(studentId, weekStart),
    enabled: !!studentId && !!weekStart,
    select: (response) => response.data.data,
    ...options,
  });
};


export const useUpdateWeekAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, weekStart, days }) =>
      studentApi.updateWeekAttendance(studentId, weekStart, days),
    onSuccess: (data, variables) => {
      // تحديث ذاكرة التخزين المؤقت للاستعلامات المتأثرة
      queryClient.invalidateQueries({ queryKey: ['student-attendance', variables.studentId] });
      queryClient.invalidateQueries({
        queryKey: ['week-attendance', variables.studentId, variables.weekStart],
      });
      alert('تم تحديث الغياب بنجاح');
    },
    onError: (error) => {
      console.error('Update error:', error);
      alert(`فشل التحديث: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useDeleteWeekAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, weekStart }) =>
      studentApi.deleteWeekAttendance(studentId, weekStart),
    onSuccess: (_, variables) => {
      // تحديث ذاكرة التخزين المؤقت للاستعلامات المتأثرة
      queryClient.invalidateQueries({ queryKey: ['student-attendance', variables.studentId] });
      queryClient.invalidateQueries({
        queryKey: ['week-attendance', variables.studentId, variables.weekStart],
      });
      alert('تم حذف الأسبوع بنجاح');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      alert(`فشل الحذف: ${error.response?.data?.message || error.message}`);
    },
  });
};















////

export const useStudentById = (id) => {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: async () => {
      const response = await studentApi.getById(id);
      console.log(response);

      return response.data.data;
    },
    enabled: !!id, // يعمل فقط إذا كان الـ ID موجودًا
  });
};

export const useStudentSearch = (searchTerm, options = {}) => {
  console.log(searchTerm);
  let term;
  if (typeof searchTerm === 'object' && searchTerm.studentName) {
    term = searchTerm.studentName;
  } else if (typeof searchTerm === 'string') {
    term = searchTerm;
    console.log(term);

  } else {
    term = '';
  }
  console.log(term);

  return useQuery({
    queryKey: studentKeys.search(term), // Now term is a string
    queryFn: () => studentApi.search(term), // term is a string
    enabled: !!term && term.length >= 2,
    ...options,
  });
};

// export const useChangeStatusOfStudents = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (ids,updates) => studentApi.changeStatus(ids,updates), // data = { studentIds, updates }
//     onSuccess: (response, variables) => {
//       // response هو ما يعيده السيرفر (مثلاً { matchedCount, modifiedCount, ... })
//       // variables هو البيانات التي أرسلتها { studentIds, updates }
//       console.log('Update successful:', response, variables);
      
//       // إبطال استعلامات الطلاب لإعادة جلب البيانات
//       queryClient.invalidateQueries({ queryKey: studentKeys.all });
      
//       // يمكنك أيضًا تحديث الكاش مباشرة إذا أردت (اختياري)
//       // queryClient.setQueryData(studentKeys.lists(), (old) => ...)
//     },
//     onError: (error) => {
//       console.error("Error updating students status:", error);
//       alert(
//         `فشل في التحديث: ${error.response?.data?.message || error.message}`,
//       );
//     },
//   });
// };