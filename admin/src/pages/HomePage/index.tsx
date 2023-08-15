/*
 *
 * HomePage
 *
 */

import React, { ChangeEvent, useCallback, useEffect } from 'react';
import useApi from '../../hooks/useApi';

import { Box } from '@strapi/design-system/Box';
import { Tabs, Tab, Tr, Typography, TabGroup, TabPanels, TabPanel, Td, TextInput, Table, Thead, Th, Tbody } from '@strapi/design-system';
import { Settings } from '../../../../server/types';
import TableContentType from '../../components/TableContentType';

const HomePage = () => {
    const { createTeaserComponent, fetchSettings } = useApi();

    const { data, loading } = fetchSettings();

    useEffect(() => {
        createTeaserComponent();
    }, []);

    // Methods:
    if (!data) {
        return <p>loading todo</p>;
    }

    // Render.
    return (
        <Box padding={8}>
            <TabGroup label="Some stuff for the label" id="tabs">
                <Tabs>
                    <Tab>Collection types</Tab>
                    <Tab>Single types</Tab>
                </Tabs>
                <TabPanels>
                    <TabPanel>
                        <TableContentType settings={data} kind="collectionType" />
                    </TabPanel>
                    <TabPanel>
                        <TableContentType settings={data} kind="singleType" />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </Box>
    );
};

export default HomePage;
