export const load = () => {
    const metaPage = {
        title: 'Permissions List',
        tableName: 'permissions',
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
                headerName: 'Permission UID',
                field: 'permissionUid',
                hide: true,
            },
            {
                headerName: 'Permission ID',
                field: 'permissionId',
                pinned: 'left',
            },
            {
                headerName: 'Name',
                field: 'name',
            },
            {
                headerName: 'Description',
                field: 'description',
            },
            {
                headerName: 'Service ID',
                field: 'serviceId',
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
    };
    return metaPage;
}