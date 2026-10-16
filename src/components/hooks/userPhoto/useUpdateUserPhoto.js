import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api';

const updateUserPhotoRequest = async ({ userId, file }) => {
    const formData = new FormData();
    formData.append('user_id', String(userId));
    formData.append('photo', file);

    const { data } = await api.patch('/photo', formData);
    return data;
};

export const useUpdateUserPhoto = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateUserPhotoRequest,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['photo', variables.userId],
            });
        },
    });

    return {
        updatePhoto: mutation.mutateAsync,
        isUpdatingPhoto: mutation.isPending,
        updatePhotoError: mutation.error,
    };
};