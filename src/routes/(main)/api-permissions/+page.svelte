<script>
    import ModalCreate from "$lib/components/molecules/modals/ModalApiPermission.svelte";
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
            component: ModalCreate,
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
                url={`${applicationStore.urlPlatformConsole}/${data.tableName}`}
                height={100}
                layout={84}
                tableName={data.tableName}
                {quickFilterFn}
                {excel}
                {refresh}
                createNewModal={{
                    label: "Create New Api Permission",
                    title: "Create New Api Permission",
                    subTitle: "",
                    icon: "bi-text-paragraph",
                }}
                on:selected={(e) => console.log("selected", e.detail)}
                on:quickFilter={(e) => (quickFilterFn = e.detail)}
                on:refresh={(e) => (refresh = e.detail)}
                on:excel={(e) => (excel = e.detail)}
                on:doubleClicked={(e) =>
                    modalStore.open(
                        `modal-${data.tableName}`,
                        "Update data api permission",
                        "",
                        {
                            actions: "update",
                            uid: e.detail.apiPermissionUid,
                        },
                    )}
            />
        </div>
    </div>
</section>
