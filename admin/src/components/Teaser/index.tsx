import React from 'react';
import {
    Card,
    CardBody,
    IconButton,
    CardContent,
    CardTitle,
    CardAction,
    CardSubtitle,
    CardHeader,
    CardAsset,
    CardBadge
} from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import useApi from '../../hooks/useApi';
import { ContentTypeKind } from '@strapi/strapi/lib/types/core/schemas';

interface TeaserProps {
    uid: string;
    contentTypeId: number;
    kind: ContentTypeKind;
    onRemove: (uid: string, contentTypeId: number) => void;
}

const Teaser = ({ uid, contentTypeId, onRemove, kind }: TeaserProps) => {
    const { fetchTeaser } = useApi();
    // TODO slug
    const { data: teaser, loading } = fetchTeaser(uid, contentTypeId, kind, 's');

    if (loading || !teaser) {
        return <>loading...</>;
    }

    return (
        <Card>
            <CardHeader>
                <CardAction position="end">
                    <IconButton onClick={() => onRemove(uid, contentTypeId)} label="TODO" icon={<Trash />} />
                </CardAction>
                <CardAsset src={teaser.image.url} />
            </CardHeader>
            <CardBody>
                <CardContent>
                    <CardTitle>{teaser.title}</CardTitle>
                    <CardSubtitle>{teaser.description}</CardSubtitle>
                </CardContent>
                <CardBadge>
                    <span style={{ textTransform: 'lowercase' }}>
                        {uid} → {teaser.contentTypeId}
                    </span>
                </CardBadge>
            </CardBody>
        </Card>
    );
};

export default Teaser;
