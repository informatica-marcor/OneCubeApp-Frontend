import { useQuery } from '@tanstack/react-query';
import api from '../../../config/api';

export const userKeys = {
  all: ['users'],
  clients: () => [...userKeys.all, 'clients'],
};

const getClientsRequest = async () => {
  const { data } = await api.get("/clients");
  return data;
};

const useGetClients = () => {
  const query = useQuery({
    queryKey: ['clients'],
    queryFn: getClientsRequest,
  });

  return {
    clients: query.data,
    isClientsLoading: query.isLoading,
    clientsError: query.error,
    refreshClients: query.refetch,
  };
};

export default useGetClients;