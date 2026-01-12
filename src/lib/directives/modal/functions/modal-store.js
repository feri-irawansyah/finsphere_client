import fetcher from "$lib/fetcher";
import { writable } from "svelte/store";
import Swal from "sweetalert2";

const initialConfig = {
    title: "",
    subTitle: "",
    id: null,
    size: "md",
    component: null
};

const initialRuntime = {
    open: false,
    params: {
        isFormDisabled: false,
        isFormViewOnly: false
    },
    instanceKey: 0
};

function createModalStore() {
    const { subscribe, set, update } = writable({
        modals: [], // Array of modal configurations
        activeModal: null, // Index of active modal
        currentModal: { ...initialConfig, ...initialRuntime } // Current modal to display
    });

    return {
        subscribe,

        // Setup single modal (backward compatible)
        setup(config) {
            // Handle both single object and array
            const configs = Array.isArray(config) ? config : [config];
            
            update(state => {
                const newModals = [...state.modals];
                
                configs.forEach(config => {
                    const existingIndex = newModals.findIndex(m => m.id === config.id);
                    
                    if (existingIndex >= 0) {
                        // Update existing
                        newModals[existingIndex] = {
                            ...newModals[existingIndex],
                            ...config,
                            params: {
                                ...newModals[existingIndex].params,
                                ...config.params
                            }
                        };
                    } else {
                        // Add new
                        newModals.push({
                            ...initialConfig,
                            ...initialRuntime,
                            ...config
                        });
                    }
                });
                
                return {
                    ...state,
                    modals: newModals
                };
            });
        },

        // Open modal by ID
        open(modalId, title = "", subTitle = "", params = {}) {
            update(state => {
                const modalIndex = state.modals.findIndex(m => m.id === modalId);
                if (modalIndex === -1) {
                    console.warn(`Modal ${modalId} not found. Make sure to setup() first.`);
                    return state;
                }

                const modal = state.modals[modalIndex];
                
                const updatedModal = {
                    ...modal,
                    title,
                    subTitle,
                    open: true,
                    params: {
                        ...modal.params,
                        ...params,
                        isFormDisabled: params.actions == "update"
                            ? true
                            : modal.params.isFormDisabled
                    }
                };

                // Update the modal in array
                const newModals = [...state.modals];
                newModals[modalIndex] = updatedModal;

                return {
                    ...state,
                    modals: newModals,
                    activeModal: modalIndex,
                    currentModal: updatedModal
                };
            });
        },

        // Close current modal
        close() {
            update(state => {
                if (state.activeModal === null) return state;
                
                const modalIndex = state.activeModal;
                const modal = state.modals[modalIndex];
                
                if (!modal) return state;

                const updatedModal = {
                    ...modal,
                    open: false
                };

                const newModals = [...state.modals];
                newModals[modalIndex] = updatedModal;

                return {
                    ...state,
                    modals: newModals,
                    currentModal: {
                        ...state.currentModal,
                        open: false
                    }
                };
            });
        },

        /** RESET YANG AMAN */
        resetRuntime() {
            update(state => {
                if (state.activeModal === null) return state;
                
                const modalIndex = state.activeModal;
                const modal = state.modals[modalIndex];
                
                if (!modal) return state;

                const updatedModal = {
                    ...modal,
                    open: false,
                    params: {},
                    instanceKey: modal.instanceKey + 1
                };

                const newModals = [...state.modals];
                newModals[modalIndex] = updatedModal;

                return {
                    ...state,
                    modals: newModals,
                    activeModal: null,
                    currentModal: {
                        ...initialConfig,
                        ...initialRuntime
                    }
                };
            });
        },

        /** HARD RESET (RARE) */
        resetAll() {
            set({
                modals: [],
                activeModal: null,
                currentModal: { ...initialConfig, ...initialRuntime }
            });
        },

        editMode(isFormDisabled = false) {
            update(state => {
                if (state.activeModal === null) return state;
                
                const modalIndex = state.activeModal;
                const modal = state.modals[modalIndex];
                
                if (!modal) return state;

                const updatedModal = {
                    ...modal,
                    params: {
                        ...modal.params,
                        isFormDisabled
                    }
                };

                const newModals = [...state.modals];
                newModals[modalIndex] = updatedModal;

                return {
                    ...state,
                    modals: newModals,
                    currentModal: {
                        ...state.currentModal,
                        params: updatedModal.params
                    }
                };
            });
        },

        // Helper to get modal by ID
        getModal(id) {
            let modal = null;
            const unsubscribe = subscribe(state => {
                modal = state.modals.find(m => m.id === id) || null;
            });
            unsubscribe();
            return modal;
        },

        // Update specific modal
        updateModal(id, updates) {
            update(state => {
                const modalIndex = state.modals.findIndex(m => m.id === id);
                if (modalIndex === -1) return state;

                const modal = state.modals[modalIndex];
                const updatedModal = { ...modal, ...updates };
                
                const newModals = [...state.modals];
                newModals[modalIndex] = updatedModal;

                const newState = {
                    ...state,
                    modals: newModals
                };

                // If the updated modal is currently active, update currentModal
                if (state.activeModal === modalIndex) {
                    newState.currentModal = updatedModal;
                }

                return newState;
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