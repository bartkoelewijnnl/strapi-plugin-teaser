import { Strapi } from '@strapi/strapi';
import pluginId from '../admin/src/pluginId';
import { TeaserFieldValue } from '../admin/src/types';
import { Settings } from './types';
import path from 'path';

export default ({ strapi }: { strapi: Strapi }) => {
    strapi.customFields.register({
        name: 'teaser',
        plugin: pluginId,
        type: 'json'
    });

    const extensionService = strapi.service('plugin::graphql.extension');

    // TODO add settings for slug → prefix etc.
    extensionService?.use(({ strapi }) => ({
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
                render: async (parent: { teasers: TeaserFieldValue }) => {
                    const settings: Settings = await strapi.plugin('teaser').service('settings').getSettings();

                    if (!parent.teasers?.contentTypes) {
                        return [];
                    }

                    const entries = await Promise.all(
                        Object.entries(parent.teasers.contentTypes).flatMap(([contenType, ids]) =>
                            ids.map(async (id) => {
                                const entity = await strapi.entityService.findOne(contenType, id, {
                                    populate: { teaser: true }
                                });

                                const slugPrefix = settings[contenType].slugPrefix;
                                const slug = path.join(...['/', slugPrefix, entity.slug].filter(Boolean));

                                return { ...entity.teaser, slug };
                            })
                        )
                    );

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
