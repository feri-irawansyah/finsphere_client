import modalStore from '$lib/directives/modal/functions/modal-store.js';

export const load = ({ parent }) => {

    const metaPage = {
        title: 'Tenants Apps Credentials List',
        tableName: 'tenantsAppsCredentials',
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
                headerName: 'Tenant App Credential UID',
                field: 'tenantAppCredentialUid',
                hide: true,
            },
            {
                headerName: 'Tenant ID',
                field: 'tenantId',
                pinned: 'left',
            },
            {
                headerName: 'App ID',
                field: 'appId',
                minWidth: 180,
            },
            {
                headerName: 'Client ID',
                field: 'clientId',
                minWidth: 180,
            },
            {
                headerName: 'Client Secret',
                field: 'clientSecret',
                minWidth: 200,
            },
            {
                headerName: 'Api ID',
                field: 'apiId',
                minWidth: 180,
            },
            {
                headerName: 'Api Secret',
                field: 'apiSecret',
                minWidth: 180,
            },
            {
                headerName: 'Expiry Time',
                field: 'expiryTime',
                minWidth: 195,
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