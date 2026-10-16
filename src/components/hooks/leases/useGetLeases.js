import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';
import { leaseKeys } from '../keys';

const fetchUserLeases = async (userId) => {
	const { data } = await api.get(`/users/${userId}/leases`);
	return data;
};

const useGetLeases = (userId) => {
	const query = useQuery({
		queryKey: ['leases', userId],
		queryFn: () => fetchUserLeases(userId),
		enabled: Boolean(userId),
	});

	return {
		leases: query.data,
		isLeasesLoading: query.isLoading,
		leasesError: query.error,
		refreshLeases: query.refetch,
	};
};

export default useGetLeases;