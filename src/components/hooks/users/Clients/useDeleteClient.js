import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/api';

const deleteClientRequest = async (userId) => {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
};

const useDeleteClient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteClientRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    deleteClient: mutation.mutateAsync,
    isDeletingClient: mutation.isPending,
    DeleteClientError: mutation.error,
  };
};

export default useDeleteClient;