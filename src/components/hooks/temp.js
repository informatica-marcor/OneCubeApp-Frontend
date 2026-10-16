import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';
// Es buena práctica importar las llaves del archivo donde se definen las visitas
import { visitKeys } from './useGetVisits'; 

const createVisitRequest = async (payload) => {
    const formData = new FormData();

    // Usamos un bucle para limpiar el código si todos los campos van al FormData
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    });

    const { data } = await api.post("/users/visit", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};

export const useCreateVisit = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createVisitRequest,
    onSuccess: () => {
      // IMPORTANTE: Invalidamos 'visits' para que la lista se refresque
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      
      // Si también quieres invalidar la lista de clientes, puedes hacerlo:
      // queryClient.invalidateQueries({ queryKey: ['users', 'clients'] });
    },
  });

  return {
    createVisit: mutation.mutateAsync,
    isCreatingVisit: mutation.isPending,
    createVisitError: mutation.error,
  };
};