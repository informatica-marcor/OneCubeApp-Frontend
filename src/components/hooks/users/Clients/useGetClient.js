import { useQuery } from '@tanstack/react-query';
import api from '../../../config/api';

const getClientRequest = async (id) => {
    const { data } = await api.get(`/user/${id}/summary`);
    return data;
};

const useGetClient = (clientId) => {
  const query = useQuery({
    queryKey: ['clients', clientId],
    queryFn: () => getClientRequest(clientId),
    enabled: !!clientId,
  });

  return {
    client: query.data,
    isClientLoading: query.isLoading,
    clientError: query.error,
    refreshClient: query.refetch,
  };
};

export default useGetClient;