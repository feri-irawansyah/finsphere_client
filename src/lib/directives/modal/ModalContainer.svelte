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

    $effect(() => {
        if (!modalInstance) return;

        state.open
            ? modalInstance.show()
            : modalInstance.hide();
    });

    onMount(() => {
        console.log(state.id, " Mounted");
        modalInstance = new Modal(modalEl, {
            backdrop: "static",
            keyboard: false
        });

        modalEl.addEventListener('hidden.bs.modal', onHidden);
    });

    onDestroy(() => {
        console.log(state.id, " Destroyed");
        modalEl?.removeEventListener('hidden.bs.modal', onHidden);
        modalInstance?.dispose();
    });

</script>

<div
    bind:this={modalEl}
    class="modal fade"
    id={state.id}
    tabindex="-1"
>
    <div class="modal-dialog modal-dialog-centered modal-{state.size}">
        <div class="modal-content">
            <!-- {#if state.component}
                {@render state.component({ params: state.params })}
            {/if} -->
            <div class="modal-content">
                {#if state.component}
                    {#key state.instanceKey}
                        {@render state.component?.()}
                    {/key}
                {/if}
            </div>
        </div>
    </div>
</div>
