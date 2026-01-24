import Swal from "sweetalert2";

export const load = () => {

    const metaPage = {
        title: 'Tenant Config List',
        tableName: 'TenantConfigs',
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
                headerName: 'Tenant Configuration Uid',
                field: 'tenantConfigurationUid',
                hide: true,
            },
            {
                headerName: 'Service ID',
                field: 'serviceId',
            },
            {
                headerName: 'Config Key',
                field: 'configKey',
            },
            {
                headerName: 'Config Value',
                field: 'configValue',
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
        ],
    }

    return metaPage;
}