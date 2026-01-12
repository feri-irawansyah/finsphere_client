<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { createGrid, myTheme } from "./functions/module";
    import fetcher from "$lib/fetcher";
    import createTableFormatter from "$lib/tableFormatter";
    import CustomControlsComponent from "./class/custom-control";
    import CustomStatusInfoComponent from "./class/custom-status-info";
    import CustomPaginationButtonsComponent from "./class/custom-paination";
    import CustomNoRowsOverlay from "./class/custom-norows";
    import { theme } from "$lib";
    import modalStore from "../modal/functions/modal-store";

    const {
        columns = [],
        url = "",
        height = 100,
        children,
        layout = 80,
        tableName = "",
        clickRightRow = [],

        excel = null,
        refresh = null,
        quickFilterFn = null,
        createNewLabel = {},
    } = $props();

    const dispatch = createEventDispatcher();

    let themes = $derived($theme);
    let gridApi;
    let gridOptions;
    let gridEl;

    let hasSelectedColumn = $state(false);

    onMount(async () => {
        const gridDiv = document.querySelector("#finsphereGrid");
        const columnDefs = createTableFormatter(columns);

        gridOptions = {
            statusBar: {
                statusPanels: [
                    {
                        // ✅ Custom Control Component
                        statusPanel: CustomControlsComponent,
                        align: "left",
                    },
                    {
                        // ✅ Custom Status Info Component
                        statusPanel: CustomStatusInfoComponent,
                        align: "left",
                    },
                    {
                        // ✅ Custom Pagination Component
                        statusPanel: CustomPaginationButtonsComponent,
                        align: "right",
                    },
                ],
            },
            theme: myTheme,
            suppressMenuHide: false,
            columnDefs,
            // defaultColDef: { flex: 1, minWidth: 150, filter: true },
            defaultColDef: { flex: 1, minWidth: 100, filter: true },
            rowSelection: { mode: "multiRow" },
            components: {
                customNoRowsOverlay: CustomNoRowsOverlay, //✅ Option untuk no rows
            },
            noRowsOverlayComponent: "customNoRowsOverlay",
            noRowsOverlayComponentParams: {
                tableName: "tableName",
                refresh: async () => {
                    gridApi.refreshClientSideStore({ purge: true });
                },
            },
            pagination: true,
            suppressPaginationPanel: true,
            onFilterChanged: (params) => {
                console.log("onFilterChanged", params.api.getFilterModel());
            },
            onRowSelected: (params) => {
                dispatch("selected", params.node.data);
            },
            onRowDoubleClicked: (params) => {
                console.log("params");
                dispatch("doubleClicked", params.node.data);
            },
            getContextMenuItems: (params) => {
                const items = ["copy", "copyWithHeaders", "paste"];

                if (Array.isArray(clickRightRow) && clickRightRow.length > 0) {
                    items.push("separator");

                    clickRightRow.forEach((menu) => {
                        items.push({
                            name: menu.name,
                            icon: menu.icon,
                            disabled: menu.disabled,
                            action: () => menu.action(params),
                        });
                    });
                }

                return items;
            },
        };

        gridApi = createGrid(gridDiv, gridOptions);
        hasSelectedColumn = columns.some((col) => col.field === "selected");

        // ✅ validasi untuk column selected (kalo ada)
        if (hasSelectedColumn) {
            gridApi.setGridOption("rowSelection", {
                mode: "multiRow",
                selectAll: selectAllMode,
            }); // enable row selection
        } else {
            gridApi.setGridOption("rowSelection", {
                mode: "singleRow",
                checkboxes: false,
                enableClickSelection: true,
            });
        }

        // ✅ fetch data ke serer
        const loadData = async (params) => {
            const data = await fetcher(fetch, `${url}`);
            params.setGridOption("rowData", data);
        };

        loadData(gridApi);

        // ✅ custom event handler to quick filter
        dispatch("quickFilter", (value) => {
            gridApi.setGridOption("quickFilterText", value);
        });

        // ✅ custom event handler to refresh
        dispatch("refresh", () => {
            loadData(gridApi); // ✅ FETCH ULANG
            gridApi.refreshCells({ force: true }); // optional
        });

        // ✅ custom event handler to excel
        dispatch("excel", () => {
            gridApi.exportDataAsExcel({
                fileName: `table-${tableName}.xlsx`,
            });
        });
    });
</script>

<div class="d-flex justify-content-between">
    <div class="flex-row align-items-start">
        <!-- quick filter / search -->
        {#if quickFilterFn}
            <label for="quick-filter">
                <div class="input-group rounded input-group-search">
                    <span class="input-group-text bg-transparent" id="search"
                        ><i class="bi bi-searching"></i></span
                    >
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Search here ..."
                        oninput={(e) => quickFilterFn(e.target.value)}
                    />
                </div>
            </label>
        {/if}

        <!-- refresh table -->
        {#if refresh}
            <button
                type="button"
                id="refreshTableToolbar"
                class="btn btn-default mb-2"
                onclick={refresh}
            >
                <i class="bi bi-refresh-cw pe-2"></i>
                <span>Refresh Table</span>
            </button>
        {/if}
    </div>
    <div class="flex-column">
        <!-- export to excel -->
        {#if excel}
            <button type="button" class="btn btn-light" onclick={excel}>
                <i class="bi bi-file-earmark-excel pe-2"></i>
                <span>Excel</span>
            </button>
        {/if}

        <!-- create new modal -->
        <button
            type="button"
            class="btn btn-gradient-primary"
            data-bs-toggle="modal"
            data-bs-target={`#modal-${tableName}`}
            onclick={() =>
                modalStore.open(createNewLabel.title, createNewLabel.subTitle, {
                    actions: "create",
                })}
        >
            <i class="bi {createNewLabel.icon} pe-2"></i>
            <span>{createNewLabel.label}</span>
        </button>
    </div>
</div>
<div class="grid-layout" style="height: {layout}vh;">
    <!-- HEADER SLOT -->
    <div class="grid-header mb-3">
        {@render children?.()}
    </div>

    <!-- GRID BODY -->
    <div class="grid-body">
        <div
            bind:this={gridEl}
            class="ag-theme-quartz-dark"
            id="finsphereGrid"
            style="height: {height}%"
        ></div>
    </div>
</div>

<style>
    .grid-layout {
        display: flex;
        flex-direction: column;
    }

    .grid-header {
        flex: 0 0 auto;
    }

    .grid-body {
        flex: 1;
        min-height: 0; /* 🔥 AG GRID FIX */
    }
</style>
