import { GetContentType, Teaser } from '../types';
import { Strapi } from '@strapi/strapi';
import { ContentType, ContentTypeKind } from '@strapi/strapi/lib/types/core/schemas';
import teaser from '../components/teaser.json';
// @ts-ignore, does have exported member errors.
import { errors } from '@strapi/utils';

const FIELDS = [];
const POPULATE = ['teaser.*', 'teaser.image.*'];

type EntryTeaser = { id: number; kind: ContentTypeKind; teaser: Omit<Teaser, 'contentTypeId'> };

const getFields = (kind: ContentTypeKind): string[] => {
    return kind === 'collectionType' ? ['slug', ...FIELDS] : FIELDS;
};

const getEntries = async <T extends object>(uid: string, kind: ContentTypeKind): Promise<T[]> => {
    const entries: T[] = await strapi.entityService.findMany(uid, { fields: getFields(kind), populate: POPULATE });
    return Array.isArray(entries) ? entries : [entries];
};

const getEntry = async <T extends object>(uid: string, id: number, kind: ContentTypeKind): Promise<T> => {
    return await strapi.entityService.findOne(uid, id, { fields: getFields(kind), populate: POPULATE });
};

const transformEntryTeaser = (entry: EntryTeaser): Teaser => {
    return {
        contentTypeId: entry.id,
        ...entry.teaser
    };
};

export default ({ strapi }: { strapi: Strapi }) => ({
    async getContentTypes(): Promise<GetContentType[]> {
        const contentTypes = strapi.contentTypes as { [key: string]: ContentType };

        return Promise.all<GetContentType[]>(
            await Object.entries(contentTypes).reduce<Promise<GetContentType[]>>(async (a, [uid, value]) => {
                if (!uid.includes('api::')) {
                    return a;
                }

                if (
                    !(
                        (
                            Object.keys(value.attributes).includes('teaser') &&
                            value.attributes['teaser'].type === 'component' &&
                            value.attributes['teaser'].component === 'shared.teaser'
                        )
                        // Object.keys(value.attributes).includes("description") &&
                        // value.attributes["description"].type === "string"
                    )
                ) {
                    return a;
                }

                const entries: [{ id: number }] = await strapi.entityService.findMany(value.uid).catch(() => []);

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
            }, Promise.resolve([]))
        );
    },

    async getTeasers(uid: string, kind?: ContentTypeKind, slug?: string): Promise<Teaser[]> {
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
            return (await getEntries<EntryTeaser>(uid, kind)).map((entry) => transformEntryTeaser(entry));
        } catch (error) {
            strapi.log.debug(error.message);
            return [];
        }
    },
    async createTeaserComponent() {
        const contentTypes = strapi.contentTypes as { [key: string]: ContentType };

        if (contentTypes['shared.teaser']) {
            return null;
        }

        try {
            const res = await strapi.plugin('content-type-builder').services.components.createComponent({
                component: {
                    category: 'shared',
                    displayName: teaser.info.displayName,
                    icon: teaser.info.icon,
                    attributes: teaser.attributes
                }
            });

            return res;
        } catch (error) {
            console.log(error);
        }
    },
    async getTeaser(uid: string, id: number, kind?: ContentTypeKind, slug?: string): Promise<Teaser | null> {
        if (!uid.includes('api::')) {
            throw new errors.NotFoundError('Teaser does not exist.');
        }

        if (!kind || !['singleType', 'collectionType'].includes(kind)) {
            throw new Error('please provide query param "kind", with the value of "singleType" or "collectionType".');
        }

        if (kind === 'singleType' && !slug) {
            throw new Error('please provide query param "slug", when kind is of "collectionType".');
        }

        try {
            return transformEntryTeaser(await getEntry<EntryTeaser>(uid, id, kind));
        } catch (error) {
            throw new errors.NotFoundError('Teaser does not exist.');
        }
    }
});
