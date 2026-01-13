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

        if (state.open && state.component) modalInstance.show();
        else modalInstance.hide();

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
                <h5 class="modal-title">
                    {state.title}

                    {#if state.loading}<span
                            class="spinner-border spinner-border-sm me-2 mb-1"
                        ></span>{/if}
                </h5>
                {#if state.subTitle}
                    <p class="text-muted text-center mt-1 px-5">
                        {state.subTitle}
                    </p>
                {/if}
            </div>
            
            <!-- body -->
            <fieldset
                disabled={state.params.isFormDisabled}
            >
                {#if state.component}
                    {#key state.instanceKey}
                        {@render state.component?.()}
                    {/key}
                {/if}
            </fieldset>

            <!-- footer -->
            {#if !state.wizard.enabled}
                <div class="modal-footer row gx-3 m-0">
                    <div class="row">
                        <!-- CLOSE full width jika VIEW ONLY -->
                        <!-- ng-if="formDisabled && formViewOnly" -->
                        {#if state.params.isFormDisabled && state.params.isFormViewOnly}
                            <div class="col-12 mt-2">
                                <button
                                    type="button"
                                    class="btn btn-outline-danger w-100"
                                    data-bs-dismiss="modal">Close</button
                                >
                            </div>
                        {/if}

                        <!-- CLOSE normal jika DISABLED tapi BUKAN VIEW ONLY -->
                        {#if state.params.isFormDisabled && !state.params.isFormViewOnly}
                            <div class="col-12 col-md-8 mt-2">
                                <button
                                    type="button"
                                    class="btn btn-outline-danger w-100"
                                    data-bs-dismiss="modal">Close</button
                                >
                            </div>
                        {/if}

                        <!-- EDIT -->
                        {#if state.params.isFormDisabled && !state.params.isFormViewOnly}
                            <div class="col-12 col-md-4 mt-2">
                                <button
                                    type="button"
                                    class="btn btn-outline-dark w-100"
                                    onclick={() => modalStore.editMode()}
                                    disabled={state.loading}>Edit</button
                                >
                            </div>
                        {/if}

                        <!-- CLOSE saat tidak disabled -->
                        {#if !state.params.isFormDisabled}
                            <div class="col-12 col-md-4 mt-2">
                                <button
                                    type="button"
                                    class="btn btn-outline-danger w-100"
                                    data-bs-dismiss="modal">Close</button
                                >
                            </div>
                        {/if}

                        <!-- SAVE -->
                        {#if !state.params.isFormDisabled && !state.wizard.enabled && !state.loading}
                            <div class="col-12 col-md-8 mt-2">
                                <button
                                    type="submit"
                                    class="btn btn-gradient-primary w-100"
                                    form="formSubmit-{$modalStore.id}"
                                    disabled={state.loading}
                                >
                                    <span>Save</span>
                                </button>
                            </div>
                        {:else if !state.params.isFormDisabled && !state.wizard.enabled && state.loading}
                            <div class="col-12 col-md-8 mt-2">
                                <button
                                    type="button"
                                    class="btn btn-gradient-primary w-100"
                                    form="formSubmit-{$modalStore.id}"
                                    disabled={state.loading}
                                    ><span
                                        class="spinner-border spinner-border-sm me-2"
                                    ></span>
                                    Saving ...
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>
            {:else if state.wizard.enabled}
                <div class="modal-footer d-flex justify-content-between gap-2">
                    <div>
                        <button
                            type="button"
                            class="btn btn-outline-danger px-5"
                            data-bs-dismiss="modal">Close 1</button
                        >
                    </div>
                    <div>
                        <!-- PREVIOUS -->
                        <!-- NEXT -->
                        {#if state.wizard.enabled && state.wizard.step != state.wizard.total && state.wizard.step != 2}
                            <button
                                type="submit"
                                class="btn btn-gradient-primary px-5 me-2"
                                form="formSubmit-{$modalStore.id}"
                                disabled={state.loading ||
                                    state.wizard.step === state.wizard.total}
                            >
                                Next
                            </button>
                        {:else if state.wizard.enabled && state.wizard.step != 2}
                            <button
                                type="button"
                                class="btn btn-outline-info px-5 me-2"
                                disabled={state.loading ||
                                    state.wizard.step === 0}
                                onclick={() => modalStore.prevStep()}
                            >
                                Previous
                            </button>
                        {/if}

                        <!-- CREATE TENANT -->
                        {#if state.wizard.enabled && state.wizard.step === state.wizard.total && !state.loading && state.wizard.step != 2}
                            <button
                                type="submit"
                                class="btn btn-gradient-primary px-5 me-2"
                                form="formSubmit-{$modalStore.id}"
                                disabled={state.loading}
                            >
                                Create tenant
                            </button>
                        {:else if state.wizard.enabled && state.wizard.step === state.wizard.total && state.loading && state.wizard.step != 2}
                            <button
                                type="submit"
                                class="btn btn-gradient-primary px-5 me-2"
                                form="formSubmit-{$modalStore.id}"
                                disabled={state.loading}
                                ><span
                                    class="spinner-border spinner-border-sm me-2"
                                ></span>
                                Creating tenant ...
                            </button>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .modal-title .spinner-border {
        right: 15px;
        position: absolute;
        top: 23px;
    }
</style>
