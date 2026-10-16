import { useQuery } from '@tanstack/react-query';
import api from '../../../config/api';

const getVisitsRequest = async (id) => {
  const { data } = await api.get(`/users/${id}/visits`)
  return data;
};

const useGetVisits = ( userId ) => {
  const query = useQuery({
    queryKey: ['visits', userId],
    queryFn: () => getVisitsRequest(userId),
    enabled: !!userId,
  });

  return {
    visits: query.data,
    isVisitsLoading: query.isLoading,
    visitsError: query.error,
    refreshVisits: query.refetch,
  };
};

export default useGetVisits;