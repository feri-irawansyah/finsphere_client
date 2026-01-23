
export const load = ({ parent }) => {

    const metaPage = {
        title: 'Orders List',
        tableName: 'orders',
        rowIdField: 'orderUid',
        columns: [
            // {
            //   headerName: "No.",
            //   valueGetter: "node.rowIndex + 1",
            //   width: 10,
            //   pinned: 'left',
            //   filter: false,
            //   menuTabs: [],
            //   cellClass: 'text-center',
            //   headerClass: 'text-center',
            // },
            {
                headerName: 'Order Uid',
                field: 'orderUid',
                hide: true,
            },
            {
                headerName: 'ENTRY TIME',
                field: 'entryTime',
                sort: 'desc',          // default sort
                sortIndex: 0,          // urutan prioritas sort
            },
            {
                headerName: 'TRADING ID',
                field: 'sid',
            },
            {
                headerName: 'ORDER ID',
                field: 'clientOrderId',
            },
            {
                headerName: 'STATE',
                field: 'orderStatusText',
                cellClass: "state-col",
                cellRenderer: function (params) {
                    if (!params.value) return '';

                    // mapping angka → label
                    let label = params.value;
                    let state = label.toLowerCase().replace(/\s+/g, "-");

                    return `<span class="badge-state badge-${state}">${label}</span>`;
                },
            },
            {
                headerName: 'MKTOID',
                field: 'marketOrderId',
            },
            {
                headerName: 'PartyID',
                field: 'partyId',
            },
            {
                headerName: 'STOCK',
                field: 'stockId',
            },
            {
                headerName: 'SIDE',
                field: 'buySell',
                cellClassRules: {
                    'text-success-finsphere': params => params.value === 'BUY',
                    'text-danger': params => params.value === 'SELL'
                },
            },
            {
                headerName: 'PRICE',
                field: 'price',
                cellClass: 'text-end',
            },
            {
                headerName: 'VOLUME',
                field: 'volume',
                // valueGetter: params => params.data.volume / 100,
                cellClass: 'text-end',
            },
            {
                headerName: 'DONE VOLUME',
                field: 'doneVolume',
                //valueGetter: params => params.data.doneVolume / 100,
                cellClass: 'text-end',
            },
            {
                headerName: 'AMOUNT',
                valueGetter: params => params.data.price * params.data.volume,
                cellClass: 'text-end',
            },
            {
                headerName: 'NOTES',
                field: 'notes',
            },
        ],
    }

    return metaPage;
}