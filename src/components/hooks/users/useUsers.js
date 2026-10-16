import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../../services/users';

const USERS_QUERY_KEY = ['users', 'clients'];

export const useUsers = (userId = null) => {
  const queryClient = useQueryClient();

  // 1. Obtener lista de clientes
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: userService.get_clients,
  });

  // 2. Obtener detalles de un usuario
  const userDetails = useQuery({
    queryKey: ['users', 'client', userId],
    queryFn: () => userService.get_client(userId),
    enabled: !!userId,
  });

  const createClientMutation = useMutation({
    mutationFn: userService.create_client,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  const createVisitMutation = useMutation({
    mutationFn: userService.create_visit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, payload }) => userService.update_user(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => userService.delete_user(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  return {
    users: data,
    loading: isLoading,
    error,
    refreshUsers: refetch,

    singleUser: userDetails.data,
    isLoadingUser: userDetails.isLoading,
    userError: userDetails.error,

    createClient: createClientMutation.mutateAsync,
    isCreatingClient: createClientMutation.isPending,
    createClientError: createClientMutation.error,

    createVisit: createVisitMutation.mutateAsync,
    isCreatingVisit: createVisitMutation.isPending,
    createVisitError: createVisitMutation.error,

    updateUser: updateUserMutation.mutateAsync,
    isUpdatingUser: updateUserMutation.isPending,
    updateUserError: updateUserMutation.error,

    deleteUser: deleteUserMutation.mutateAsync,
    isDeletingUser: deleteUserMutation.isPending,
    deleteUserError: deleteUserMutation.error,
  };
};