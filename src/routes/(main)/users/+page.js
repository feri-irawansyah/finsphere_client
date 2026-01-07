import modalStore from '$lib/directives/modal/functions/modal-store.js';

export const load = ({ parent }) => {

    const metaPage = {
        title: 'Users List',
        tableName: 'users',
        columns: [
            {
                headerName: "No.",
                valueGetter: "node.rowIndex + 1",
                width: 10,
                pinned: 'left',
                filter: false,
                menuTabs: [],
                cellClass: 'text-center',
                headerClass: 'text-center',
            },
            {
                headerName: 'User Uid',
                field: 'userUid',
                hide: true,
            },
            {
                headerName: 'Email',
                field: 'email',
                pinned: 'left',
            },
            {
                headerName: 'Name',
                field: 'name',
            },
            {
                headerName: 'Password Expired Date',
                field: 'pwdExpDate',
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