import { axioInstance } from "../api/config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {studentKeys} from "./useStudent";
export const schoolsApi = {
 getAll: ({ page = 1, limit = 10, search = "" } = {}) =>  axioInstance.get("school", { params: { page, limit, search }}),
  getById: (id) => axioInstance.get(`school/${id}`),
  create: (data) => axioInstance.post("school", data),
  update: (id, data) => axioInstance.put(`school/${id}`, data),
  delete: (id) => axioInstance.delete(`school/${id}`),
  getByDept: (deptID) => axioInstance.get(`school/${deptID}`),
  getByIntakes:(id)=>axioInstance.get(`school/intakes/${id}`),
  getSpecialBySchool:(id)=>axioInstance.get(`school/special/${id}`),
  getClasses:(filters)=>axioInstance.get("school/classes",{ params: filters }),
  getStudentByClass:(filters)=>axioInstance.get("school/student-by-class",{ params: filters }), 
  getSchoolBySpecial:(selectedSpecial)=>axioInstance.get(`school/schools-by-special/${selectedSpecial}`),
  getStudentInClasses:(filters)=>axioInstance.get("school/student-in-class",{ params: filters }),
     getSchoolByType:(selectedType)=>axioInstance.get(`school/schools-by-type/${selectedType}`),
};
export const schoolKeys = {
  all: ["schools"],
  lists: () => [...schoolKeys.all, "list"],
  list: (filters) => [...schoolKeys.lists(), { filters }],
  details: () => [...schoolKeys.all, "detail"],
  detail: (id) => [...schoolKeys.details(), id],
  byDept: (deptID) => [...schoolKeys.all, "dept", deptID],
  intakes: (schoolId) => [...schoolKeys.all, schoolId, 'intakes'],
  special:(schoolId)=>["schools", 'special',schoolId],
  classes:(filters)=>[...schoolKeys.lists(), { filters }],
  students:(filters)=>[...schoolKeys.lists(),{filters}],
  schoolBySpecial:(selectedSpecial)=>['schools', "special", selectedSpecial],
  studentInClass:(filters)=>[...schoolKeys.lists(), { filters }],
    byType: (typeId) => ['schools', 'type', typeId],

};

export const useSchools = ({ page = 1, limit = 10, search = "" } = {}) => {
  return useQuery({
      queryKey: schoolKeys.list({ page, limit, search }),
    queryFn: async  () => {
      try {
        const response = await schoolsApi.getAll({ page, limit, search });
        return response.data; // should be { success, data: [], pagination }
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
      }
    },
   keepPreviousData: true, // prevents flickering when changing page/search
    // staleTime: 5 * 60 * 1000,
  });
};

export const useSchoolById = (id) => {
  return useQuery({
    queryKey: schoolKeys.detail(id),
    queryFn: async () => {
      const response = await schoolsApi.getById(id);
      return response.data.data;
    },
    enabled: !!id, // يعمل فقط إذا كان الـ ID موجودًا
  });
};
export const useCreateSchool = (deptID) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {

      
      const response = await schoolsApi.create(data);
   
      return response.data;
    },

