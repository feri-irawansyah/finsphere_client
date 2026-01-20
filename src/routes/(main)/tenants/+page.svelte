<script>
    import ModalTenants from "$lib/components/molecules/modals/ModalTenants.svelte";
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
        modalStore.setup({
            id: `modal-${data.tableName}`,
            size: "xl",
            component: ModalTenants,
            params: data,
        });

        modalStore.setWizard({
            step: 0,
            total: 1,
            enabled: true,
        });
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
                    label: "Create New tenant",
                    title: "Create new tenant",
                    subTitle:
                        "Create a new tenant to manage its users, categories, and services within your workspace.",
                    icon: "bi-house-door-fill",
                    wizardParams: {
                        enabled: true,
                        step: 0,
                        total: 1,
                    },
                }]}
                on:selected={(e) => console.log("selected", e.detail)}
                on:quickFilter={(e) => (quickFilterFn = e.detail)}
                on:refresh={(e) => (refresh = e.detail)}
                on:excel={(e) => (excel = e.detail)}
                on:doubleClicked={(e) =>
                    modalStore.open(
                        `modal-${data.tableName}`,
                        "View tenant",
                        "",
                        {
                            actions: "update",
                            uid: e.detail.tenantUid,
                        },
                        {
                            enabled: true,
                            step: 2,
                            total: 2,
                        },
                    )}
            />
        </div>
    </div>
</section>
