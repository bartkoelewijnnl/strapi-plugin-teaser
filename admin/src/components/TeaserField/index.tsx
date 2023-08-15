import React, { useCallback, useMemo, useState } from 'react';
import { Select, Option, Flex, Box, Field, FieldLabel, GridLayout } from '@strapi/design-system';
import useApi from '../../hooks/useApi';
import TeaserComponent from '../Teaser';
import ComboboxTeasers from '../ComboboxTeasers';
import { GetContentType } from '../../../../server/types';
import { ContentTypeKind } from '@strapi/strapi/lib/types/core/schemas';
import { TeaserFieldValue } from '../../types';

interface TeaserFieldProps {
    value?: string | null;
    onChange: (value: { target: { name: string; type: string; value: string } }) => void;
    name: string;
}

const getKind = (contentTypes: GetContentType[], uid: string): ContentTypeKind => {
    return contentTypes.find((contentType) => contentType.uid === uid)?.kind ?? 'collectionType';
};


const TeaserField = ({ value: initialValue, name, onChange }: TeaserFieldProps) => {
    const value: TeaserFieldValue = useMemo(() => initialValue && JSON.parse(initialValue), [initialValue]);
    const [uid, setUid] = useState<string | null>(null);

    // API / Data.
    const { fetchContentTypes } = useApi();
    const { data: contentTypes = [], loading: loadingContentTypes } = fetchContentTypes();

    // Methods.
    const reset = useCallback(() => {
        setUid(null);
    }, []);

    const update = useCallback(
        (value: TeaserFieldValue) => {
            onChange({ target: { name, type: 'json', value: JSON.stringify(value) } });
        },
        [onChange]
    );

    const updateContentTypes = useCallback(
        (contentTypes: { [uid: string]: number[] }) => {
            update({ ...value, contentTypes });
        },
        [value, onChange]
    );

    const removeSelectedTeaser = (uid: string, contentTypeId: number) => {
        // When there is nothing to remove.
        if (!value?.contentTypes[uid].includes(contentTypeId)) {
            return;
        }

        const teasers = [...value.contentTypes[uid]];
        const teaserIndex = teasers.indexOf(contentTypeId);

        if (teaserIndex === -1) {
            return;
        }

        teasers.splice(teaserIndex, 1);
        const newContentTypes = { ...value.contentTypes, [uid]: teasers };

        updateContentTypes(newContentTypes);
        reset();
    };

    const handleOnContentTypeChange = async (uid: string) => {
        const contentType = contentTypes?.find((ct) => ct.uid === uid);

        if (!contentType) {
            return;
        }

        setUid(uid);
    };

    const handleOnContentTypeIdChange = (id: number | string) => {
        const contentType = contentTypes?.find((ct) => ct.uid === uid);

        if (!contentType || !uid) {
            return;
        }

        const newContentTypes = {
            ...(value?.contentTypes ?? {}),
            [uid]: [...(value?.contentTypes[uid] ?? []), typeof id === 'number' ? id : parseInt(id)]
        };

        updateContentTypes(newContentTypes);
        reset();
    };

    // Render.
    const selectedContentType = useMemo(() => contentTypes.find((contentType) => contentType.uid === uid), [contentTypes, uid]);
    const selectedTeasers = useMemo(
        () => (value ? Object.entries(value.contentTypes).flatMap(([uid, ids]) => ids.map((id) => ({ contentTypeId: id, uid }))) : []),
        [value]
    );

    return (
        <>
            {/* // TODO required/not */}
            <Field name={name} required={false}>
                <FieldLabel>{name}</FieldLabel>
                <Flex gap={4}>
                    <Box grow={1}>
                        <Select
                            placeholder="Select or enter a content type."
                            value={uid}
                            loading={loadingContentTypes}
                            onChange={handleOnContentTypeChange}
                            onClear={reset}
                        >
                            {contentTypes.map((contentType) => (
                                <Option key={contentType.uid} value={contentType.uid}>
                                    {contentType.displayName}
                                </Option>
                            ))}
                        </Select>
                    </Box>
                    <Box grow={1}>
                        <ComboboxTeasers kind={selectedContentType?.kind} uid={uid} value={value} onChange={handleOnContentTypeIdChange} />
                    </Box>
                </Flex>
            </Field>
            <GridLayout>
                {selectedTeasers.map((t) => (
                    <TeaserComponent
                        kind={getKind(contentTypes, t.uid)}
                        key={`${t.uid}-${t.contentTypeId}`}
                        onRemove={removeSelectedTeaser}
                        uid={t.uid}
                        contentTypeId={t.contentTypeId}
                    />
                ))}
            </GridLayout>
        </>
    );
};

export default TeaserField;
