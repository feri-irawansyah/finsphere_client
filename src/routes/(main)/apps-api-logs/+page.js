import modalStore from '$lib/directives/modal/functions/modal-store.js';
import Swal from 'sweetalert2';

export const load = ({ parent }) => {

    const metaPage = {
        title: 'Apps Api Logs List',
        tableName: 'appsapilogs',
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
                headerName: 'App api log Uid',
                field: 'appApiLogUid',
                hide: true,
            },
            {
                headerName: 'Api Type',
                field: 'apiType',
                pinned: 'left',
            },
            {
                headerName: 'Level',
                field: 'level',
            },
            {
                headerName: 'Category',
                field: 'category',
            },
            {
                headerName: 'Description',
                field: 'description',
                minWidth: 195,
            },
            {
                headerName: 'Content',
                field: 'content',
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