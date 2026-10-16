import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';

const getUserRequest = async (id) => {
    const { data } = await api.get(`/users/${id}`);
        return data;
};

export const useGetUser = (userId) => {
  const query = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUserRequest(userId),
    enabled: Boolean(userId),
  });

  return {
    user: query.data,
    isLoadingUser: query.isLoading,
    userError: query.error,
    refreshUser: query.refetch,
  };
};