import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';
import { leaseKeys } from '../keys';

const createLeaseRequest = async (payload) => {
  const { data } = await api.post('/leases', payload);
  return data;
};

const useCreateLease = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createLeaseRequest,
    onSuccess: (_createdLease, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leases'] });
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });

      if (variables?.user_id) {
        queryClient.invalidateQueries({
          queryKey: leaseKeys.byUser(variables.user_id),
        });
        
      }
    },
  });

  return {
    createLease: mutation.mutateAsync,
    isCreatingLease: mutation.isPending,
    createLeaseError: mutation.error,
  };
};

export default useCreateLease;