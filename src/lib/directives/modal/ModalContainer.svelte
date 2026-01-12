<script>
    import { onMount, onDestroy } from "svelte";
    import { Modal } from "bootstrap";
    import modalStore from "./functions/modal-store";

    let modalEl;
    let modalInstance;
    
    // Gunakan currentModal dari store
    const state = $derived($modalStore.currentModal);
    
    // Flag untuk cek apakah modal sudah di-mount
    let isMounted = $state(false);

    function onHidden() {
        modalStore.resetRuntime();
    }

    onMount(() => {
        isMounted = true;
        console.log("ModalContainer Mounted");
        
        // Hanya inisialisasi Modal jika modalEl ada
        if (modalEl) {
            modalInstance = new Modal(modalEl, {
                backdrop: "static",
                keyboard: false,
            });

            modalEl.addEventListener("hidden.bs.modal", onHidden);
        }
    });

    onDestroy(() => {
        console.log("ModalContainer Destroyed");
        modalEl?.removeEventListener("hidden.bs.modal", onHidden);
        modalInstance?.dispose();
    });

    $effect(() => {
        if (!modalInstance || !isMounted) return;

        console.log("Modal state changed:", state.open, state.id);

        if (state.open && state.component) {
            modalInstance.show();
        } else {
            modalInstance.hide();
        }
    });
</script>

<!-- Modal container selalu ada di DOM -->
<div 
    bind:this={modalEl} 
    class="modal fade" 
    id="dynamic-modal" 
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
>
    <div class="modal-dialog modal-dialog-centered modal-{state.size || 'md'}">
        <div class="modal-content">
            <!-- header -->
            <div class="modal-header flex-column justify-content-center pb-2">
                <h5 class="modal-title">{state.title}</h5>
                {#if state.subTitle}
                    <p class="text-muted text-center mt-1 px-5">
                        {state.subTitle}
                    </p>
                {/if}
            </div>

            <!-- body -->
            {#if state.component}
                {#key state.instanceKey}
                    {@render state.component?.()}
                {/key}
            {:else}
                <!-- Empty state -->
                <div class="modal-body">
                    <p class="text-muted text-center py-5">
                        No modal content
                    </p>
                </div>
            {/if}

            <!-- footer -->
            <div class="modal-footer row gx-3 m-0">
                <div class="row">
                    <!-- CLOSE full width jika VIEW ONLY -->
                    {#if state.params?.isFormDisabled && state.params?.isFormViewOnly}
                        <div class="col-12 mt-2">
                            <button
                                type="button"
                                class="btn btn-outline-danger w-100"
                                data-bs-dismiss="modal">Close</button>
                        </div>
                    {/if}

                    <!-- CLOSE normal jika DISABLED tapi BUKAN VIEW ONLY -->
                    {#if state.params?.isFormDisabled && !state.params?.isFormViewOnly}
                        <div class="col-12 col-md-8 mt-2">
                            <button
                                type="button"
                                class="btn btn-outline-danger w-100"
                                data-bs-dismiss="modal">Close</button>
                        </div>
                    {/if}

                    <!-- EDIT -->
                    {#if state.params?.isFormDisabled && !state.params?.isFormViewOnly}
                        <div class="col-12 col-md-4 mt-2">
                            <button
                                type="button"
                                class="btn btn-outline-dark w-100"
                                onclick={() => modalStore.editMode(false)}>Edit</button>
                        </div>
                    {/if}

                    <!-- CLOSE saat tidak disabled -->
                    {#if !state.params?.isFormDisabled}
                        <div class="col-12 col-md-4 mt-2">
                            <button
                                type="button"
                                class="btn btn-outline-danger w-100"
                                data-bs-dismiss="modal">Close</button>
                        </div>
                    {/if}

                    <!-- SAVE -->
                    {#if !state.params?.isFormDisabled}
                        <div class="col-12 col-md-8 mt-2">
                            <button
                                type="submit"
                                class="btn btn-gradient-primary w-100"
                                form="formSubmit-{state.id || 'modal'}">
                                <span>Save</span>
                            </button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>