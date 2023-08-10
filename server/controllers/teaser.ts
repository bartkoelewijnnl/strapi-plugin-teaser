import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
    async getContentTypes(ctx) {
        try {
            ctx.body = await strapi.plugin('teaser').service('teaser').getContentTypes();
        } catch (error) {}
    },
    async getTeasers(ctx) {
        const { uid } = ctx.params;
        const { kind, slug } = ctx.request.query;

        try {
            ctx.body = await strapi.plugin('teaser').service('teaser').getTeasers(uid, kind, slug);
        } catch (error) {}
    },
    async getTeaser(ctx) {
        const { uid, id } = ctx.params;
        const { kind, slug } = ctx.request.query;

        try {
            ctx.body = await strapi.plugin('teaser').service('teaser').getTeaser(uid, id, kind, slug);
        } catch (error) {}
    },
    async createTeaserComponent(ctx) {
        // @ts-ignore, is watching does exist.
        strapi.reload.isWatching = false;

        try {
            const data = await strapi.plugin('teaser').service('teaser').createTeaserComponent();

            if (data) {
                setImmediate(() => strapi.reload());
            }

            ctx.body = data;
        } catch (error) {}
    }
});
