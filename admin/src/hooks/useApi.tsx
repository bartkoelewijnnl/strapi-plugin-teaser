import { useFetchClient } from '@strapi/helper-plugin';
import { GetContentType, Settings, Teaser } from '../../../server/types';
import pluginId from '../pluginId';
import { ContentTypeKind } from '@strapi/strapi/lib/types/core/schemas';
import { useGet } from './useGet';
import { LoadingModel } from '../types';

const useApi = () => {
    const { post } = useFetchClient();

    const fetchTeasers = (uid: string, kind: ContentTypeKind, slug?: string): LoadingModel<Teaser[]> => {
        const params = slug ? `kind=${kind}&slug=${slug}` : `kind=${kind}`;
        return useGet<Teaser[]>(`/${pluginId}/teasers/${uid}?${params}`);
    };

    const fetchTeaser = (uid: string, id: number | string, kind: ContentTypeKind, slug?: string): LoadingModel<Teaser> => {
        const params = slug ? `kind=${kind}&slug=${slug}` : `kind=${kind}`;
        return useGet<Teaser>(`/${pluginId}/teasers/${uid}/${id}?${params}`);
    };

    const fetchContentTypes = (): LoadingModel<GetContentType[]> => {
        return useGet<GetContentType[]>(`/${pluginId}/content-types`);
    };

    const fetchSettings = (): LoadingModel<Settings> => {
        return useGet<Settings>(`/${pluginId}/settings`);
    };

    // TODO diff type any
    const createTeaserComponent = async (): Promise<any> => {
        return (await post(`/${pluginId}/component`, {})).data;
    };

    const saveSettings = async (settings: Settings): Promise<Settings> => {
        return (await post(`/${pluginId}/settings`, settings)).data;
    };

    return {
        fetchContentTypes,
        fetchTeasers,
        fetchTeaser,
        createTeaserComponent,

        // Settings:
        fetchSettings,
        saveSettings
    };
};

export default useApi;
