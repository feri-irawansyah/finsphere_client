import modalStore from '$lib/directives/modal/functions/modal-store.js';
import ModalUsers from "$lib/components/molecules/modals/ModalUsers.svelte";

export const load = ({ parent }) => {

    const metaPage = {
        title: 'User Activities',
        tableName: 'usersactivities',
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
                headerName: 'Email',
                field: 'email',
                pinned: 'left',
            },
            {
                headerName: 'Name',
                field: 'name',
                minWidth: 195,
            },
            {
                headerName: 'Activity',
                field: 'activity',
                minWidth: 195,
            },
            {
                headerName: 'Activity Time',
                field: 'activityAt',
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