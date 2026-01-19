import { writable } from "svelte/store";
import fetcher from "$lib/fetcher";
import Swal from "sweetalert2";

function createOrderStore() {
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

const orderStore = createOrderStore();

export default orderStore;