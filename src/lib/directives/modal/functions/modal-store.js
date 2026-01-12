import fetcher from "$lib/fetcher";
import { writable } from "svelte/store";
import Swal from "sweetalert2";

const initialConfig = {
    title: "",
    subTitle: "",
    id: null,
    size: "md",
};

const initialRuntime = {
    open: false,
    loading: false,
    wizard: {
        enabled: false,
        step: 0,
        total: 0,
    },
    params: {
        isFormDisabled: false,
        isFormViewOnly: false
    },
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

        open(title, subTitle, params = {}, wizard = {}) {

            console.log("eiz",wizard)
            update(m => ({
                ...m,
                title,
                subTitle,
                open: true,
                params: {
                    ...m.params,   // ⬅ params lama
                    ...params,     // ⬅ overwrite sebagian
                    isFormDisabled: params.actions == "update"
                        ? true
                        : m.params.isFormDisabled
                },
                wizard: {
                    ...wizard
                }
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
                wizard: {
                    enabled: false,
                    step: 0,
                    total: 0,
                },
                instanceKey: m.instanceKey + 1 // 🔥 PAKSA REMOUNT
            }));
        },

        // 20250112_RK: Bugfix wizard prev/next tetap terbawa ke modal lain
        // resetRuntime() {
        //     update(() => structuredClone(initialRuntime));
        // },

        /** HARD RESET (RARE) */
        resetAll() {
            set({
                ...initialConfig,
                ...initialRuntime
            });
        },

        editMode(isFormDisabled = false) {
            update(m => ({
                ...m,
                params: {
                    ...m.params,
                    isFormDisabled
                }
            }));
        },

        setWizard({ step = 0, total = 0, enabled = false }) {
            update(m => ({
                ...m,
                wizard: {
                    enabled,
                    step,
                    total
                }
            }));
        },

        nextStep() {
            update(m => {
                if (m.wizard.step >= m.wizard.total) return m;
                return {
                    ...m,
                    wizard: { ...m.wizard, step: m.wizard.step + 1 }
                };
            });
        },

        prevStep() {
            update(m => {
                if (m.wizard.step <= 0) return m;
                return {
                    ...m,
                    wizard: { ...m.wizard, step: m.wizard.step - 1 }
                };
            });
        },

        setLoading(loading = true) {
            update(m => ({
                ...m,
                loading
            }));
        },



    };
}

const modalStore = createModalStore();

export async function submitDataModal(e, payload, url, method) {

    try {
        modalStore.setLoading();

        const rst = await fetcher(fetch, url, {
            method: method,
            body: JSON.stringify(payload),
        });

        const footerMessage = "";

        if (rst?.message) {

            const footerMessage =
                Array.isArray(rst?.ref) && rst.ref.length
                    ? rst.ref[0]
                    : "";

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
        }
    } catch (err) {
        let textSwal = "";

        try {
            if (err.status == "403")
                textSwal =
                    "Not authorized, please check role or permission.";
            else if (err.status == "400") {
                const errors = err.errors;

                if (errors && typeof errors === "object") {
                    const firstKey = Object.keys(errors)[0];
                    textSwal = Array.isArray(errors[firstKey])
                        ? errors[firstKey][0]
                        : String(errors[firstKey]);
                } else {
                    textSwal = err.message || "Bad request";
                }
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
    finally {

        modalStore.setLoading(false);
    }
}

export default modalStore;