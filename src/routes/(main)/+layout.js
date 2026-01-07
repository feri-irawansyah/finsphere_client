import fetcher from '$lib/fetcher.js';

export const load = async ({ fetch, parent }) => {
    
    const data = await parent();

    const menus = await fetcher(fetch, '/api/platform/console/menus');

    if(menus.length > 0) {
        return {
            menus: menus,
            session: data.session,
            title: 'Dashboard'
        };
    }

    return {
        session: data.session,
        title: 'Dashboard'
    };
};