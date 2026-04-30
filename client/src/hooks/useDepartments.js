import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { axioInstance } from '../api/config';
import { 
  setError, 
  clearError,
  setIsAdding,
  setIsEditing,
  setIsDeleting,
  setLastUpdated
} from '../store/slices/department';


// ✅ تعريف API functions
export const departmentsApi = {
  getAll: () => axioInstance.get('departement'),
  getById:(id)=>axioInstance.get(`departement/${id}`),
  create: (data) => axioInstance.post('departement', data),
  update: (id, data) => axioInstance.put(`departement/${id}`, data),
  delete: (id) => axioInstance.delete(`departement/${id}`),
};

// ✅ مفاتيح الاستعلام
export const departmentKeys = {
  all: ['departments'],
  lists: () => [...departmentKeys.all, 'list'],
  list: (filters) => [...departmentKeys.lists(), { filters }],
  details: () => [...departmentKeys.all, 'detail'],
  detail: (id) => [...departmentKeys.details(), id],
};

// ✅ Hook لجلب جميع الإدارات
export const useDepartments = (filters = {}, options = {}) => {
  const dispatch = useDispatch();
  
  return useQuery({
    queryKey: departmentKeys.list(filters),
    queryFn: async () => {
      try {
        const response = await departmentsApi.getAll();
        return response.data.data || response.data;
      } catch (error) {
        dispatch(setError(error.response?.data?.message || 'فشل في جلب الإدارات'));
        throw error;
      }
    },
    onSuccess: () => {
      dispatch(setLastUpdated());
      dispatch(clearError());
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق قبل اعتبار البيانات قديمة
    gcTime: 10 * 60 * 1000,   // 10 دقائق في الكاش
    ...options,
  });
};

// ✅ Hook لإضافة إدارة
export const useAddDepartment = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: departmentsApi.create,
    onMutate: async (newDepartment) => {
      // إلغاء الاستعلامات السابقة
      await queryClient.cancelQueries(departmentKeys.all);
      
      // حفظ الحالة السابقة للتراجع
      const previousDepartments = queryClient.getQueryData(departmentKeys.list());
      
      // تحديث البيانات مؤقتًا
      queryClient.setQueryData(departmentKeys.list(), (old = []) => [
        { ...newDepartment, _id: 'temp-id' },
        ...old
      ]);
      
      dispatch(setIsAdding(true));
      
      return { previousDepartments };
    },
    onSuccess: () => {
      dispatch(setIsAdding(false));
      dispatch(clearError());
      queryClient.invalidateQueries(departmentKeys.all);
    },
    onError: (error, variables, context) => {
      dispatch(setIsAdding(false));
      dispatch(setError(error.response?.data?.message || 'فشل في إضافة الإدارة'));
      
      // استعادة البيانات السابقة
      if (context?.previousDepartments) {
        queryClient.setQueryData(departmentKeys.list(), context.previousDepartments);
      }
    },
  });
};

// ✅ Hook لتحديث إدارة
export const useUpdateDepartment = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updatedData }) => {
      departmentsApi.update(id, updatedData)},
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(departmentKeys.detail(id));
      
      const previousDepartment = queryClient.getQueryData(departmentKeys.detail(id));
      
      queryClient.setQueryData(departmentKeys.detail(id), (old) => ({
        ...old,
        ...data
      }));
      
      dispatch(setIsEditing(true));
      
      return { previousDepartment };
    },
    onSuccess: (data, variables) => {
      dispatch(setIsEditing(false));
      dispatch(clearError());
      
      // تحديث القائمة والتفاصيل
      queryClient.invalidateQueries(departmentKeys.all);
      queryClient.invalidateQueries(departmentKeys.detail(variables.id));
    },
    onError: (error, variables, context) => {
      dispatch(setIsEditing(false));
      dispatch(setError(error.response?.data?.message || 'فشل في تحديث الإدارة'));
      
      if (context?.previousDepartment) {
        queryClient.setQueryData(
          departmentKeys.detail(variables.id),
          context.previousDepartment
        );
      }
    },
  });
};

// ✅ Hook لحذف إدارة
export const useDeleteDepartment = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: departmentsApi.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries(departmentKeys.all);
      
      const previousDepartments = queryClient.getQueryData(departmentKeys.list());
      
      // إزالة العنصر مؤقتًا
      queryClient.setQueryData(departmentKeys.list(), (old = []) => 
        old.filter(dept => dept._id !== id)
      );
      
      dispatch(setIsDeleting(true));
      
      return { previousDepartments };
    },
    onSuccess: () => {
      dispatch(setIsDeleting(false));
      dispatch(clearError());
      queryClient.invalidateQueries(departmentKeys.all);
    },
    onError: (error, id, context) => {
      dispatch(setIsDeleting(false));
      dispatch(setError(error.response?.data?.message || 'فشل في حذف الإدارة'));
      
      if (context?.previousDepartments) {
        queryClient.setQueryData(departmentKeys.list(), context.previousDepartments);
      }
    },
  });
};

// ✅ Hook لجلب إدارة واحدة
export const useDepartment = (id) => {
  const dispatch = useDispatch();
  
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: async () => {
      try {
        const response = await departmentsApi.getById(id);
        return response.data.data || response.data;
      } catch (error) {
        dispatch(setError(error.response?.data?.message || 'فشل في جلب الإدارة'));
        throw error;
      }
    },
    enabled: !!id, // تفعيل فقط عند وجود ID
    staleTime: 2 * 60 * 1000, // 2 دقائق
  });
};