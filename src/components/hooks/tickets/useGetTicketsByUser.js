import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';

const fetchTickets = async (userId) => {
	const { data } = await api.get(`/tickets/users/${userId}`);
	return data;
};

const useGetTicketsByUser = (userId) => {
	const query = useQuery({
		queryKey: ['tickets', userId],
		queryFn: () => fetchTickets(userId),
		enabled: Boolean(userId),
	});

	return {
		tickets: query.data,
		isTicketsLoading: query.isLoading,
		TicketsError: query.error,
		refreshTickets: query.refetch,
	};
};

export default useGetTicketsByUser;