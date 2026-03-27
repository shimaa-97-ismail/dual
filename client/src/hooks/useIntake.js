import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axioInstance } from "../api/config";

export const intakeApi = {
    getAll: () => axioInstance.get("intake"),
    getById: (id) => axioInstance.get(`intake/${id}`),
    create: (data) => axioInstance.post("intake", data),
    update: (id, data) => axioInstance.put(`intake/${id}`, data),
    delete: (id) => axioInstance.delete(`intake/${id}`),
};
export const intakeKeys = {
    all: ["intake"],
    lists: () => [...intakeKeys.all, "list"],
    list: (filters) => [...intakeKeys.lists(), { filters }],
    details: () => [...intakeKeys.all, "detail"],
    detail: (id) => [...intakeKeys.details(), id],
};

export const useIntakes = (filters) => {
    return useQuery({
        queryKey: intakeKeys.list(filters),
        queryFn: async () => {
            try {
                let response = await intakeApi.getAll();
                return response.data.data;
            } catch (error) {
                console.log(error);
                throw new Error(error.response?.data?.message || error.message);
            }
        },
        staleTime: 5 * 60 * 1000, // 5 دقائق
    });
}
export const useIntake = (id) => {
    return useQuery({
        queryKey: intakeKeys.detail(id),
        queryFn: async () => {
            const response = await intakeApi.getById(id);
            return response.data;
        }
        ,
        enabled: !!id, // يعمل فقط إذا كان الـ ID موجودًا
    });
};

export const useCreateIntake = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => await intakeApi.create(data),
        onSuccess: () => {
            // إعادة جلب البيانات بعد الإضافة
            queryClient.invalidateQueries({ queryKey: intakeKeys.lists() });
            alert("تم إنشاء الدفعة بنجاح");
        },
        onError: (error) => {
            console.error("Error creating intake:", error);
            alert("فشل في إنشاء الدفعة: " + (error.response?.data?.message || error.message));
        },
    });
};
export const useUpdateIntake = (id) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => await intakeApi.update(id, data),
        onSuccess: () => {
            // إعادة جلب البيانات بعد التحديث   
            queryClient.invalidateQueries({ queryKey: intakeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: intakeKeys.detail(id) });
            alert("تم تحديث الدفعة بنجاح");
        },
        onError: (error) => {
            console.error("Error updating intake:", error);
            alert("فشل في تحديث الدفعة: " + (error.response?.data?.message || error.message));
        },
    });
};
export const useDeleteIntake = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => await intakeApi.delete(id),
        onSuccess: () => {
            // إعادة جلب البيانات بعد الحذف 
            queryClient.invalidateQueries({ queryKey: intakeKeys.lists() });
            alert("تم حذف الدفعة بنجاح");
        }
        ,
        onError: (error) => {
            console.error("Error deleting intake:", error);
            alert("فشل في حذف الدفعة: " + (error.response?.data?.message || error.message));
        },
    });
};

    