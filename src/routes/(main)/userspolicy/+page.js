import modalStore from '$lib/directives/modal/functions/modal-store.js';
import ModalUsers from "$lib/components/molecules/modals/ModalUsers.svelte";

export const load = ({ parent }) => {

    const metaPage = {
        title: 'User Policy',
        tableName: 'userpolicy',
    }

    return metaPage;
}