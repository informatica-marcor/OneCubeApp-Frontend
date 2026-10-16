import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';

const getUserPhotoRequest = async (userId) => {
    const { data } = await api.get(`/user/${userId}/photo`);
    return data;
};

export const useGetUserPhoto = (userId) => {
    const query = useQuery({
        queryKey: ['photo', userId],
        queryFn: () => getUserPhotoRequest(userId),
        enabled: !!userId,
    });

    return {
        userPhoto: query.data,
        isUserPhotoLoading: query.isLoading,
        userPhotoError: query.error,
        refreshUserPhoto: query.refetch,
    };
};