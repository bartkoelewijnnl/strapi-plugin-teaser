import { Strapi } from '@strapi/strapi';
import { ContentType, ContentTypeKind } from '@strapi/strapi/lib/types/core/schemas';
import { Settings } from '../types';

const getPluginStore = (strapi: Strapi) => {
    return strapi.store({
        environment: '',
        type: 'plugin',
        name: 'teaser'
    });
};

export default ({ strapi }: { strapi: Strapi }) => ({
    async createDefaultConfig() {
        const pluginStore = getPluginStore(strapi);

        // TODO call get content types from teaser service.
        const contentTypes = strapi.contentTypes as { [key: string]: ContentType };
        const settings = Object.entries(contentTypes).reduce<Settings>((a, [uid, value]) => {
            if (!uid.includes('api::')) {
                return a;
            }

            a[uid] = {
                slugPrefix: '',
                kind: value.kind
            };

            return a;
        }, {});

        await pluginStore.set({ key: 'settings', value: settings });
        return pluginStore.get({ key: 'settings' });
    },

    async getSettings() {
        const pluginStore = getPluginStore(strapi);
        const config = await pluginStore.get({ key: 'settings' });

        if (!config) {
            return this.createDefaultConfig();
        }

        return config;
    },
    async setSettings(settings: Settings) {
        const pluginStore = getPluginStore(strapi);

        await pluginStore.set({ key: 'settings', value: settings });
        return pluginStore.get({ key: 'settings' });
    }
});
