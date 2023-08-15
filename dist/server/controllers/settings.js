'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async getSettings(ctx) {
        try {
            ctx.body = await strapi.plugin('teaser').service('settings').getSettings();
        }
        catch (error) {
            ctx.throw(500, error);
        }
    },
    async setSettings(ctx) {
        const { body } = ctx.request;
        try {
            await strapi.plugin('teaser').service('settings').setSettings(body);
            ctx.body = await strapi.plugin('teaser').service('settings').getSettings();
        }
        catch (err) {
            ctx.throw(500, err);
        }
    }
});
