// ================================
// Store global modal
// ================================

import { writable } from "svelte/store";

const modalStore = writable({
    open: false,
    id: null,
    size: 'md',
    component: null,
    params: {}
});

export function setModal({ id, size = 'md', component, params = {} }) {
    modalStore.set({
        open: true,
        id,
        size,
        component,
        params
    });
}

export function closeModal() {
    modalStore.set({
        open: false,
        id: null,
        size: 'md',
        component: null,
        params: {}
    });
}

export default modalStore;
