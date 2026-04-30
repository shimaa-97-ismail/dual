import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axioInstance } from "../api/config";

export const useTrainningPlaces = ({ page = 1, limit = 10, search = "" } = {}) => {
  const queryClient = useQueryClient();
  const queryKey = ["trainning-place", { page, limit, search }]; // keep consistent

  const query = useQuery({
    queryKey,
    queryFn: () =>
      axioInstance
        .get("/trainning-place", { params: { page, limit, search } })
        .then((res) => res.data),
    keepPreviousData: true,
  });

  const addMutation = useMutation({
    mutationFn: (newPlace) => axioInstance.post("/trainning-place", newPlace),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainning-place"] }); // ✅ match
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }) => axioInstance.put(`/trainning-place/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainning-place"] }); // ✅
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id) => axioInstance.delete(`/trainning-place/${id}`), // ✅ fixed
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainning-place"] }); // ✅
    },
  });

  return {
    data: query.data?.data || [],
    pagination: query.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    isLoading: query.isLoading,
    isError: query.isError,
    addTrainningPlace: addMutation.mutateAsync,
    editTrainningPlace: (id, data) => editMutation.mutateAsync({ id, data }),
    removeTrainningPlace: removeMutation.mutateAsync,
    refetch: query.refetch,
  };
};