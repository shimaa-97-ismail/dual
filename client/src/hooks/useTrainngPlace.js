import { axioInstance } from "../api/config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const trainningApi = {
  getAll: () => axioInstance.get("trainning-place"),
//   getById: () => axioInstance.get("trainning-place"),
  create: (data) => axioInstance.post("trainning-place", data),
  update: (id, data) => axioInstance.put(`trainning-place/${id}`, data),
  delete: (id) => axioInstance.delete(`trainning-place/${id}`),
};


export const trainningPlacesKeys = {
  all: ["trainngPlaces"],
  lists: () => [...trainningPlacesKeys.all, "list"],
  list: (filters) => [...trainningPlacesKeys.lists(), { filters }],
  details: () => [...trainningPlacesKeys.all, "detail"],
  detail: (id) => [...trainningPlacesKeys.details(), id],
//   byDept: (deptID) => [...trainngPlacesKeys.all, "dept", deptID],
};

export const useTrainningPlaces = () => {
  return useQuery({
    queryKey: trainningPlacesKeys.lists(),
    queryFn: async () => {
      try {
        let response = await trainningApi.getAll();
        console.log(response);

        return response.data.data;
      } catch (error) {
        console.log(error);
        throw new Error(error.response?.data?.message || error.message);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق
    // ...options,
  });
};