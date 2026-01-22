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


// Previous code kept for reference
// import fetcher from '$lib/fetcher.js';

// export const load = async ({ fetch, parent }) => {
//     const data = await parent();

//     let menus = [];

//     try {
//         menus = await fetcher(fetch, '/api/platform/console/menus');
//     } catch (e) {
//         console.error('Failed to load menus', e);
//     }

//     return {
//         menus,
//         session: data?.session ?? null,
//         title: 'Dashboard'
//     };
// };