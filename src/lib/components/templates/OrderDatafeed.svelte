<script>
    let { children, stock = $bindable() } = $props();

    // let stock = {
    //     symbolId: "",
    //     symbolName: "",
    //     lastPrice: "7,775",
    //     change: -25,
    //     changeText: "-25 (0.32%)",
    // };

    let bidOfferList = [
        {
            bidOrd: 51,
            bidLot: 83,
            bid: 7750,
            offer: 7775,
            offerLot: 83,
            offerOrd: 51,
        },
        {
            bidOrd: 2,
            bidLot: 50,
            bid: 7725,
            offer: 7800,
            offerLot: 50,
            offerOrd: 2,
        },
        {
            bidOrd: 51,
            bidLot: 994,
            bid: 7700,
            offer: 7825,
            offerLot: 60,
            offerOrd: 22,
        },
    ];

    function updateFromChild() {
        stock = {
        ...stock,
        lastPrice: '7,900'
        };
    }
</script>

<div class="order-right-panel">
    <!-- HEADER STOCK -->
    <div class="stock-header d-flex justify-content-between align-items-start">
        <div>
            <h4 class="stock-code">{stock.symbolId}</h4>
            <div class="stock-name">{stock.symbolName}</div>
        </div>

        <div class="stock-price text-end">
            <div class="last-price">{stock.lastPrice}</div>
            <div
                class:text-danger={stock.change < 0}
                class:text-success={stock.change > 0}>
                {stock.changeText}
            </div>
        </div>
    </div>

    <!-- PRICE GRID -->
    <div class="border rounded p-3 price-info-grid-compact">
        <div class="pi-item">
            <span class="pi-label">Open</span>
            <span class="pi-value text-success">7,850</span>
        </div>

        <div class="pi-item">
            <span class="pi-label">Close</span>
            <span class="pi-value">7,800</span>
        </div>

        <div class="pi-item">
            <span class="pi-label">Chg</span>
            <span class="pi-value text-danger">25 (0.32%)</span>
        </div>

        <div class="pi-item">
            <span class="pi-label">High</span>
            <span class="pi-value text-success">7,850</span>
        </div>

        <div class="pi-item">
            <span class="pi-label">Low</span>
            <span class="pi-value text-danger">7,725</span>
        </div>

        <div class="pi-item">
            <span class="pi-label">Avg</span>
            <span class="pi-value">7,776</span>
        </div>

        <div class="pi-item">
            <span class="pi-label">Value</span>
            <span class="pi-value">3,35B</span>
        </div>

        <div class="pi-item">
            <span class="pi-label">Volume</span>
            <span class="pi-value">431K</span>
        </div>

        <div class="pi-item">
            <span class="pi-label">Freq</span>
            <span class="pi-value">563</span>
        </div>

        <div class="pi-item">
            <span class="pi-label">IEP</span>
            <span class="pi-value">3,35B</span>
        </div>

        <div class="pi-item">
            <span class="pi-label">IEV</span>
            <span class="pi-value">563</span>
        </div>
    </div>

    <!-- BID OFFER TABLE (Tetap sama) -->
    <table class="table bid-offer-table mt-2">
        <thead>
            <tr>
                <th>ORD</th>
                <th>LOT</th>
                <th>BID</th>
                <th>OFFER</th>
                <th>LOT</th>
                <th>ORD</th>
            </tr>
        </thead>

        <tbody>
            <!-- <tr ng-repeat="x in bidOfferList">
                <td>{{ x.bidOrd }}</td>
                <td>{{ x.bidLot }}</td>
                <td class="text-danger">{{ x.bid }}</td>
                <td class="text-success">{{ x.offer }}</td>
                <td>{{ x.offerLot }}</td>
                <td>{{ x.offerOrd }}</td>
            </tr> -->
            {#each bidOfferList as x}
                <tr>
                    <td>{x.bidOrd}</td>
                    <td>{x.bidLot}</td>
                    <td class="text-danger">{x.bid}</td>
                    <td class="text-success">{x.offer}</td>
                    <td>{x.offerLot}</td>
                    <td>{x.offerOrd}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

{@render children?.()}

<style>
    /* Panel wrapper */
    .order-right-panel {
        background: #fff;
        padding: 10px 15px;
        border-radius: 10px;
    }

    /* Header stock */
    .stock-header {
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
        margin-bottom: 12px;
    }

    .stock-code {
        font-size: 20px;
        font-weight: 700;
    }

    .stock-name {
        font-size: 12px;
        color: #666;
    }

    .last-price {
        font-size: 20px;
        font-weight: 700;
    }

    .change {
        font-size: 12px;
    }

    /* PRICE GRID COMPACT */
    .price-info-grid-compact {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 25px;
        row-gap: 6px;
        margin-bottom: 15px;
    }

    .pi-item {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
    }

    .pi-label {
        font-size: 11px;
        color: #888;
    }

    .pi-value {
        font-weight: 600;
    }

    /* Bid Offer Table */
    .bid-offer-table {
        font-size: 12px;
        border-collapse: separate;
        border-spacing: 0 4px;
    }

    .bid-offer-table td {
        background: #fafafa;
        padding: 6px 8px;
    }

    /* Supaya cell tidak terlalu rapat */
    .ag-cell.state-col {
        padding-top: 10px !important;
        padding-bottom: 10px !important;
        line-height: normal !important;
    }

    /* .badge-state {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    display: inline-block;
    text-align: center;
} */

    .badge-state {
        display: inline-block;
        padding: 4px 14px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 500;
        margin: 0 auto;
        /* center */
        margin-left: 6px;
        /* jarak kiri-kanan */
        margin-right: 6px;
        white-space: nowrap;
    }

    .badge-wait_release {
        background: #e6f0ff;
        color: #6c4bf4;
    }

    .badge-open {
        background: #e6f0ff;
        color: #0980bc;
    }

    .badge-opening {
        background: #e6f0ff;
        color: #0980bc;
    }

    .badge-match {
        background: #e1f7f2;
        color: #09bc8a;
    }

    .badge-partial {
        background: #e6f7f5;
        color: #048460;
    }

    .badge-rejected {
        background: #fde7ec;
        color: #bc094b;
    }

    /* Amend */
    .badge-replacing {
        background: #fff0e6;
        color: #bc6309;
    }

    .badge-replaced {
        background: #fff0e6;
        color: #bc6309;
    }

    /* Withdraw */
    .badge-cancelling {
        background: #e0e2e6;
        color: #bc8c09;
    }

    .badge-cancelled {
        background: #e0e2e6;
        color: #bc8c09;
    }

    .badge-expired {
        background: #fde7ec;
        color: #bc094b;
    }

    .badge-rejected {
        background: #fde7ec;
        color: #bc094b;
    }
</style>
