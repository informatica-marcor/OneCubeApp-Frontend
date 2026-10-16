import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';

const fetchTickets = async (ticket_id) => {
	const { data } = await api.get(`/tickets/${ticket_id}`);
	return data;
};

const useGetTicket = (ticket_id) => {
	const query = useQuery({
		queryKey: ['tickets', ticket_id],
		queryFn: () => fetchTickets(ticket_id),
		enabled: Boolean(ticket_id),
		
	});

	return {
		ticket: query.data,
		isTicketLoading: query.isLoading,
		TicketError: query.error,
		refreshTicket: query.refetch,
	};
};

export default useGetTicket;