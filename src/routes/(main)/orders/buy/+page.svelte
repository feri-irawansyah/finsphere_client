<script>
    import OrderDatafeed from "$lib/components/templates/OrderDatafeed.svelte";
    import OrderTab from "$lib/components/templates/OrderTab.svelte";
    import { currency } from "$lib/currency";
    // import { form, field } from "svelte-forms";
    // import { min, required } from "svelte-forms/validators";
    import AutoSelect from "$lib/directives/inputs/AutoSelect.svelte";
    import { submitDataModal } from "$lib/directives/modal/functions/modal-store";
    // import IDRFormatter from "$lib/tableFormatter.js";
    import {
        formatNumber,
        formatIDR,
        formatCurrencyNoIDR,
    } from "$lib/numberFormat.js";
    import { applicationStore } from "$lib/stores/applicationStore";

    let formData = $state({
        clientId: "",
        sid: "",
        counterpartId: "",
        symbolId: "",
        boardId: "RG",
        limit: 0,
        price: 0,
        lot: 0,
        ordertype: "",
        spotOrder: "",
        algoOrder: "",
        orderStrategyFinal: "",
    });

    let stockData = $state({
        symbolId: "",
        symbolName: "",
        lastPrice: "7,775",
        change: -25,
        changeText: "-25 (0.32%)",
    });

    let isSubmitting = false;
    let isFormDisabled = $state(false);
    let disableBroker = $state(true);
    let disablePrice = $state(false);

    // const clientId = field("clientId", "", [required()]);
    // const counterpartId = field("counterpartId", "", [required()]);
    // const symbolId = field("symbolId", "", [required()]);

    // const myForm = form(clientId, counterpartId, symbolId);
    // console.log("myForm", $myForm);

    // sync number → input
    formData.limit = formatCurrencyNoIDR(formData.limit);
    formData.price = formatCurrencyNoIDR(formData.price);
    formData.lot = formatCurrencyNoIDR(formData.lot);

    function onInput(e) {
        const raw = e.target.value.replace(/,/g, "");
        return Number(raw || 0);
    }

    function onBlur(e) {
        console.log("blur", e.target);
        const el = e.target;

        // contoh: format number
        const raw = el.value.replace(/[^\d.]/g, "");
        const num = Number(raw || 0);

        el.value = formatCurrencyNoIDR(num);
    }

    function onClientChange(e) {
        console.log("client change", e);
        const selected = e.detail;

        if (!selected) return;

        if (formData.sid) {
            disableBroker = false;
            formData.clientId = selected.optionalvalue;
        } else {
            disableBroker = true;
            formData.clientId = "";
        }
    }

    function onClientClear() {
        console.log("onClientClear", formData.sid);

        formData.clientId = "";
        formData.sid = "";
        formData.counterpartId = "";
        disableBroker = true;
    }

    function onCounterpartChange(e) {
        const selected = e.detail;

        if (!selected) return;

        if (formData.sid && formData.counterpartId) {
            if (
                formData.sid == "IDD456" &&
                formData.counterpartId == "IC"
            )
                formData.limit = formatCurrencyNoIDR(100000000);
            else if (
                formData.sid == "IDD456" &&
                formData.counterpartId == "VZ"
            )
                formData.limit = formatCurrencyNoIDR(200000000);
            else if (
                formData.sid == "IDD123" &&
                formData.counterpartId == "IC"
            )
                formData.limit = formatCurrencyNoIDR(150000000);
            else if (
                formData.sid == "IDD123" &&
                formData.counterpartId == "VZ"
            )
                formData.limit = formatCurrencyNoIDR(250000000);
        } else {
            formData.limit = formatCurrencyNoIDR(0);
        }
    }

    function onCounterpartClear() {
        formData.counterpartId = "";
    }

    function onSymbolChange(e) {
        console.log("stock", e.detail.optionalvalue);
        const selected = e.detail;
        if (!selected) return;

        stockData.symbolId = formData.symbolId;
        stockData.symbolName = selected.optionalvalue;
    }

    function onSymbolClear() {
        console.log("sid", formData.sid);
        formData.symbolId = "";
    }

    function onOrderStrategyChange(e) {
        console.log("orderstrategy", e.detail);
        const selected = e.detail;
        if (!selected) return;

        if (formData.orderStrategy === "CARED_ORDER") {
            formData.orderStrategyFinal = "CARED_ORDER";
            formData.spotOrder = "";
            formData.algoOrder = "";
        } else if (formData.orderStrategy === "SPOT_ORDER") {
            formData.orderStrategyFinal = formData.spotOrder;
            formData.algoOrder = "";
        } else if (formData.orderStrategy === "ALGO_ORDER") {
            formData.orderStrategyFinal = formData.algoOrder;
            formData.spotOrder = "";
        }
    }

    function onOrderStrategyClear() {
        console.log("orderStrategy", formData.orderStrategy);
        formData.orderStrategy = "";
        formData.spotOrder = "";
        formData.algoOrder = "";
        formData.orderStrategyFinal = "";
        disablePrice = false;
    }

    function onSpotOrderChange(e) {
        console.log("spotOrder", e.detail);
        const selected = e.detail;
        if (!selected) return;

        if (formData.orderStrategy === "SPOT_ORDER") {
            formData.orderStrategyFinal = formData.spotOrder;

            if(formData.spotOrder === "FAK" || formData.spotOrder === "FOK" || formData.spotOrder === "MTL") {
                formData.price = 0;
                disablePrice = true;
            }
            else {
                disablePrice = false;
            }
        }
    }

    function onSpotOrderClear() {
        console.log("spotOrder", formData.spotOrder);
        formData.spotOrder = "";
        disablePrice = false;
        formData.price = 0;

        if (formData.orderStrategy === "CARED_ORDER") {
            formData.orderStrategyFinal = "CARED_ORDER";
        }
    }

    function onAlgoOrderChange(e) {
        console.log("algoOrder", e.detail);
        const selected = e.detail;
        if (!selected) return;

        if (formData.orderStrategy === "ALGO_ORDER") {
            formData.orderStrategyFinal = formData.algoOrder;
        }
    }

    function onAlgoOrderClear() {
        console.log("algoOrder", formData.algoOrder);
        formData.algoOrder = "";

        if (formData.orderStrategy === "CARED_ORDER") {
            formData.orderStrategyFinal = "CARED_ORDER";
        }
    }

    function resetForm() {
        formData.clientId = "";
        formData.sid = "";
        formData.counterpartId = "";
        formData.symbolId = "";
        formData.boardId = "RG";
        formData.limit = 0;
        formData.price = 0;
        formData.lot = 0;
        formData.orderStrategy = "";
        formData.ordertype = "";
        formData.spotOrder = "";
        formData.algoOrder = "";
        formData.orderStrategyFinal = "";
    }

    async function onSubmit(e, formData) {
        let payload = {
            sid: formData.sid,
            CounterpartId: formData.counterpartId,
            StockId: formData.symbolId,
            ExternalReference: "0000-1111-2222-3333",
            BuySell: "BUY",
            Volume: formData.lot,
            Price: formData.price,
            OrderStrategy: formData.orderStrategyFinal,
        };

        let url = `${applicationStore["urlPlatformOMS"]}/order`;
        let method = "POST";

        await submitDataModal(e, payload, url, method);
        resetForm();
    }
