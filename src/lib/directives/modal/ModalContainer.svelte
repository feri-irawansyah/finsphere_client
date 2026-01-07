<script>
    import { onMount, onDestroy } from "svelte";
    import { Modal } from "bootstrap";
    import modalStore from "./functions/modal-store";

    const { children, id, size = "md" } = $props();

    let modalInstance;
    let modalEl;

    // 🔹 OPEN / CLOSE BASED ON STORE
    $effect(() => {
        if (!$modalStore) return;

        if ($modalStore.open) {
            modalInstance?.show();
        } else {
            modalInstance?.hide();
        }
    });

    onMount(() => {
        modalInstance = new Modal(modalEl, {
            backdrop: 'static',
            keyboard: false
        });
    });

    onDestroy(() => {
        modalInstance?.hide();
        modalInstance?.dispose();
    });
</script>

<div
    bind:this={modalEl}
    class="modal fade"
    {id}
    tabindex="-1"
    aria-hidden="true"
>
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-{size}">
        <div class="modal-content">
            {@render children()}
        </div>
    </div>
</div>

<style lang="scss">
.modal-content {
    padding: 0 !important;
    display: flex;
    flex-direction: column;
}
</style>
