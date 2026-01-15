import { writable } from "svelte/store";
import fetcher from "$lib/fetcher";
import Swal from "sweetalert2";

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

export async function submitDataModal(e, payload, url, method) {
 
    try {
        //   if (URLMethod == "PUT")
        //     data[PKName] = formData[PKName];
 
        console.log("axaa 1");
 
        const rst = await fetcher(fetch, url, {
            method: method,
            body: JSON.stringify(payload),
        });
 
        console.log("axaa 2", rst);
 
        let footerMessage = "";
 
        if (rst.message) {
            if (rst.ref.length > 0) footerMessage = rst.ref[0];
 
            Swal.fire({
                title: "Success",
                text: rst.message,
                footer: footerMessage,
                icon: "success",
                confirmButtonText: "OK",
                timer: 2500,
                timerProgressBar: true,
            }).then((result) => {
                document.getElementById("refreshTableToolbar").click();
                modalStore.close();
            });
 
            console.log("aaa 3");
        }
    } catch (err) {
        let textSwal = "";
 
        try {
            if (err.status == "403")
                textSwal =
                    "Not authorized, please check role or permission.";
            else if (err.status == "400") {
                const errors = err.errors;
                const firstKey = Object.keys(errors)[0];
                textSwal = errors[firstKey][0];
            } else if (err.status == "500")
                textSwal =
                    "There is a problem connecting to the server, please try again later.";
        } catch (err) {
            console.log("submitForm", err);
        }
 
        Swal.fire({
            title: "Info",
            text: textSwal,
            icon: "error",
            confirmButtonText: "OK",
            timerProgressBar: true,
        });
    }
}

export default modalStore;