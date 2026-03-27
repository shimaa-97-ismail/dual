import { axioInstance } from "../api/config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const schoolsApi = {
  getAll: () => axioInstance.get("school"),
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
  
};
export const schoolKeys = {
  all: ["schools"],
  lists: () => [...schoolKeys.all, "list"],
  list: (filters) => [...schoolKeys.lists(), { filters }],
  details: () => [...schoolKeys.all, "detail"],
  detail: (id) => [...schoolKeys.details(), id],
  byDept: (deptID) => [...schoolKeys.all, "dept", deptID],
  intakes: (schoolId) => [...schoolKeys.all, schoolId, 'intakes'],
  special:(schoolId)=>[...schoolKeys.all, schoolId, 'special'],
  classes:(filters)=>[...schoolKeys.lists(), { filters }],
  students:(filters)=>[...schoolKeys.lists(),{filters}],
  schoolBySpecial:(selectedSpecial)=>[...schoolKeys.all, "dept", selectedSpecial],
  studentInClass:(filters)=>[...schoolKeys.lists(), { filters }],
};

export const useSchools = () => {
  return useQuery({
    queryKey: schoolKeys.lists(),
    queryFn: async  () => {
      try {
        let response = await schoolsApi.getAll();
        console.log(response);

        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error(error.response?.data?.message || error.message);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق
    // ...options,
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
  console.log("deptID", deptID);

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      console.log(data);
      
      const response = await schoolsApi.create(data);
     console.log(response);
     
      return response.data;
    },

onSuccess: (newSchool) => {
  console.log('New school data:', newSchool);
  
  // 1. تحديث cache جميع المدارس (الرئيسي)
  queryClient.setQueryData(schoolKeys.lists(), (oldData) => {
    const newData = oldData ? [...oldData, newSchool] : [newSchool];
    console.log('Updated all schools cache:', newData);
    return newData;
  });
  
  // 2. تحديث cache القسم المحدد إذا كان موجودًا
  const schoolDeptID = newSchool.departement?._id;
  if (deptID && schoolDeptID === deptID) {
    console.log('Attempting to update cache for dept:', deptID);
    
    // تحقق من وجود cache باستخدام الطريقة الصحيحة
    const cacheKey = schoolKeys.byDept(deptID);
    console.log('Cache key:', cacheKey);
    
    // الطريقة الصحيحة للتحقق من cache
    const allQueries = queryClient.getQueryCache().findAll();
    console.log('All queries in cache:', allQueries.map(q => q.queryKey));
    
    const existingCache = queryClient.getQueryData(cacheKey);
    console.log('Direct cache check for', deptID, ':', existingCache);
    
    if (existingCache) {
      // إذا كان cache موجوداً، قم بتحديثه
      queryClient.setQueryData(cacheKey, (oldData) => {
        console.log('Updating existing cache, old data:', oldData);
        return oldData ? [...oldData, newSchool] : [newSchool];
      });
    } else {
      // إذا لم يكن cache موجوداً، لا تقم بإنشائه لأنه ليس هناك طلب له
      console.log('No cache exists for dept', deptID, '- skipping cache update');
      
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
         console.log(data,variables);
      queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
      if(variables.departmentId){
        console.log("departmentId update");
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
      queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
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
  console.log(selectedSchool);
  
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
  console.log(selectedSchool);
  
  return useQuery({
    queryKey: schoolKeys.special(selectedSchool),
    queryFn: async () => {
      console.log(selectedSchool);
      
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
      console.log(filters);
      
      const response = await schoolsApi.getClasses(filters);
      console.log(response.data);
      
      return response.data.data;
    },
    enabled: !!filters.school && !!filters.intake && !!filters.special && !!filters.stage,
  });
};

export const useStudentInClassesForAttendance=(filters)=>{
   return useQuery({
    queryKey: ['students', filters],
    queryFn: async () => {
      console.log(filters);
      
      const response = await schoolsApi.getStudentByClass(filters);
      console.log(response.data.data);
      
      return response.data.data;
    },
    enabled: !!filters.school && !!filters.intake && !!filters.special && !!filters.stage && !!filters.className,
  });
}

export const useSchoolsBySpecial=(selectedSpecial)=>{
 console.log(selectedSpecial);
  
  return useQuery({
    queryKey: schoolKeys.schoolBySpecial(selectedSpecial),
    queryFn: async () => {
      const response = await schoolsApi.getSchoolBySpecial(selectedSpecial);
      return response.data.data;
    },
    enabled: !!selectedSpecial, // يعمل فقط إذا كان الـ ID موجودًا
  });

}

export const useStudentInClasses=(filters)=>{
   return useQuery({
    queryKey: schoolKeys.studentInClass(filters),
    queryFn: async () => {
      console.log(filters,"assss");

      const response = await schoolsApi.getStudentInClasses(filters);
      console.log(response.data.data);
      return response.data.data;
    },
    enabled: !!filters.school && !!filters.intake && !!filters.special && !!filters.stage && !!filters.className,
  });
}