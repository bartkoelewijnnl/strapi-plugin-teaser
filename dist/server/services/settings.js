"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPluginStore = (strapi) => {
    return strapi.store({
        environment: '',
        type: 'plugin',
        name: 'teaser'
    });
};
exports.default = ({ strapi }) => ({
    async createDefaultConfig() {
        const pluginStore = getPluginStore(strapi);
        // TODO call get content types from teaser service.
        const contentTypes = strapi.contentTypes;
        const settings = Object.entries(contentTypes).reduce((a, [uid, value]) => {
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
    async setSettings(settings) {
        const pluginStore = getPluginStore(strapi);
        await pluginStore.set({ key: 'settings', value: settings });
        return pluginStore.get({ key: 'settings' });
    }
});
