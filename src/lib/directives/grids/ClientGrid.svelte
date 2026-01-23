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

    const {
        columns = [],
        url = "",
        height = 100,
        children,
        layout = 80,
        tableName = "",
        clickRightRow = [],
        withMessage = false,
        messages = [],
        rowIdField = null
    } = $props();

    const dispatch = createEventDispatcher();

    let themes = $derived($theme);
    let gridApi;
    let gridOptions;
    let gridEl;
    let data = $state([]);

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
            getRowId: rowIdField
                ? (params) => params.data?.[rowIdField]
                : undefined,

            defaultColDef: { flex: 1, minWidth: 150, filter: true },
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

    $effect(() => {
        if (!gridApi && !withMessage) return;
        if (!Array.isArray(messages) || messages.length === 0) return;

        //gridApi.setGridOption("rowData", messages);

        const updates = [];
        const adds = [];

        messages.forEach((item) => {
            if (!item?.orderUid) return;

            const rowNode = gridApi.getRowNode(item.orderUid);

            console.log("testing ajah: item.orderUid", item.orderUid);
            console.log("testing ajah", rowNode);
            $inspect("RowsNodezz", rowNode);

            if (rowNode) {
                // UPDATE
                updates.push({
                    ...rowNode.data,
                    ...item,
                });
            } else {
                // INSERT
                adds.push(item);
            }
        });

        if (updates.length) {
            gridApi.applyTransaction({ update: updates });
        }

        if (adds.length) {
            gridApi.applyTransaction({
                add: adds,
                addIndex: 5,
            });
        }
    });
</script>

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
