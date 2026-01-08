import { writable } from "svelte/store";

const initialConfig = {
    id: null,
    size: "md",
    component: null,
};

const initialRuntime = {
    open: false,
    params: {},
    instanceKey: 0
};

function createModalStore() {
    const { subscribe, set, update } = writable({
        ...initialConfig,
        ...initialRuntime
    });

    return {
        subscribe,

        setup({ id, size = "md", component, params = {} }) {
            update(m => ({
                ...m,
                id,
                size,
                component,
                params
            }));
        },

        open(params = {}) {
            update(m => ({
                ...m,
                open: true,
                params
            }));
        },

        close() {
            update(m => ({
                ...m,
                open: false
            }));
        },

        /** RESET YANG AMAN */
        resetRuntime() {
            update(m => ({
                ...m,
                open: false,
                params: {},
                instanceKey: m.instanceKey + 1 // 🔥 PAKSA REMOUNT
            }));
        },

        /** HARD RESET (RARE) */
        resetAll() {
            set({
                ...initialConfig,
                ...initialRuntime
            });
        }
    };
}

const modalStore = createModalStore();

export default modalStore;