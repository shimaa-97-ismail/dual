import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axioInstance } from "../api/config";

export const specialsApi = {
    getAll: () => axioInstance.get("schoolSpecial"),
    getById: (id) => axioInstance.get(`schoolSpecial/${id}`),
    create: (data) => axioInstance.post("schoolSpecial", data),
    update: (id, data) => axioInstance.put(`schoolSpecial/${id}`, data),
    delete: (id) => axioInstance.delete(`schoolSpecial/${id}`),
};

export const specialKeys = {
    all: ["specials"],
    lists: () => [...specialKeys.all, "list"],
    list: (filters) => [...specialKeys.lists(), { filters }],
    details: () => [...specialKeys.all, "detail"],
    detail: (id) => [...specialKeys.details(), id],
};

export const useSpecials = (filters) => {
    return useQuery({
        queryKey: specialKeys.list(filters),
        queryFn: async () => {
            try {
                let response = await specialsApi.getAll();
                return response.data;
            } catch (error) {
                throw new Error(error.response?.data?.message || error.message);
            }
        },
        staleTime: 5 * 60 * 1000, // 5 دقائق
    });
}

export const useSpecialById = (id) => {
    return useQuery({
        queryKey: specialKeys.detail(id),
        queryFn: async () => {
            const response = await specialsApi.getById(id);
            return response.data.data;
        },
        enabled: !!id, // يعمل فقط إذا كان الـ ID موجودًا
    });
};

export const useCreateSpecial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => await specialsApi.create(data),
        onSuccess: () => {
            // إعادة جلب البيانات بعد الإضافة   
            queryClient.invalidateQueries({ queryKey: specialKeys.lists() });
            alert("تم إنشاء التخصص بنجاح");
        },
        onError: (error) => {
            console.error("Error creating special:", error);
            alert("فشل في إنشاء التخصص: " + (error.response?.data?.message || error.message));
        },
    });
};

export const useUpdateSpecial = (id) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            await specialsApi.update(data.id, data.updateData)
        },
        onSuccess: () => {
            // إعادة جلب البيانات بعد التحديث
            queryClient.invalidateQueries({ queryKey: specialKeys.lists() });
            queryClient.invalidateQueries({ queryKey: specialKeys.detail(id) });
            alert("تم تحديث التخصص بنجاح");
        },
        onError: (error) => {
            console.error("Error updating special:", error);
            alert("فشل في تحديث التخصص: " + (error.response?.data?.message || error.message));
        },
    });
};

export const useDeleteSpecial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => await specialsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: specialKeys.lists() });
            alert("تم حذف التخصص بنجاح");
        },
        onError: (error) => {
            console.error("Error deleting special:", error);
            alert("فشل في حذف التخصص: " + (error.response?.data?.message || error.message));
        }
    });
};