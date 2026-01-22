import modalStore from '$lib/directives/modal/functions/modal-store.js';
import Swal from 'sweetalert2';

export const load = ({ parent }) => {

    const metaPage = {
        title: 'Apps List',
        tableName: 'apps',
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
                headerName: 'App Uid',
                field: 'appUid',
                hide: true,
            },
            {
                headerName: 'App ID',
                field: 'appId',
                pinned: 'left',
            },
            {
                headerName: 'Name',
                field: 'name',
            },
            {
                headerName: 'Description',
                field: 'description',
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