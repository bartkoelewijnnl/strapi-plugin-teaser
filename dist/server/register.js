"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("../admin/src/pluginId"));
const path_1 = __importDefault(require("path"));
exports.default = ({ strapi }) => {
    strapi.customFields.register({
        name: 'teaser',
        plugin: pluginId_1.default,
        type: 'json'
    });
    const extensionService = strapi.service('plugin::graphql.extension');
    // TODO add settings for slug → prefix etc.
    extensionService === null || extensionService === void 0 ? void 0 : extensionService.use(({ strapi }) => ({
        typeDefs: `
            type ComponentSharedTeaser {
                slug: String
            }

            type ComponentSharedTeasers {
                render: [ComponentSharedTeaser]!
            }
        `,
        resolvers: {
            ComponentSharedTeasers: {
                render: async (parent) => {
                    var _a;
                    const settings = await strapi.plugin('teaser').service('settings').getSettings();
                    if (!((_a = parent.teasers) === null || _a === void 0 ? void 0 : _a.contentTypes)) {
                        return [];
                    }
                    const entries = await Promise.all(Object.entries(parent.teasers.contentTypes).flatMap(([contenType, ids]) => ids.map(async (id) => {
                        const entity = await strapi.entityService.findOne(contenType, id, {
                            populate: { teaser: true }
                        });
                        const slugPrefix = settings[contenType].slugPrefix;
                        const slug = path_1.default.join(...['/', slugPrefix, entity.slug].filter(Boolean));
                        return { ...entity.teaser, slug };
                    })));
                    return entries;
                }
            }
        },
        resolversConfig: {
            'ComponentSharedTeasers.render': {
                auth: false
            }
        }
    }));
};
