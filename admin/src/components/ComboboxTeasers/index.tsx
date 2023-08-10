import React, { PropsWithChildren, useMemo } from 'react';
import { Combobox, ComboboxOption } from '@strapi/design-system';
import useApi from '../../hooks/useApi';
import { TeaserFieldValue } from '../TeaserField';
import { ContentTypeKind } from '@strapi/strapi/lib/types/core/schemas';

interface ComboboxTeasersProps {
    uid: string;
    value: TeaserFieldValue;
    kind: ContentTypeKind;
    onChange: (id: number | string) => void;
}

const PLACEHOLDER = 'Select a teaser';

const ComboboxTeasers = ({ uid, value, kind, onChange }: ComboboxTeasersProps) => {
    const { fetchTeasers } = useApi();
    // TODO error, slug
    const { data: teasers = [], error, loading } = fetchTeasers(uid, kind, 's');

    // Render
    const availableTeasers = useMemo(
        () => teasers.filter((teaser) => (uid && !value) || (uid && value && !value.contentTypes[uid]?.includes(teaser.contentTypeId))),
        [teasers, value]
    );

    if (!Boolean(availableTeasers.length)) {
        return <Combobox placeholder="No teasers available for content type." disabled />;
    }

    return (
        <Combobox placeholder="Select a teaser" loading={loading} onChange={onChange}>
            {availableTeasers.map((teaser) => (
                <ComboboxOption key={`${teaser.contentTypeId}-${teaser.id}`} value={teaser.contentTypeId}>
                    {teaser.title}
                </ComboboxOption>
            ))}
        </Combobox>
    );
};

const ComboboxTeasersWrapper = ({
    children,
    uid,
    kind,
    ...props
}: PropsWithChildren<Omit<ComboboxTeasersProps, 'uid' | 'kind'> & { uid: string | null; kind?: ContentTypeKind }>) => {
    if (!uid || !kind) {
        return <Combobox placeholder="Select content type first" disabled />;
    }

    return <ComboboxTeasers uid={uid} kind={kind} {...props} />;
};

export default ComboboxTeasersWrapper;
