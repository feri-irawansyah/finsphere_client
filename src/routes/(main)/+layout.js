export const load = async ({ fetch, parent }) => {
    return {
        session: parent.session
    };
};