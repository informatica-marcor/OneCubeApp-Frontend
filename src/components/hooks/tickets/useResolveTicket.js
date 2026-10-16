import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';

const resolveTicketRequest = async (payload) => {
  const formData = new FormData();
  formData.append('reply', payload.reply);

  if (payload.images && Array.isArray(payload.images)) {
        payload.images.forEach((image) => {
            formData.append('images', image);
        });
    }

  const { data } = await api.patch(`/tickets/${payload.ticketId}/resolve`, formData);
  return data;
};

const useResolveTicket = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: resolveTicketRequest,
    onSuccess: (_data, ticketId) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId] });
    },
  });

  return {
    resolveTicket: mutation.mutateAsync,
    isResolvingTicket: mutation.isPending,
    resolveTicketError: mutation.error,
  };
};

export default useResolveTicket;