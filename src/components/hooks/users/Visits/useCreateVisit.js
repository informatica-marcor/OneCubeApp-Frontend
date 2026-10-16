import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/api';

const createVisitRequest = async (payload) => {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("rut", payload.rut);
    formData.append("email", payload.email);
    formData.append("start_date", payload.startDate);
    formData.append("end_date", payload.endDate);
    formData.append("photo", payload.faceImage);

    const { data } = await api.post("/users/visit", formData);
    return data;
};

const useCreateVisit = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createVisitRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    createVisit: mutation.mutateAsync,
    isCreatingVisit: mutation.isPending,
    createVisitError: mutation.error,
  };
};

export default useCreateVisit;