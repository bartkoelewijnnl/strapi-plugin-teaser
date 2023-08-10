import { useCallback, useEffect } from 'react';
import { LoadingModel } from '../types';
import useLoadingModel from './useLoadingModel';
import { useFetchClient } from '@strapi/helper-plugin';

export const useGet = <T extends object>(url: string): LoadingModel<T> => {
    const { get } = useFetchClient();
    const { state, setError, setData } = useLoadingModel<T>();

    const fetch = useCallback(async () => {
        try {
            const data = (await get(url)).data;
            setData(data);
        } catch (error) {
            setError(error as Error);
        }
    }, [url, setData, setError]);

    // Life cycle.
    useEffect(() => {
        fetch();
    }, [url]);

    return state;
};
