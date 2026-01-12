<script>
    import { onMount, onDestroy } from "svelte";
    import { Modal } from "bootstrap";
    import modalStore from "./functions/modal-store";

    let modalEl;
    let modalInstance;

    const state = $derived($modalStore);

    function onHidden() {
        modalStore.resetRuntime();
    }

    onMount(() => {
        console.log(state.id, " Mounted");
        modalInstance = new Modal(modalEl, {
            backdrop: "static",
            keyboard: false,
        });

        modalEl.addEventListener("hidden.bs.modal", onHidden);
    });

    onDestroy(() => {
        console.log(state.id, " Destroyed");
        modalEl?.removeEventListener("hidden.bs.modal", onHidden);
        modalInstance?.dispose();
    });

    $effect(() => {

        console.log("state.params", state.params)

        if (!modalInstance) return;

        state.open ? modalInstance.show() : modalInstance.hide();
    });
</script>

<div bind:this={modalEl} class="modal fade" id={state.id} tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-{state.size}">
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
            {/if}

            <!-- footer -->
            <div class="modal-footer row gx-3 m-0">
                <div class="row">
                    <!-- CLOSE full width jika VIEW ONLY -->
                    <!-- ng-if="formDisabled && formViewOnly" -->
                    {#if state.params.isFormDisabled && state.params.isFormViewOnly}
                        <div class="col-12 mt-2">
                            <button
                                type="button"
                                class="btn btn-outline-danger w-100"
                                data-bs-dismiss="modal"
                                ng-disabled="isSubmitting">Close</button
                            >
                        </div>
                    {/if}

                    <!-- CLOSE normal jika DISABLED tapi BUKAN VIEW ONLY -->
                    {#if state.params.isFormDisabled && !state.params.isFormViewOnly}
                        <div class="col-12 col-md-8 mt-2">
                            <button
                                type="button"
                                class="btn btn-outline-danger w-100"
                                data-bs-dismiss="modal"
                                ng-disabled="isSubmitting">Close</button
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
                                ng-disabled="isSubmitting">Edit</button
                            >
                        </div>
                    {/if}

                    <!-- CLOSE saat tidak disabled -->
                    {#if !state.params.isFormDisabled}
                        <div class="col-12 col-md-4 mt-2">
                            <button
                                type="button"
                                class="btn btn-outline-danger w-100"
                                data-bs-dismiss="modal"
                                ng-disabled="isSubmitting">Close</button
                            >
                        </div>
                    {/if}

                    <!-- SAVE -->
                    {#if !state.params.isFormDisabled}
                        <div class="col-12 col-md-8 mt-2">
                            <button
                                type="submit"
                                class="btn btn-gradient-primary w-100"
                                form="formSubmit-{$modalStore.id}"
                            >
                                <span>Save</span>
                            </button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>
