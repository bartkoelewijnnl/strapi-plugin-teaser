export default {
    routes: [
        {
            method: 'GET',
            path: '/settings',
            handler: 'settings.getSettings',
            // TODO auth
            config: { policies: [], auth: false }
        },
        {
            method: 'POST',
            path: '/settings',
            handler: 'settings.setSettings',
            // TODO auth
            config: { policies: [], auth: false }
        }
    ]
};
