<script>
    import OrderDatafeed from "$lib/components/templates/OrderDatafeed.svelte";
    import OrderTab from "$lib/components/templates/OrderTab.svelte";
    import AutoSelect from "$lib/directives/inputs/AutoSelect.svelte";
    import { submitDataModal } from "$lib/directives/modal/functions/modal-store";
    import datagridStore from "$lib/stores/gridStore";
    import { applicationStore } from "$lib/stores/applicationStore";
    import { onMount } from "svelte";
    import {
        formatNumber,
        formatIDR,
        formatCurrencyNoIDR,
    } from "$lib/numberFormat.js";
    

    const state = $derived($datagridStore);
    onMount(() => {
        datagridStore.reset();
    });

    let formData = $state({
        orderUid: "",
        clientId: "",
        sid: "",
        counterpartId: "",
        symbolId: "",
        boardId: "RG",
        tradeLimit: 0,
        price: 0,
        lot: 0,
        ordertype: 0
    });

    let stockData = $state({
        symbolId: "",
        symbolName: "",
        lastPrice: "7,775",
        change: -25,
        changeText: "-25 (0.32%)",
    });

    let total = $state(0);

    formData.tradeLimit = formatCurrencyNoIDR(formData.tradeLimit);
    formData.price = formatCurrencyNoIDR(formData.price);
    formData.lot = formatCurrencyNoIDR(formData.lot);

    function onClientChange(e) {
        const selected = e.detail;

        if (!selected) return;

        console.log("ddclient", selected.optionalvalue);

        if (formData.sid) {
            disableBroker = false;
            formData.clientId = selected.optionalvalue;
        } else {
            disableBroker = true;
            formData.clientId = "";
        }
    }

    function onClientClear() {
        console.log("sid", formData.sid);

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

    function resetForm() {
        formData.orderUid = "",
        formData.clientId = "";
        formData.sid = "";
        formData.counterpartId = "";
        formData.symbolId = "";
        formData.boardId = "RG";
        formData.tradeLimit = 0;
        formData.price = 0;
        formData.lot = 0;
    }

    async function onSubmit(e, formData) {
        let payload = {
            OrderUid: formData.orderUid,
            ExternalReference: formData.orderUid,
        };

        let url = `${applicationStore["urlPlatformOMS"]}/order/cancel`;
        let method = "POST";

        await submitDataModal(e, payload, url, method);
        resetForm();
    }

    $effect(() => {
        const dataRow = state?.detail;
        console.log("detail withdraw", dataRow?.partyId)

        if (dataRow !== undefined) {
            formData.orderUid = dataRow?.orderUid;
            formData.sid = dataRow?.sid;
            formData.counterpartId = dataRow?.partyId;
            formData.price = formatCurrencyNoIDR(dataRow?.price);
            formData.lot = formatCurrencyNoIDR(dataRow?.volume / 100);
            formData.tradeLimit = formatCurrencyNoIDR(dataRow?.tradeLimit);

            total = formatCurrencyNoIDR(dataRow?.price * dataRow?.volume);
        }
    });
</script>

<section id="section">
    <h2 class="page-title">Order Withdraw</h2>
    <div class="row">
        <div class="col-12">
            <OrderTab defaultFilter="withdraw">
                <div class="row g-4 mt-4">
                    <div class="col-md-5 col-sm-12 col-xs-12">
                        <form
                            onsubmit={async (e) => await onSubmit(e, formData)}
                        >
                            <!-- Order -->
                            <div class="row mb-4">
                                <div class="col-3">
                                    <label
                                        for="order"
                                        class="form-label fw-semibold"
                                        >Order</label
                                    >
                                </div>
                                <div class="col-9">
                                    <AutoSelect
                                        mapGroup="urlPlatformOMS"
                                        lookup="order"
                                        bind:value={formData.orderUid}
                                        labelKey={["clientOrderId"]}
                                        valueKey="orderUid"
                                        placeholder="Choose One Option"
                                        required
                                        disabled
                                    />
                                </div>
                            </div>

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
                                        disabled
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
                                        disabled
                                        on:change={onCounterpartChange}
                                        on:clear={onCounterpartClear}
                                    />
                                </div>
                            </div>

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
                                        bind:value={formData.tradeLimit}
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
                                        required
                                        disabled
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
                                        required
                                        disabled
                                    />
                                </div>
                            </div>

                            <!-- TOTAL ORDER -->
                            <div
                                class="d-flex justify-content-between align-items-center mt-4"
                            >
                                <span class="fw-semibold">Total Order</span>
                                <span class="fw-bold text-success">
                                    {total}
                                </span>
                            </div>

                            <!-- SUBMIT BUTTON -->
                            <button
                                type="submit"
                                id="btnWithdraw"
                                class="btn w-100 mt-4"
                            >
                                <span class="spanwhite">Withdraw Order</span>
                                <!-- <span class="spanwhite" ng-if="isSubmitting"
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

<style>
    #btnWithdraw {
        background-color: #bc6309;
    }

    .spanwhite {
        color: #fff !important;
    }
</style>
