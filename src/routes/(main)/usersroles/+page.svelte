<script>
    import ClientGrid from "$lib/directives/grids/ClientGrid.svelte";
    import Swal from "sweetalert2";
    let excel = $state(null);
    const tableName = 'usersroles';
    let quickFilterFn = $state(null);
    let refresh = $state(null);

    const columns = [
        {
          headerName: "No.",
          valueGetter: "node.rowIndex + 1",
          width: 50,
          pinned: 'left',
          filter: false,
          menuTabs: [],
          cellClass: 'text-center',
          headerClass: 'text-center',
        },
        {
          headerName: 'User Roles UID',
          field: 'userRoleUid',
          hide: true,
        },
        {
          headerName: 'Entry Time',
          field: 'entryTime',
        },
        {
          headerName: 'Update Time',
          field: 'updateTime',
        },
        {
          headerName: 'Version',
          field: 'version',
        },
        {
          headerName: 'Status',
          field: 'status',
        },
    ];

</script>

<ClientGrid 
    {columns} 
    url="/api/platform/console/usersroles"
    height={100}
    layout={85}
    {tableName}
    on:selected={(e) => console.log('selected', e.detail)}
    on:excel={(e) => excel = e.detail}
    on:refresh={(e) => refresh = e.detail}
    clickRightRow={[
        {
            name: 'Open Detail',
            icon: '<i class="bi bi-eye"></i>',
            action: () => {
                Swal.fire({
                    title: 'Right Click',
                    text: 'Open Detail',
                    icon: 'info'
                })
            }
        },
        {
            name: 'Open Bro',
            icon: '<i class="bi bi-eye"></i>',
            action: () => {
                Swal.fire({
                    title: 'Right Bro',
                    text: 'Open Detail',
                    icon: 'info'
                })
            }
        }
    ]}>
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
            <button type="button" class="btn btn-gradient-primary">
                <i class="bi bi-person-plus"></i>
                <span>Add New Users</span>
            </button>
        </div>
    </div>

</ClientGrid>
