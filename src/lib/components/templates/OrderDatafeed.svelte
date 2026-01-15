<script>
    const { children, defaultFilter } = $props();

    const filter = $derived(defaultFilter);

    $inspect(filter);

</script>

<div class="order-right-panel">

    <!-- HEADER STOCK -->
    <div class="stock-header d-flex justify-content-between align-items-start">
        <div>
            <!-- <h4 class="stock-code">{{ stock.symbolId }}</h4>
            <div class="stock-name">{{ stock.symbolName }}</div> -->
            <h4 class="stock-code">AALI</h4>
            <div class="stock-name">Astra Agro Lestari</div>
        </div>

        <!-- <div class="stock-price text-end">
            <div class="last-price">{{ stock.lastPrice }}</div>
            <div class="change" ng-class="{'text-success': stock.change > 0, 'text-danger': stock.change < 0}">
                {{ stock.changeText }}
            </div>
        </div> -->
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
        </tbody>
    </table>
</div>

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
    background: #E6F0FF;
    color: #6C4BF4;
}

.badge-open {
    background: #E6F0FF;
    color: #0980BC;
}

.badge-opening {
    background: #E6F0FF;
    color: #0980BC;
}

.badge-match {
    background: #E1F7F2;
    color: #09BC8A;
}

.badge-partial {
    background: #E6F7F5;
    color: #048460;
}

.badge-rejected {
    background: #FDE7EC;
    color: #BC094B;
}

/* Amend */
.badge-replacing {
    background: #FFF0E6;
    color: #BC6309;
}

.badge-replaced {
    background: #FFF0E6;
    color: #BC6309;
}

/* Withdraw */
.badge-cancelling {
    background: #E0E2E6;
    color: #BC8C09;
}

.badge-cancelled {
    background: #E0E2E6;
    color: #BC8C09;
}

.badge-expired {
    background: #FDE7EC;
    color: #BC094B;
}

.badge-rejected {
    background: #FDE7EC;
    color: #BC094B;
}
</style>

{@render children?.()}
