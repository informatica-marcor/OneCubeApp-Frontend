import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';

const fetchTickets = async () => {
	const { data } = await api.get(`/tickets`);
	return data;
};

const useGetTickets = () => {
	const query = useQuery({
		queryKey: ['tickets'],
		queryFn: () => fetchTickets(),
		
	});

	return {
		tickets: query.data,
		isTicketsLoading: query.isLoading,
		TicketsError: query.error,
		refreshTickets: query.refetch,
	};
};

export default useGetTickets;