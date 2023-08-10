import { Reducer, useCallback, useReducer } from 'react';
import { LoadingModel } from '../types';

type ReducerAction<T> = { type: 'error'; error: Error } | { type: 'data'; data: T };

const reducer = <T extends object>(state: LoadingModel<T>, action: ReducerAction<T>): LoadingModel<T> => {
    switch (action.type) {
        case 'error':
            return {
                ...state,
                error: action.error,
                loading: false,
                data: undefined
            };
        case 'data':
            return {
                ...state,
                error: undefined,
                loading: false,
                data: action.data
            };
        default:
            return state;
    }
};

const useLoadingModel = <T extends object>(): { state: LoadingModel<T>; setError: (error: Error) => void; setData: (data: T) => void } => {
    const [state, dispatch] = useReducer<Reducer<LoadingModel<T>, ReducerAction<T>>>(reducer, {
        data: undefined,
        loading: true,
        error: undefined
    });

    // Methods.
    const setError = useCallback((error: Error) => {
        dispatch({ type: 'error', error });
    }, []);

    const setData = useCallback((data: T) => {
        dispatch({ type: 'data', data });
    }, []);

    return {
        state,
        setError,
        setData
    };
};

export default useLoadingModel;
