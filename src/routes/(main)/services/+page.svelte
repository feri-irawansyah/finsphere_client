<script>
    import ModalServices from "$lib/components/molecules/modals/ModalServices.svelte";
    import ClientGrid from "$lib/directives/grids/ClientGrid.svelte";
    import modalStore from "$lib/directives/modal/functions/modal-store.js";
    import { applicationStore } from "$lib/stores/applicationStore";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    const { data } = $props();

    let quickFilterFn = $state(null);
    let refresh = $state(null);
    let excel = $state(null);

    onMount(() => {
        modalStore.setup({
            id: `modal-${data.tableName}`,
            size: "xl",
            component: ModalServices,
            params: data,
        });
    });
</script>

<section id="section">
    <h2 class="page-title">{data.title}</h2>
    <div class="row" id={data.tableName} data-aos="fade-left">
        <div class="col-12">
            <ClientGrid
                columns={data.columns}
                url={`${$applicationStore.urlPlatformConsole}/${data.tableName}`}
                height={100}
                layout={84}
                tableName={data.tableName}
                {quickFilterFn}
                {excel}
                {refresh}
                createNewLabel={{
                    label: "Create New Service",
                    title: "Create new service",
                    subTitle: "",
                    icon: "bi-text-paragraph",
                }}
                on:selected={(e) => console.log("selected", e.detail)}
                on:quickFilter={(e) => (quickFilterFn = e.detail)}
                on:refresh={(e) => (refresh = e.detail)}
                on:excel={(e) => (excel = e.detail)}
                on:doubleClicked={(e) =>
                    modalStore.open("Update data service", "", {
                        actions: "update",
                        uid: e.detail.serviceUid,
                    })}
            />
        </div>
    </div>
</section>
