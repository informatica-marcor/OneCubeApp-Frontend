import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';

const createTicketRequest = async (payload) => {
    const formData = new FormData();

    formData.append("subject", payload.subject);
    formData.append("description", payload.description);

    if (payload.images && Array.isArray(payload.images)) {
        payload.images.forEach((image) => {
            formData.append('images', image);
        });
    }

    const { data } = await api.post('/ticket', formData);
    return data;
};

const useCreateTicket = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createTicketRequest,
        onSuccess: (_createdTicket, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
        }
    });

    return {
        createTicket: mutation.mutateAsync,
        isCreatingTicket: mutation.isPending,
        createTicketError: mutation.error,
    };
};

export default useCreateTicket;