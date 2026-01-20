import { writable } from "svelte/store";
import fetcher from "$lib/fetcher";
import Swal from "sweetalert2";

function createGridStore() {
    const { subscribe, update, set } = writable({
        stockId: null
    });

    return {
        subscribe,
        setup(payload) {
            update((state) => ({
                ...state,
                ...payload
            }));
        },
        reset() {
            set({});
        }
    };
}

const datagridStore = createGridStore();

export default datagridStore;