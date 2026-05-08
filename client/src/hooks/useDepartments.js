// hooks/useDepartments.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axioInstance } from '../api/config';

// API functions
const departmentsApi = {
  getAll: () => axioInstance.get('departement'),
  getById: (id) => axioInstance.get(`departement/${id}`),
  create: (data) => axioInstance.post('departement', data),
  update: (id, data) => axioInstance.put(`departement/${id}`, data),
  delete: (id) => axioInstance.delete(`departement/${id}`),
};

// Query keys – consistent and structured
export const departmentKeys = {
  all: ['departments'],
  list: (filters = {}) => [...departmentKeys.all, 'list', filters],
  detail: (id) => [...departmentKeys.all, 'detail', id],
};

// Hook to fetch all departments with optional filters
export const useDepartments = (filters = {}) => {
  return useQuery({
    queryKey: departmentKeys.list(filters),
    queryFn: async () => {
      const response = await departmentsApi.getAll();
      // Adjust based on your API response structure
      return response.data.data || response.data;
    },
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
  });
};

// Hook to fetch a single department by ID
export const useDepartment = (id) => {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: async () => {
      const response = await departmentsApi.getById(id);
      return response.data.data || response.data;
    },
    enabled: !!id,              // only run if id exists
    staleTime: 2 * 60 * 1000,
  });
};

// Hook to add a new department
export const useAddDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newDepartment) => departmentsApi.create(newDepartment),
    onSuccess: () => {
      // Invalidate and refetch the list
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
};

// Hook to update a department
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => departmentsApi.update(id, data),
    onSuccess: (data, variables) => {
      // Invalidate both the list and the individual department detail
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(variables.id) });
    },
  });
};

// Hook to delete a department
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => departmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
};