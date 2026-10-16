import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/api';

const createClientRequest = async (payload) => {
    const { data } = await api.post("/users/client", payload);
    return data;
    
};

const useCreateClient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createClientRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    createClient: mutation.mutateAsync,
    isCreatingClient: mutation.isPending,
    createClientError: mutation.error,
  };
};

export default useCreateClient;