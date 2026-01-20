<script>
    import OrderDatafeed from "$lib/components/templates/OrderDatafeed.svelte";
    import OrderTab from "$lib/components/templates/OrderTab.svelte";
    import AutoSelect from "$lib/directives/inputs/AutoSelect.svelte";
    import { submitDataModal } from "$lib/directives/modal/functions/modal-store";
    import datagridStore from "$lib/stores/gridStore";
    import {
        formatNumber,
        formatIDR,
        formatCurrencyNoIDR,
    } from "$lib/numberFormat.js";
    import { onMount } from "svelte";

    const state = $derived($datagridStore);

    onMount(() => {
        datagridStore.reset();
    });

    let formData = $state({
        clientId: "",
        sid: "",
        counterpartId: "",
        symbolId: "",
        boardId: "RG",
        limit: 0,
        price: 0,
        lot: 0,
        ordertype: 0,
    });

    let stockData = $state({
        symbolId: "",
        symbolName: "",
        lastPrice: "7,775",
        change: -25,
        changeText: "-25 (0.32%)",
    });

    formData.limit = formatCurrencyNoIDR(formData.limit);
    formData.price = formatCurrencyNoIDR(formData.price);
    formData.lot = formatCurrencyNoIDR(formData.lot);

    function onBlur(e) {
        console.log("blur", e.target);
        const el = e.target;

        // contoh: format number
        const raw = el.value.replace(/[^\d.]/g, "");
        const num = Number(raw || 0);

        el.value = formatCurrencyNoIDR(num);
    }

    function onClientChange(e) {
        const selected = e.detail;

        if (!selected) return;

        console.log("ddclient", selected.optionalvalue);

        if (formData.clientId) {
            disableBroker = false;
            formData.sid = selected.optionalvalue;
        } else {
            disableBroker = true;
            formData.sid = "";
        }
    }

    function onClientClear() {
        console.log("clientid", formData.clientId);

        formData.clientId = "";
        formData.sid = "";
        formData.counterpartId = "";
        disableBroker = true;
    }

    function onCounterpartChange(e) {
        const selected = e.detail;

        if (!selected) return;

        if (formData.clientId && formData.counterpartId) {
            if (
                formData.clientId == "FUND001" &&
                formData.counterpartId == "GI"
            )
                formData.limit = formatCurrencyNoIDR(100000000);
            else if (
                formData.clientId == "FUND001" &&
                formData.counterpartId == "VZ"
            )
                formData.limit = formatCurrencyNoIDR(200000000);
            else if (
                formData.clientId == "FUND002" &&
                formData.counterpartId == "IC"
            )
                formData.limit = formatCurrencyNoIDR(150000000);
            else if (
                formData.clientId == "FUND002" &&
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

    async function onSubmit(e, formData) {
        let payload = {
            OldOrderUid: formData.orderUid,
            Volume: formData.amendlot * 100,
            Price: formData.amendprice,
            ExternalReference: formData.orderUid,
        };

        let url = `${applicationStore["urlPlatformOMS"]}/order`;
        let method = "PUT";

        console.log("payload", payload);

        //await submitDataModal(e, payload, url, method);
    }

    $effect(() => {
        const dataRow = state?.detail;

        $inspect("dataRow", dataRow);

        if (dataRow !== undefined) {
            formData.orderUid = dataRow?.orderUid;
            formData.clientId = dataRow?.clientId;
            formData.counterpartId = dataRow?.partyId;
            formData.price = formatCurrencyNoIDR(dataRow?.price);
            formData.lot = formatCurrencyNoIDR(dataRow?.volume / 100);
            formData.tradeLimit = formatCurrencyNoIDR(dataRow?.tradeLimit);
        }
    });
</script>

<section id="section">
    <h2 class="page-title">Order Amend</h2>
    <div class="row">
        <div class="col-12">
            <OrderTab defaultFilter="amend">
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
                                        bind:value={formData.clientId}
                                        labelKey={["clientId", "formData.sid"]}
                                        valueKey="clientId"
                                        valueKeyOptional="sid"
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
                                        lookup="broker"
                                        params={{ clientId: formData.clientId }}
                                        pathParams={["clientId"]}
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
                                <div class="col-4">
                                    <input
                                        type="text"
                                        class="form-control"
                                        bind:value={formData.price}
                                        required
                                        disabled
                                    />
                                </div>
                                <div class="col-5">
                                    <input
                                        type="text"
                                        class="form-control"
                                        bind:value={formData.amendprice}
                                        onblur={onBlur}
                                        required
                                        placeholder="Change price here"
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
                                <div class="col-4">
                                    <input
                                        type="text"
                                        class="form-control"
                                        bind:value={formData.lot}
                                        required
                                        disabled
                                    />
                                </div>
                                <div class="col-5">
                                    <input
                                        type="text"
                                        class="form-control"
                                        bind:value={formData.amendlot}
                                        onblur={onBlur}
                                        required
                                        placeholder="Change lot here"
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
                                        formData.amendprice * formData.amendlot * 100,
                                    )}
                                </span>
                            </div>

                            <!-- SUBMIT BUTTON -->
                            <button
                                type="submit"
                                id="btnAmend"
                                class="btn w-100 mt-4"
                            >
                                <!-- {#if !isSubmitting} -->
                                <span class="spanwhite">Amend Order</span>
                                <!-- {:else} -->
                                <!-- <span class="spanwhite">
                                        <span
                                            class="spinner-border spinner-border-sm me-2"
                                        ></span>
                                        Processing...
                                    </span> -->
                                <!-- {/if} -->
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
    #btnAmend {
        background-color: #6c4bf4;
    }

    .spanwhite {
        color: #fff !important;
    }
</style>
