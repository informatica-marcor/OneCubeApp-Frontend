import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/api';

const updateClientRequest = async ( client_id ) => {
    const { data } = await api.patch(`/users/${client_id}`);
    return data;
    
};

const useUpdateClient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateClientRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    updateClient: mutation.mutateAsync,
    isUpdatingClient: mutation.isPending,
    updateClientError: mutation.error,
  };
};

export default useUpdateClient;