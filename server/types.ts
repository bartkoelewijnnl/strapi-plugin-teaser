import { Attributes, ContentTypeKind } from '@strapi/strapi/lib/types/core/schemas';

export interface GetContentType {
    uid: string;
    kind: ContentTypeKind;
    attributes: Attributes;
    displayName: string;
}

export interface Teaser {
    contentTypeId: number;
    id: number;
    title: string;
    description: string;
    image: {
        url: string;
    };
}