onSuccess: (newSchool) => {
  // 1. تحديث cache جميع المدارس (الرئيسي)
  queryClient.setQueryData(schoolKeys.all, (oldData) => {
  
     const existingSchools =  Array.isArray(oldData)? oldData : oldData?.schools || [] ;
  
      const updatedSchools = [...existingSchools, newSchool];
    // const newData = oldData?.schools ? [...oldData, newSchool] : [newSchool];
    return { schools:updatedSchools}
    
  });
  
  // 2. تحديث cache القسم المحدد إذا كان موجودًا
  const schoolDeptID = newSchool.departement?._id;
  if (deptID && schoolDeptID === deptID) {
    
    // تحقق من وجود cache باستخدام الطريقة الصحيحة
    const cacheKey = schoolKeys.byDept(deptID);

    // الطريقة الصحيحة للتحقق من cache
    const allQueries = queryClient.getQueryCache().findAll();

    const existingCache = queryClient.getQueryData(cacheKey);
   
    if (existingCache) {
      // إذا كان cache موجوداً، قم بتحديثه
      queryClient.setQueryData(cacheKey, (oldData) => {
    
        return oldData ? [...oldData, newSchool] : [newSchool];
      });
    } else {
      // بدلاً من ذلك، يمكنك إعادة جلب البيانات من السيرفر
      queryClient.invalidateQueries({ 
        queryKey: schoolKeys.lists() 
      });
    }
  }
  
  alert("تم إضافة المدرسة بنجاح");
},
onError: (error) => {
      console.error("Error creating school:", error);
    },
  });
};
export const useUpdateSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updateData }) => {
  
      await schoolsApi.update(id, updateData);
    },
    onSuccess: (data, variables) => {

      queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
      if(variables.departmentId){
   
        const deptCacheKey = schoolKeys.byDept(variables.departmentId);
        const deptCache = queryClient.getQueryData(deptCacheKey);
        if (deptCache) {
          queryClient.setQueryData(deptCacheKey, (oldData) => {
            if (!oldData) return oldData;
            // return oldData.map(school => 
            //   school._id === updateData._id ? updateData : school
            // );
          });
        } else {
            console.log('No cache for this department, skipping update');
//  queryClient.refetchQueries({ queryKey: schoolKeys.byDept(variables.departmentId), exact: true,});
        } 
      }
      //
      //   alert("تم تحديث المدرسة بنجاح");
    },
    onError: (error) => {
      console.error("Error updating school:", error);
      
        alert(
          `فشل في التحديث: ${error.response?.data?.message || error.message}`
        );
    },
  });
};
export const useDeleteSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => await schoolsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolKeys.all });
      //   alert("تم حذف المدرسة بنجاح");
    },
  });
};
export const useSchoolsByDept = (deptID) => {
  return useQuery({
    queryKey: schoolKeys.byDept(deptID), // استخدام المفتاح الجديد
    queryFn: async () => await schoolsApi.getByDept(deptID), // نفترض وجود هذه الدالة في الـ API
    enabled: !!deptID, // يتم تنفيذ الاستعلام فقط إذا كان deptID موجودًا
  });
};

export const useSchoolByintake = (selectedSchool) => {
  return useQuery({
    queryKey: schoolKeys.intakes(selectedSchool),
    queryFn: async () => {
      const response = await schoolsApi.getByIntakes(selectedSchool);
      return response.data.data;
    },
    enabled: !!selectedSchool, // يعمل فقط إذا كان الـ ID موجودًا
  });
};
export const useSchoolSpecial = (selectedSchool) => {

  return useQuery({
    queryKey: schoolKeys.special(selectedSchool),
    queryFn: async () => {
      const response = await schoolsApi.getSpecialBySchool(selectedSchool);
      return response.data.data;
    },
    enabled: !!selectedSchool, // يعمل فقط إذا كان الـ ID موجودًا
  });
};

export const useClassesForAttendance = (filters) => {
  return useQuery({
    queryKey: ['classes', filters],
    queryFn: async () => {
      const response = await schoolsApi.getClasses(filters);
      return response.data.data;
    },
    enabled: !!filters.school && !!filters.intake && !!filters.special && !!filters.stage,
  });
};

export const useStudentInClassesForAttendance=(filters)=>{
   return useQuery({
    queryKey: ['students', filters],
    queryFn: async () => {
      const response = await schoolsApi.getStudentByClass(filters);
      return response.data.data;
    },
    enabled: !!filters.school && !!filters.intake && !!filters.special && !!filters.stage && !!filters.className,
  });
}

export const useSchoolsBySpecial=(selectedSpecial)=>{
  return useQuery({
    queryKey: schoolKeys.schoolBySpecial(selectedSpecial),
    queryFn: async () => {
      const response = await schoolsApi.getSchoolBySpecial(selectedSpecial);
      return response.data.data;
    },
    enabled: !!selectedSpecial, // يعمل فقط إذا كان الـ ID موجودًا
  });

}
export const useGetSchoolByType = (selectedType) => {
  return useQuery({
    queryKey: schoolKeys.byType(selectedType), // ✅ now starts with ['schools']
    queryFn: async () => {
      const response = await schoolsApi.getSchoolByType(selectedType);
      return response.data.data;
    },
    enabled: !!selectedType,
  });
};


export const fetchStudents = async ({ school, intake, special, stage, className }) => {
  const params = new URLSearchParams({ school, intake, special, stage, className });
  const response = await axioInstance.get(`/school/student-in-class?${params}`);
  return response.data;
};
export function useStudentInClasses(params, options = {}) {
  return useQuery({
    queryKey:  studentKeys.inClass(params),
    queryFn: () => fetchStudents(params),
    ...options,
  });
}