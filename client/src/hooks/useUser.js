import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axioInstance } from "../api/config";
import { toast } from 'react-toastify';
// hooks/users/queryKeys.js
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
};

 const fetchUsers = async () => {
  const { data } = await axioInstance.get('/user');
  return data.data; // assuming { success: true, data: users }
};

 const createUser = async (userData) => {
  const { data } = await axioInstance.post('/user', userData);
  return data.data;
};

 const updateUser = async ({ id, ...userData }) => {
  
  const { data } = await axioInstance.put(`/user/${id}`, userData);
  return data.data;
};

 const deleteUser = async (id) => {
  const { data } = await axioInstance.delete(`/user/${id}`);
  return data.data; // or just id
};

const fetchUser = async (id) => {
  const { data } = await axioInstance.get(`/user/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return data.data;
};
export const useUsers = (options = {}) => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
export const useUser = (id, options = {}) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: !!id,
    ...options,
  });
};
// Hook for creating a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('تم إنشاء المستخدم بنجاح');
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'فشل إنشاء المستخدم');
    },
  });
};

// Hook for updating a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data, variables) => {
      toast.success('تم تحديث المستخدم بنجاح');
      // Invalidate the specific user detail if you have one
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'فشل تحديث المستخدم');
    },
  });
};

// Hook for deleting a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('تم حذف المستخدم بنجاح');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'فشل حذف المستخدم');
    },
  });
};