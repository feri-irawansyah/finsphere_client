import modalStore from '$lib/directives/modal/functions/modal-store.js';

export const load = ({ parent }) => {

    const metaPage = {
        title: 'Services Registrations List',
        tableName: 'serviceregistrations',
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
                headerName: 'Service Registration UID',
                field: 'serviceRegistrationUid',
                hide: true,
            },
            {
                headerName: 'Service ID',
                field: 'serviceId',
                pinned: 'left',
            },
            {
                headerName: 'Tenant ID',
                field: 'tenantId',
                maxWidth: 180,
            },
            {
                headerName: 'Register Time',
                field: 'registerTime',
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