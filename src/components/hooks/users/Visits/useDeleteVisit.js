import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/api';

const deleteVisitRequest = async (userId) => {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
};

const useDeleteVisit = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteVisitRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    deleteVisit: mutation.mutateAsync,
    isDeletingVisit: mutation.isPending,
    DeleteVisitError: mutation.error,
  };
};

export default useDeleteVisit;