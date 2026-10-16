import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/api';

const endVisitRequest = async (userId) => {
  const { data } = await api.patch(`/users/${userId}/end`);
  return data;
};

const useEndVisit = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: endVisitRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    endVisit: mutation.mutateAsync,
    isEndingVisit: mutation.isPending,
    endVisitError: mutation.error,
  };
};

export default useEndVisit;