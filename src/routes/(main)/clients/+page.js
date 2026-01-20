import modalStore from '$lib/directives/modal/functions/modal-store.js';

export const load = ({ parent }) => {

    const metaPage = {
        title: 'Clients List',
        tableName: 'clientsequitytrading',
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
                headerName: 'Client Uid',
                field: 'clientEquityTradingUid',
                hide: true,
            },
            {
                headerName: 'Client ID',
                field: 'clientId',
                pinned: 'left',
                minWidth: 195,
            },
            {
                headerName: 'Client Name',
                field: 'clientName',
                minWidth: 195,
            },
            {
                headerName: 'SID',
                field: 'sid',
                minWidth: 195,
            },
            {
                headerName: 'Origin ID',
                field: 'originId',
                minWidth: 195,
            },
            {
                headerName: 'Trade Limit',
                field: 'tradeLimit',
                cellStyle: { textAlign: 'right' },
                filter: "agNumberColumnFilter",
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