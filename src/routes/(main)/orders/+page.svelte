<script>
    import ModalUsers from "$lib/components/molecules/modals/ModalUsers.svelte";
    import ClientGrid from "$lib/directives/grids/ClientGrid.svelte";
    import modalStore from "$lib/directives/modal/functions/modal-store.js";
    import { onMount } from "svelte";

    const { data } = $props();

    

    onMount(() => {
        modalStore.setup({
            id: "modal-users",
            size: "lg",
            component: ModalUsers,
            params: { mode: "create" }
        });
    });
    
</script>

<section id="section">
    <h2 class="page-title">{data.title}</h2>
    <div class="row" id="orders" data-aos="fade-left">
        <div class="col-12">
        </div>
    </div>
</section>