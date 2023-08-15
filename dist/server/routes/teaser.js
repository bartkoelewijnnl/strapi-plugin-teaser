"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/content-types',
            handler: 'teaser.getContentTypes',
            config: {
                auth: false,
                policies: []
            }
        },
        {
            method: 'GET',
            path: '/teasers/:uid',
            handler: 'teaser.getTeasers',
            config: {
                auth: false,
                policies: []
            }
        },
        {
            method: 'GET',
            path: '/teasers/:uid/:id',
            handler: 'teaser.getTeaser',
            config: {
                auth: false,
                policies: []
            }
        },
        {
            method: 'POST',
            path: '/component',
            handler: 'teaser.createTeaserComponent',
            config: {
                auth: false,
                policies: []
            }
        }
    ]
};
