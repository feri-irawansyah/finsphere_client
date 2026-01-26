import Swal from "sweetalert2";

export const load = () => {

    const metaPage = {
        title: 'Trades List',
        tableName: 'trades',
        rowIdField: 'tradeUid',
        columns: [
            // {
            //     headerName: "No.",
            //     valueGetter: "node.rowIndex + 1",
            //     width: 50,
            //     pinned: 'left',
            //     filter: false,
            //     menuTabs: [],
            //     cellClass: 'text-center',
            //     headerClass: 'text-center',
            // },
            {
                headerName: 'Trade Uid',
                field: 'tradeUid',
                hide: true,
            },
            {
                headerName: 'TIME',
                field: 'entryTime',
            },
            {
                headerName: 'Ext. Reference',
                field: 'externalReference',
            },
            {
                headerName: 'MKTID',
                field: 'marketTradeId',
            },
            {
                headerName: 'BROKER',
                field: 'counterpartbrokerId',
            },
            {
                headerName: 'PRICE',
                field: 'price',
                //valueFormatter: params => $rootScope.currencyFormat(params.value),
                cellClass: 'text-end',
            },
            {
                headerName: 'VOLUME',
                field: 'volume',
                // valueGetter: params => params.data.volume / 100,
                cellClass: 'text-end',
            },
        ]
    }

    return metaPage;
}