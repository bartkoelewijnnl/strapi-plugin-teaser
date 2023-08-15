"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore, does have exported member errors.
const utils_1 = require("@strapi/utils");
const FIELDS = [];
const POPULATE = ['teaser.*', 'teaser.image.*'];
const getFields = (kind) => {
    return kind === 'collectionType' ? ['slug', ...FIELDS] : FIELDS;
};
const getEntries = async (uid, kind) => {
    const entries = await strapi.entityService.findMany(uid, { fields: getFields(kind), populate: POPULATE });
    return Array.isArray(entries) ? entries : [entries];
};
const getEntry = async (uid, id, kind) => {
    return await strapi.entityService.findOne(uid, id, { fields: getFields(kind), populate: POPULATE });
};
const transformEntryTeaser = (entry) => {
    return {
        contentTypeId: entry.id,
        ...entry.teaser
    };
};
exports.default = ({ strapi }) => ({
    async getContentTypes() {
        const contentTypes = strapi.contentTypes;
        return Promise.all(await Object.entries(contentTypes).reduce(async (a, [uid, value]) => {
            if (!uid.includes('api::')) {
                return a;
            }
            if (!((Object.keys(value.attributes).includes('teaser') &&
                value.attributes['teaser'].type === 'component' &&
                value.attributes['teaser'].component === 'shared.teaser')
            // Object.keys(value.attributes).includes("description") &&
            // value.attributes["description"].type === "string"
            )) {
                return a;
            }
            const entries = await strapi.entityService.findMany(value.uid).catch(() => []);
            return [
                ...(await a),
                {
                    uid: value.uid,
                    kind: value.kind,
                    displayName: value.info.displayName,
                    attributes: {
                        teaser: value.attributes['teaser']
                    },
                    entries: entries && Array.isArray(entries) ? entries.map((e) => e.id) : []
                }
            ];
        }, Promise.resolve([])));
    },
    async getTeasers(uid, kind, slug) {
        if (!uid.includes('api::')) {
            return [];
        }
        if (!kind || !['singleType', 'collectionType'].includes(kind)) {
            throw new Error('please provide query param "kind", with the value of "singleType" or "collectionType".');
        }
        if (kind === 'singleType' && !slug) {
            throw new Error('please provide query param "slug", when kind is of "collectionType".');
        }
        strapi.log.debug(uid);
        try {
            return (await getEntries(uid, kind)).map((entry) => transformEntryTeaser(entry));
        }
        catch (error) {
            strapi.log.debug(error.message);
            return [];
        }
    },
    async createTeaserComponent() {
        const contentTypes = strapi.contentTypes;
        // console.log(contentTypes)
        // if (contentTypes['shared.teaser'] && contentTypes['shared.teasers']) {
        //     return null;
        // }
        // try {
        //     const res = await strapi.plugin('content-type-builder').services.components.createComponent({
        //         component: {
        //             category: 'shared',
        //             displayName: teasers.info.displayName,
        //             icon: teasers.info.icon,
        //             attributes: teasers.attributes
        //         },
        //         components: [
        //             {
        //                 category: 'shared',
        //                 displayName: teaser.info.displayName,
        //                 icon: teaser.info.icon,
        //                 attributes: teaser.attributes
        //             }
        //         ]
        //     });
        //     return res;
        // } catch (error) {
        //     console.log(error);
        // }
    },
    async getTeaser(uid, id, kind, slug) {
        if (!uid.includes('api::')) {
            throw new utils_1.errors.NotFoundError('Teaser does not exist.');
        }
        if (!kind || !['singleType', 'collectionType'].includes(kind)) {
            throw new Error('please provide query param "kind", with the value of "singleType" or "collectionType".');
        }
        if (kind === 'singleType' && !slug) {
            throw new Error('please provide query param "slug", when kind is of "collectionType".');
        }
        try {
            return transformEntryTeaser(await getEntry(uid, id, kind));
        }
        catch (error) {
            throw new utils_1.errors.NotFoundError('Teaser does not exist.');
        }
    }
});
