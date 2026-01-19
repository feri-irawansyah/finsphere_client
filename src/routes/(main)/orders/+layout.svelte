<script>
    import ClientGrid from "$lib/directives/grids/ClientGrid.svelte";
    import orderStore from "$lib/directives/modal/functions/order-store.js";
    import { setContext } from "svelte";

    const { children, data } = $props();

    let quickFilterFn = $state(null);
    let refresh = $state(null);
    let excel = $state(null);

    // on:selected={(e) => console.log("selected", e.detail)}

    const state = $derived($orderStore);

    function testingers (row){

        orderStore.setup({
            detail : row?.detail
        });
    }
</script>

<div class="row">
    <div class="col-12">
        <div class="row">
            <div class="col-12">
                {@render children?.()}
            </div>
        </div>

        <div class="row mt-4 p-4">
            <div class="col-12">
                <section id="section">
                    <ClientGrid
                        columns={data.columns}
                        url="/api/direct-trading/oms/order"
                        height={100}
                        layout={85}
                        tableName={data.tableName}
                        on:selected={(e) => 
                            testingers(e)
                        }
                        on:quickFilter={(e) => (quickFilterFn = e.detail)}
                        on:refresh={(e) => (refresh = e.detail)}
                        on:excel={(e) => (excel = e.detail)}
                    >
                        <div class="d-flex justify-content-between">
                            <div class="flex-row align-items-start">
                                <label for="quick-filter">
                                    <div
                                        class="input-group rounded input-group-search"
                                    >
                                        <span
                                            class="input-group-text bg-transparent"
                                            id="search"
                                            ><i class="bi bi-searching"
                                            ></i></span
                                        >
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="Search here ..."
                                            oninput={(e) =>
                                                quickFilterFn(e.target.value)}
                                        />
                                    </div>
                                </label>
                                <button
                                    type="button"
                                    class="btn btn-default mb-2"
                                    onclick={refresh}
                                >
                                    <i class="bi bi-refresh-cw"></i>
                                    <span>Refresh Table</span>
                                </button>
                            </div>
                            <!-- <div class="flex-column">
                        <button type="button" class="btn btn-outline-success" onclick={excel}>
                            <i class="bi bi-file-earmark-excel"></i>
                            <span>Excel</span>
                        </button>
                        <button type="button" class="btn btn-gradient-primary"  data-bs-toggle="modal" data-bs-target="#modal-users" onclick={() => modalStore.open()}>
                            <i class="bi bi-person-plus"></i>
                            <span>Add New Orders</span>
                        </button>
                    </div> -->
                        </div>
                    </ClientGrid>
                </section>
            </div>
        </div>
    </div>
</div>
