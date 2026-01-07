<script>
    import ClientGrid from "$lib/directives/grids/ClientGrid.svelte";
    import modalStore, { setModal } from "$lib/directives/modal/functions/modal-store.js";
    import { onMount } from "svelte";

    const { data } = $props();

    let quickFilterFn = $state(null);
    let refresh = $state(null);
    let excel = $state(null);

    onMount(() => {
        setModal({
            id: 'modal-users',
            size: 'lg',
            component: 'ModalUsers',
            params: {
                title: 'Add New Journal'
            }
        });
    });
    
</script>

<section id="section">
    <h2 class="page-title">{data.title}</h2>
    <div class="row" id="users" data-aos="fade-left">
        <div class="col-12">
            <ClientGrid 
                columns={data.columns}
                url="/api/platform/console/users"
                height={100}
                layout={85}
                tableName={data.tableName}
                on:selected={(e) => console.log('selected', e.detail)} 
                on:quickFilter={(e) => quickFilterFn = e.detail} 
                on:refresh={(e) => refresh = e.detail}
                on:excel={(e) => excel = e.detail}>
            
                <div class="d-flex justify-content-between">
                    <div class="flex-row align-items-start">
                        <label for="quick-filter">
                            <div class="input-group rounded input-group-search">
                                <span class="input-group-text bg-transparent" id="search"><i class="bi bi-searching"></i></span>
                                <input type="text" class="form-control" placeholder="Search here ..." oninput={(e) => quickFilterFn(e.target.value)}>
                            </div>
                        </label>
                        <button type="button" class="btn btn-default mb-2" onclick={refresh}>
                            <i class="bi bi-refresh-cw"></i>
                            <span>Refresh Table</span>
                        </button>
                    </div>
                    <div class="flex-column">
                        <button type="button" class="btn btn-outline-success" onclick={excel}>
                            <i class="bi bi-file-earmark-excel"></i>
                            <span>Excel</span>
                        </button>
                        <button type="button" class="btn btn-gradient-primary"  data-bs-toggle="modal" data-bs-target="#modal-users">
                            <i class="bi bi-person-plus"></i>
                            <span>Add New Users</span>
                        </button>
                    </div>
                </div>
            </ClientGrid>
        </div>
    </div>
</section>
