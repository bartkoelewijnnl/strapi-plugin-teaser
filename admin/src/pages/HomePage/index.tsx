/*
 *
 * HomePage
 *
 */

import React, { useEffect } from 'react';
import pluginId from '../../pluginId';
import useApi from '../../hooks/useApi';

const HomePage = () => {
    const { createTeaserComponent } = useApi();
    
    useEffect(() => {
        createTeaserComponent();
    }, []);

    return (
        <div>
            <h1>{pluginId}&apos;s HomePage</h1>
            <p>Happy coding</p>
        </div>
    );
};

export default HomePage;
