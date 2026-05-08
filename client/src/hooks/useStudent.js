import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axioInstance } from "@/api/config";
import { toast } from "react-hot-toast";
export const studentApi = {
  getAll: () => axioInstance.get("student"),
  getById: (id) => axioInstance.get(`student/${id}`),
  create: (data) => axioInstance.post("student", data,{
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  addAttendance: (id, data) =>
    axioInstance.post(`student/${id}/attendance`, data),
  getAttendance: (studentId, page = 1, limit = 10) =>
    axioInstance.get(`/student/${studentId}/attendance`,{ params: { page, limit }}),
  getWeekAttendance: (studentId, weekStart) =>
    axioInstance.get(`/student/${studentId}/attendance/${weekStart}`),
  updateWeekAttendance: (studentId, weekStart, days) =>
    axioInstance.put(`/student/${studentId}/attendance/${weekStart}`, { days }),
  deleteWeekAttendance: (studentId, weekStart) =>
    axioInstance.delete(`/student/${studentId}/attendance/${weekStart}`),
  getPercentAbcence: () =>
    axioInstance.get("student/overall-absence-percentage"),
  delete: (id) => axioInstance.delete(`student/${id}`),
  getBySchool: (id) => axioInstance.get(`student/by-school/${id}`),
  getByTrainningPlace: (id,page=1, limit=10, search ) =>
    axioInstance.get(`student/by-trainning-place/${id}`,{params:{ page, limit, search }}),
  search: (searchTerm) =>
    axioInstance.get("student/search", { params: { query: searchTerm } }),
  changeStatus: (ids, updates) =>
    axioInstance.patch("student/bulkUpdateStudents", ids, updates),
};
export const studentKeys = {
  all: ["students"],
  lists: () => [...studentKeys.all, "list"],
  list: (filters) => [...studentKeys.lists(), { filters }],
  details: () => [...studentKeys.all, "detail"],
  detail: (id) => [...studentKeys.details(), id],
  bySchool: (schoolId) => [...studentKeys.all, schoolId],
 byTrainnigPlace: (trainningId, page, limit, search) => 
    ['students', 'trainningPlace', trainningId, page, limit, search],
  search: (query) => [...studentKeys.all, "search", query],
  inClass: (filters) => [...studentKeys.all, 'inClass', filters], 
};

export const useStudents = () => {
  return useQuery({
    queryKey: studentKeys.all,
    queryFn: async () => {
      try {
        let response = await studentApi.getAll();
        return response.data;
      } catch (error) {
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
    mutationFn: async ({ studentId, data }) => {
      const response = await axioInstance.patch(`/student/${studentId}`, data,{
    headers: { 'Content-Type': 'multipart/form-data' },
  });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
        toast.success("تم تحديث الطالب بنجاح");
    },
     onError: (error) => {
      toast.error("فشل التحديث: " + error.message);
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
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      toast.success("تم حذف الطالب بنجاح");
    },
     onError: (error) => {
      toast.error("فشل الحذف: " + error.message);
    },
  });
};

export const useChangeStatusOfStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ studentIds, updates }) => {
      console.log(studentIds, updates );
      
      const response = await axioInstance.patch("/student/bulk-update", {
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

export const useStudentByTrainningPlace = (trainningId, page = 1, limit = 10, search = '') => {
  return useQuery({
    queryKey: studentKeys.byTrainnigPlace(trainningId, page, limit, search),
    queryFn: () => studentApi.getByTrainningPlace(trainningId, page, limit, search),
    enabled: !!trainningId,
    keepPreviousData: true, // prevents flickering on page change
    select: (response) => response.data, // assuming response = { success, data, pagination }
    // onError: (error) => {
    //   console.error("Error fetching students by training place:", error);
    //   alert(`فشل في جلب الطلاب: ${error.response?.data?.message || error.message}`);
    // },
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
      alert(
        `فشل في التسجيل: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};
export const useStudentAttendance = (studentId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["student-attendance", studentId, page, limit],
    queryFn: () => studentApi.getAttendance(studentId, page, limit),
    enabled: !!studentId,
    keepPreviousData: true, // prevents flashing on page change
  });
};

export const useWeekAttendance = (studentId, weekStart, options = {}) => {
  return useQuery({
    queryKey: ["week-attendance", studentId, weekStart],
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
      queryClient.invalidateQueries({
        queryKey: ["student-attendance", variables.studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["week-attendance", variables.studentId, variables.weekStart],
      });
      alert("تم تحديث الغياب بنجاح");
    },
    onError: (error) => {
      console.error("Update error:", error);
      alert(`فشل التحديث: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useDeleteWeekAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, weekDelete }) =>{
     return studentApi.deleteWeekAttendance(studentId, weekDelete);
    },
    onSuccess: (_, variables) => {
      // تحديث ذاكرة التخزين المؤقت للاستعلامات المتأثرة
      queryClient.invalidateQueries({
        queryKey: ["student-attendance", variables.studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["week-attendance", variables.studentId, variables.weekDelete],
      });
      // alert("تم حذف الأسبوع بنجاح");
    },
    // onError: (error) => {
    //   console.error("Delete error:", error);
    //   // alert(`فشل الحذف: ${error.response?.data?.message || error.message}`);
    // },
    
     
  });
};


export const useGetPercentAbsence = () => {
  return useQuery({
    queryKey: ["overallAbsence"],
    queryFn: async () => {
      const response = await studentApi.getPercentAbcence();
      // Axios puts the actual data in response.data
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
////

export const useStudentById = (id) => {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: async () => {
      const response = await studentApi.getById(id);
   
      return response.data.data;
    },
    enabled: !!id, // يعمل فقط إذا كان الـ ID موجودًا
  });
};

export const useStudentSearch = (searchTerm, options = {}) => {

  let term;
  if (typeof searchTerm === "object" && searchTerm.studentName) {
    term = searchTerm.studentName;
  } else if (typeof searchTerm === "string") {
    term = searchTerm;

  } else {
    term = "";
  }

  return useQuery({
    queryKey: studentKeys.search(term), // Now term is a string
    queryFn: () => studentApi.search(term), // term is a string
    enabled: !!term && term.length >= 2,
    ...options,
  });
};


