import { useQuery } from '@tanstack/react-query';
import api from '../config/api';

const fetchEvents = async () => {
	const { data } = await api.get(`/device-events`);
	return data;
};

const useGetEvents = () => {
	const query = useQuery({
		queryKey: ['events'],
		queryFn: () => fetchEvents()
	});

	return {
		events: query.data,
		isEventsLoading: query.isLoading,
		eventsError: query.error,
		refreshEvents: query.refetch,
	};
};

export default useGetEvents;