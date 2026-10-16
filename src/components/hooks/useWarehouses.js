import { useQuery } from '@tanstack/react-query';
import api from '../config/api';

const getWarehousesRequest = async () => {
  const { data } = await api.get('/summary');
  return data;
};

export const useWarehouses = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['warehouses'],
    queryFn: getWarehousesRequest,
  });

  return {
    warehouses: data ?? [],
    isWarehousesloading: isLoading,
    warehousesError: error,
    refreshWarehouses: refetch
  };
};