</script>

<section id="section">
    <h2 class="page-title">Order Buy</h2>
    <div class="row">
        <div class="col-12">
            <OrderTab defaultFilter="buy">
                <div class="row g-4 mt-4">
                    <div class="col-md-5 col-sm-12 col-xs-12">
                        <form
                            onsubmit={async (e) => await onSubmit(e, formData)}
                        >
                            <!-- CLIENT -->
                            <div class="row mb-4">
                                <div class="col-3">
                                    <label
                                        for="client"
                                        class="form-label fw-semibold"
                                        >Client</label
                                    >
                                </div>
                                <div class="col-9">
                                    <AutoSelect
                                        lookup="clientidorderrouting"
                                        bind:value={formData.sid}
                                        labelKey={["clientId", "formData.sid"]}
                                        valueKey="sid"
                                        valueKeyOptional="clientId"
                                        placeholder="Choose One Option"
                                        required
                                        disabled={isFormDisabled}
                                        on:change={onClientChange}
                                        on:clear={onClientClear}
                                    />
                                </div>
                            </div>

                            <!-- BROKER -->
                            <div class="row mb-4">
                                <div class="col-3">
                                    <label
                                        for="broker"
                                        class="form-label fw-semibold"
                                        >Broker</label
                                    >
                                </div>
                                <div class="col-9">
                                    <AutoSelect
                                        lookup="brokerbysid"
                                        params={{ sid: formData.sid }}
                                        pathParams={["sid"]}
                                        bind:value={formData.counterpartId}
                                        labelKey={[
                                            "counterpartId",
                                            "counterpartClientId",
                                        ]}
                                        valueKey="counterpartId"
                                        placeholder="Choose One Option"
                                        required
                                        disabled={disableBroker}
                                        on:change={onCounterpartChange}
                                        on:clear={onCounterpartClear}
                                    />
                                </div>
                            </div>

                            <!-- STOCK -->
                            <div class="row mb-4">
                                <div class="col-3">
                                    <label
                                        for="stock"
                                        class="form-label fw-semibold"
                                        >Stock</label
                                    >
                                </div>
                                <div class="col-9">
                                    <AutoSelect
                                        lookup="symbols"
                                        bind:value={formData.symbolId}
                                        labelKey={["symbolId", "symbolName"]}
                                        valueKey="symbolId"
                                        valueKeyOptional="symbolName"
                                        placeholder="Choose One Option"
                                        required
                                        disabled={isFormDisabled}
                                        on:change={onSymbolChange}
                                        on:clear={onSymbolClear}
                                    />
                                </div>
                            </div>

                            <!-- ORDER STRATEGY -->
                            <div class="row mb-4">
                                <div class="col-3">
                                    <label
                                        for="stock"
                                        class="form-label fw-semibold"
                                        >Order Strategy</label
                                    >
                                </div>
                                <div class="col-9">
                                    <AutoSelect
                                        lookup="mastervalues"
                                        params={{
                                            master_value_id: "ORDER_STRATEGY",
                                        }}
                                        pathParams={["master_value_id"]}
                                        bind:value={formData.orderStrategy}
                                        labelKey={["code"]}
                                        valueKey="code"
                                        placeholder="Choose One Option"
                                        required
                                        disabled={isFormDisabled}
                                        on:change={onOrderStrategyChange}
                                        on:clear={onOrderStrategyClear}
                                    />
                                </div>
                            </div>

                            <!-- SPOT ORDER -->
                            {#if formData.orderStrategy === "SPOT_ORDER"}
                                <div class="row mb-4">
                                    <div class="col-3">
                                        <label
                                            for="stock"
                                            class="form-label fw-semibold"
                                            >Spot Order</label
                                        >
                                    </div>
                                    <div class="col-9">
                                        <AutoSelect
                                            lookup="mastervalues"
                                            params={{
                                                master_value_id: "SPOT_ORDER",
                                            }}
                                            pathParams={["master_value_id"]}
                                            bind:value={formData.spotOrder}
                                            labelKey={["code"]}
                                            valueKey="code"
                                            placeholder="Choose One Option"
                                            required
                                            disabled={isFormDisabled}
                                            on:change={onSpotOrderChange}
                                            on:clear={onSpotOrderClear}
                                        />
                                    </div>
                                </div>
                            {/if}

                            <!-- ALGO ORDER -->
                            {#if formData.orderStrategy === "ALGO_ORDER"}
                                <div class="row mb-4">
                                    <div class="col-3">
                                        <label
                                            for="stock"
                                            class="form-label fw-semibold"
                                            >Algo Order</label
                                        >
                                    </div>
                                    <div class="col-9">
                                        <AutoSelect
                                            lookup="mastervalues"
                                            params={{
                                                master_value_id: "ALGO_ORDER",
                                            }}
                                            pathParams={["master_value_id"]}
                                            bind:value={formData.algoOrder}
                                            labelKey={["code"]}
                                            valueKey="code"
                                            placeholder="Choose One Option"
                                            required
                                            disabled={isFormDisabled}
                                            on:change={onAlgoOrderChange}
                                            on:clear={onAlgoOrderClear}
                                        />
                                    </div>
                                </div>
                            {/if}

                            <!-- LIMIT -->
                            <div class="row mb-4">
                                <div class="col-3">
                                    <label
                                        for="limit"
                                        class="form-label fw-semibold mt-3"
                                        >Limit</label
                                    >
                                </div>
                                <div class="col-9">
                                    <input
                                        type="text"
                                        class="form-control bg-light"
                                        bind:value={formData.limit}
                                        variable-options="true"
                                        disabled
                                    />
                                </div>
                            </div>

                            <hr class="my-4" />

                            <!-- PRICE -->
                            <div class="row mb-4">
                                <div class="col-3">
                                    <label
                                        for="price"
                                        class="form-label fw-semibold"
                                        >Price</label
                                    >
                                </div>
                                <div class="col-9">
                                    <input
                                        type="text"
                                        class="form-control"
                                        bind:value={formData.price}
                                        onblur={onBlur}
                                        required
                                        disabled={disablePrice}
                                    />
                                </div>
                            </div>

                            <!-- LOT -->
                            <div class="row mb-4">
                                <div class="col-3">
                                    <label
                                        for="lot"
                                        class="form-label fw-semibold"
                                        >Lot</label
                                    >
                                </div>
                                <div class="col-9">
                                    <input
                                        type="text"
                                        class="form-control"
                                        bind:value={formData.lot}
                                        onblur={onBlur}
                                        required
                                    />
                                </div>
                            </div>

                            <!-- TOTAL ORDER -->
                            <div
                                class="d-flex justify-content-between align-items-center mt-4"
                            >
                                <span class="fw-semibold">Total Order</span>
                                <span class="fw-bold text-success">
                                    {formatCurrencyNoIDR(
                                        formData.price * formData.lot * 100,
                                    )}
                                </span>
                            </div>

                            <!-- SUBMIT BUTTON -->
                            <button
                                type="submit"
                                class="btn btn-success w-100 mt-4"
                            >
                                <span ng-if="!isSubmitting">Buy Order</span>
                                <!-- <span ng-if="isSubmitting"
                                    ><span
                                        class="spinner-border spinner-border-sm me-2"
                                    ></span>Processing...</span
                                > -->
                            </button>
                        </form>
                    </div>

                    <div class="col-md-7 col-sm-12 col-xs-12">
                        <OrderDatafeed bind:stock={stockData}></OrderDatafeed>
                    </div>
                </div>
            </OrderTab>
        </div>
    </div>
</section>

<div class="bg-secondary" style="height: 12px;">&nbsp;</div>
