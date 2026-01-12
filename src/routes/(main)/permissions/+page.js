import modalStore from '$lib/directives/modal/functions/modal-store.js';
import ModalUsers from "$lib/components/molecules/modals/ModalUsers.svelte";

export const load = ({ parent }) => {

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
                headerName: 'Permission Uid',
                field: 'permissionsUid',
                hide: true,
            },
            {
                headerName: 'Permission ID',
                field: 'permissionId',
                minWidth: 350,
            },
            {
                headerName: 'Name',
                field: 'name',
                minWidth: 250,
            },
            {
                headerName: 'Description',
                field: 'description',
                minWidth: 200,
            },
            {
                headerName: 'Service ID',
                field: 'serviceId',
                minWidth: 180,
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