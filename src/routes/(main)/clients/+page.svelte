<script>
    import ModalClients from "$lib/components/molecules/modals/ModalClients.svelte";
    import ModalClientsImport from "$lib/components/molecules/modals/ModalClientsImport.svelte";
    import ClientGrid from "$lib/directives/grids/ClientGrid.svelte";
    import modalStore from "$lib/directives/modal/functions/modal-store.js";
    import { applicationStore } from "$lib/stores/applicationStore.js";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    const { data } = $props();

    let quickFilterFn = $state(null);
    let refresh = $state(null);
    let excel = $state(null);

    onMount(() => {
        modalStore.setup([
            {
                id: `modal-${data.tableName}`,
                size: "lg",
                component: ModalClients,
                params: data,
            },
            {
                id: `modal-${data.tableName}-import`,
                size: "lg",
                component: ModalClientsImport,
                params: data,
            },
        ]);
    });
</script>

<section id="section">
    <h2 class="page-title">{data.title}</h2>
    <div class="row" id={data.tableName} data-aos="fade-left">
        <div class="col-12">
            <ClientGrid
                columns={data.columns}
                url={`${applicationStore.urlPlatformConsole}/${data.tableName}`}
                height={100}
                layout={85}
                tableName={data.tableName}
                {quickFilterFn}
                {excel}
                {refresh}
                createNewModal={[{
                    label: "Import",
                    title: "Import",
                    overrideTableName: `${data.tableName}-import`,
                    subTitle: "",
                    icon: "bi-box-arrow-in-down",
                    buttonClass: "btn btn-gradient-primary",
                },{
                    label: "Create New Client",
                    title: "Create new client",
                    subTitle: "",
                    icon: "bi-person-plus-fill",
                }]}
                on:selected={(e) => console.log("selected", e.detail)}
                on:quickFilter={(e) => (quickFilterFn = e.detail)}
                on:refresh={(e) => (refresh = e.detail)}
                on:excel={(e) => (excel = e.detail)}
                on:doubleClicked={(e) =>
                    modalStore.open(`modal-${data.tableName}`, "Update client", "", {
                        actions: "update",
                        uid: e.detail.clientEquityTradingUid,
                    })}
            />
        </div>
    </div>
</section>