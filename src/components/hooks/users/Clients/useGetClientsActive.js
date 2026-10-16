import { useQuery } from '@tanstack/react-query';
import api from '../../../config/api';

export const userKeys = {
  all: ['users'],
  clients: () => [...userKeys.all, 'clients'],
};

const getClientsActiveRequest = async () => {
  const { data } = await api.get("/users/client/active");
  return data;
};

export function useGetClientsActive() {
  return useQuery({
    queryKey: ['active_clients'],
    queryFn: getClientsActiveRequest,
  });
};