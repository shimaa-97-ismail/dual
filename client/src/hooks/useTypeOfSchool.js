import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axioInstance } from "../api/config";

export const typesApi = {
  getAll: () => axioInstance.get("typeOfSchool"),
  getById: (id) => axioInstance.get(`typeOfSchool/${id}`),
  create: (data) => axioInstance.post("typeOfSchool", data),
  update: (id, data) => axioInstance.put(`typeOfSchool/${id}`, data),
  delete: (id) => axioInstance.delete(`typeOfSchool/${id}`),
  getSchoolByType:(selectedType)=>axioInstance.get(`typeOfSchool/schools/${selectedType}`),
};

export const typeOfSchoolKeys = {
  all: ["typeOfSchool"],
  lists: () => [...typeOfSchoolKeys.all, "list"],
  list: (filters) => [...typeOfSchoolKeys.lists(), { filters }],
  details: () => [...typeOfSchoolKeys.all, "detail"],
  detail: (id) => [...typeOfSchoolKeys.details(), id],
   schoolByType:(selectedType)=>[...typeOfSchoolKeys.all, "type", selectedType]
};

export const useTypeOfSchools = (filters) => {
  return useQuery({
    queryKey: typeOfSchoolKeys.list(filters),
    queryFn: async () => {
      try {
        let response = await typesApi.getAll();
        return response.data.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });
};

export const useTypeOfSchool = (id) => {
  return useQuery({
    queryKey: typeOfSchoolKeys.detail(id),
    queryFn: async () => {
      const response = await typesApi.getById(id);
      return response.data;
    },
    enabled: !!id, // يعمل فقط إذا كان الـ ID موجودًا
  });
};

export const useCreateTypeOfSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => await typesApi.create(data),
    onSuccess: () => {
      // إعادة جلب البيانات بعد الإضافة
      queryClient.invalidateQueries({ queryKey: typeOfSchoolKeys.lists() });
      alert("تم إنشاء نوع المدرسة بنجاح");
    },
    onError: (error) => {
      console.error("Error creating type of school:", error);
      alert(
        `فشل في الإنشاء: ${error.response?.data?.message || error.message}`
      );
    },
  });
};

export const useUpdateTypeOfSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updateData }) => await typesApi.update(id, updateData),
    onSuccess: (data, variables) => {

      queryClient.setQueryData(typeOfSchoolKeys.detail(variables.id), data);
      // إبطال قائمة الاستعلامات
      queryClient.invalidateQueries({ queryKey: typeOfSchoolKeys.lists() });
      alert("تم تحديث نوع المدرسة بنجاح");
    },
    onError: (error) => {
      console.error("Error updating type of school:", error);
      alert(
        `فشل في التحديث: ${error.response?.data?.message || error.message}`
      );
    },
  });
};

export const useDeleteTypeOfSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => await typesApi.delete(id),
    onSuccess: (_, id) => {
      // إزالة البيانات من cache
      queryClient.removeQueries({ queryKey: typeOfSchoolKeys.detail(id) });
      // إعادة جلب القائمة
      queryClient.invalidateQueries({ queryKey: typeOfSchoolKeys.lists() });
      alert("تم حذف نوع المدرسة بنجاح");
    },
    onError: (error) => {
      console.error("Error deleting type of school:", error);
      alert(`فشل في الحذف: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useGetSchoolByType=(selectedType)=>{
    
    return useQuery({
      queryKey: typeOfSchoolKeys.schoolByType(selectedType),
      queryFn: async () => {
        const response = await typesApi.getSchoolByType(selectedType);
        return response.data.data;

      },
      enabled: !!selectedType, // يعمل فقط إذا كان الـ ID موجودًا
    });
}