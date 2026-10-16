import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/api';

const renewVisitRequest = async (payload) => {
  
  const body = {
    grantee_user_id: payload.id,
    valid_from: payload.start_date,
    valid_to: payload.end_date,
  };

  const { data } = await api.post(`/access_permission`, body);
  return data;
};

const useRenewVisit = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: renewVisitRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },

  });

  return {
    renewVisit: mutation.mutateAsync,
    isRenewingVisit: mutation.isPending,
    renewVisitError: mutation.error,
  };
};

export default useRenewVisit;