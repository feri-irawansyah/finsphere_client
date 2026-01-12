import modalStore from '$lib/directives/modal/functions/modal-store.js';

export const load = ({ parent }) => {

    const metaPage = {
        title: 'Services List',
        tableName: 'services',
        columns: [
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
                headerName: 'Service Uid',
                field: 'serviceUid',
                hide: true,
            },
            {
                headerName: 'Service ID',
                field: 'serviceId',
                pinned: 'left',
            },
            {
                headerName: 'Name',
                field: 'name',
                minWidth: 195,
            },
            {
                headerName: 'Description',
                field: 'description',
                minWidth: 195,
            },
            {
                headerName: 'Service Category',
                field: 'mvServiceCategory',
                minWidth: 195,
            },
            {
                headerName: 'Tenant Category Flags',
                field: 'tenantCategoryFlags',
                minWidth: 285,
            },
            {
                headerName: 'Entry Time',
                field: 'entryTime',
                minWidth: 195,
            },
            {
                headerName: 'Update Time',
                field: 'updateTime',
                minWidth: 195,
            },
            {
                headerName: 'Version',
                field: 'version',
                minWidth: 150,
            },
            {
                headerName: 'Status',
                field: 'status',
                minWidth: 150,
            },
        ],
    }

    return metaPage;
}