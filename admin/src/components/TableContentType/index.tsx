import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Tr, Typography, Td, TextInput, Table, Thead, Th, Tbody } from '@strapi/design-system';
import { Settings } from '../../../../server/types';
import { ContentTypeKind } from '@strapi/strapi/lib/types/core/schemas';
import useApi from '../../hooks/useApi';

interface TableContentTypeProps {
    settings: Settings;
    kind: ContentTypeKind;
}

const TableContentType = ({ settings, kind }: TableContentTypeProps) => {
    const { saveSettings } = useApi();

    // Render.
    const data: Settings = useMemo(
        () => Object.entries(settings).reduce((a, [uid, setting]) => (setting.kind === kind ? { ...a, [uid]: setting } : a), {}),
        [settings]
    );

    // Methods:
    // TODO debounce
    const handleOnChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>, uid: string) => {
            const { value: slugPrefix } = e.target;
            const newData: Settings = {
                ...settings,
                [uid]: {
                    ...settings[uid],
                    slugPrefix
                }
            };

            saveSettings(newData);
            console.log({ newData, uid });
        },
        [data]
    );

    return (
        <Table colCount={2} rowCount={Object.keys(data).length}>
            <Thead>
                <Tr>
                    <Th>
                        <Typography variant="sigma">Collection type</Typography>
                    </Th>
                    <Th>
                        <Typography variant="sigma">Slug prefix</Typography>
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                {Object.entries(data).map(([uid, setting]) => (
                    <Tr key={uid}>
                        <Td>
                            <Typography textColor="neutral800">{uid}</Typography>
                        </Td>
                        <Td>
                            <TextInput
                                id={uid}
                                name={uid}
                                aria-label="Slug prefix"
                                defaultValue={setting.slugPrefix}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleOnChange(e, uid)}
                                hint={`eg. ${kind === 'collectionType' ? '/articles' : '/contact'}`}
                            />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default TableContentType;
