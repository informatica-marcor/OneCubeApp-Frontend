import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const authApi = axios.create({
    baseURL: baseURL + '/auth',
    headers: {
        'Content-Type': 'application/json'
    }
});

const codeRequest = async (email) => {
    const { data } = await authApi.post('/request-code', { email: email });
    return data;
};

const validateCodeRequest = async (email, code) => {
    const { data } = await authApi.post('/verify-code', { email, code });
    return data;
};

export const useAuthApi = () => {
  
  const requestMutation = useMutation({
    mutationFn: (email) => codeRequest(email),
    onSuccess: (data) => {
      console.log('Código enviado con éxito:', data);
    },
    onError: (error) => {
      console.error('Error al solicitar código:', error.response?.data?.message);
    }
  });

  const validateMutation = useMutation({
    mutationFn: ({ email, code }) => validateCodeRequest(email, code),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
    }
  });

  return {
    requestCode: requestMutation.mutate,
    isRequesting: requestMutation.isPending,
    requestError: requestMutation.error,
    requestSuccess: requestMutation.isSuccess,
    
    validateCode: validateMutation.mutate,
    isValidating: validateMutation.isPending,
    validateError: validateMutation.error
  };
};