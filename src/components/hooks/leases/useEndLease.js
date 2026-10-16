import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';
import { leaseKeys } from '../keys';

const endLeaseRequest = async (leaseId) => {
  const { data } = await api.patch(`/leases/${leaseId}/end`);
  return data;
};

const useEndLease = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: endLeaseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leases'] });
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });

  return {
    endLease: mutation.mutateAsync,
    isEndingLease: mutation.isPending,
    endLeaseError: mutation.error,
  };
};

export default useEndLease;