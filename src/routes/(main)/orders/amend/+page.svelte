<script>
    import OrderDatafeed from "$lib/components/templates/OrderDatafeed.svelte";
    import OrderTab from "$lib/components/templates/OrderTab.svelte";

    let isSubmitting = false;

    // ganti orderAmendForm.$invalid
    // ini contoh sederhana, nanti bisa kamu sambungkan ke validasi form kamu
    let isFormInvalid = false;

    async function submit(e) {
        e.preventdefault;
        if (!formAmend.checkValidity()) {
      formAmend.reportValidity(); // munculin pesan browser
      return;
    }

        isSubmitting = true;
        try {
            // call API / SignalR / backend
            await new Promise(r => setTimeout(r, 3000)); // simulasi API
        } finally {
            isSubmitting = false;
        }
    }
</script>

<section id="section">
    <h2 class="page-title">Order Amend</h2>
    <div class="row">
        <div class="col-12">
            <OrderTab defaultFilter="amend">
                <div class="row g-4 mt-4">
                    <div class="col-md-5 col-sm-12 col-xs-12">
                        <form
                            onsubmit={submit}
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
                                    <select2-dynamic
                                        mapgroup="oms"
                                        table="order"
                                        ng-model="formData.orderUid"
                                        value-field="orderUid"
                                        text-field="clientOrderId"
                                        sub-text-field=""
                                        required="true"
                                        default-data=""
                                        disabled="true"
                                        ng-change="orderUid_onChange()"
                                    >
                                    </select2-dynamic>
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
                                    <select2-dynamic
                                        mapgroup="console"
                                        table="clientidorderrouting"
                                        ng-model="formData.clientId"
                                        value-field="clientId"
                                        text-field="clientId"
                                        sub-text-field="sid"
                                        required="true"
                                        default-data=""
                                        disabled="true"
                                        ng-change="clientId_onChange(value)"
                                    >
                                    </select2-dynamic>
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
                                    <select2-dynamic
                                        ng-model="formData.counterpartId"
                                        mapgroup="console"
                                        table="broker"
                                        lookup="formData.clientId"
                                        value-field="counterpartId"
                                        text-field="counterpartId"
                                        sub-text-field="counterpartClientId"
                                        default-data=""
                                        required="true"
                                        disabled="disableBroker"
                                        ng-change="counterpartId_onChange()"
                                    >
                                    </select2-dynamic>
                                </div>
                            </div>

                            <!-- STOCK BALANCE -->
                            <!-- <div class="row mb-4">
                <div class="col-3">
                    <label class="form-label fw-semibold mt-3">Stock Balance</label>
                </div>
                <div class="col-9">
                    <input type="text" class="form-control bg-light" ng-model="formData.balance" disabled />
                </div>
            </div> -->

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
                                        ng-model="formData.tradeLimit"
                                        angular-currency="optionsCurrency"
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
                                <div class="col-4">
                                    <input
                                        type="text"
                                        class="form-control"
                                        ng-model="formData.price"
                                        angular-currency="optionsCurrency"
                                        variable-options="true"
                                        required
                                        disabled
                                    />
                                </div>
                                <div class="col-5">
                                    <input
                                        type="text"
                                        class="form-control"
                                        ng-model="formData.amendprice"
                                        angular-currency="optionsCurrency"
                                        variable-options="true"
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
                                        ng-model="formData.lot"
                                        angular-currency="optionsCurrencyRounded"
                                        variable-options="true"
                                        required
                                        disabled
                                    />
                                </div>
                                <div class="col-5">
                                    <input
                                        type="text"
                                        class="form-control"
                                        ng-model="formData.amendlot"
                                        angular-currency="optionsCurrencyRounded"
                                        variable-options="true"
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
                                    100000
                                </span>
                            </div>
                            <p>{isSubmitting}</p>

                            <!-- SUBMIT BUTTON -->
                            <button
                                type="submit"
                                id="btnAmend"
                                class="btn w-100 mt-4"
                                disabled={isSubmitting}
                            >
                                {#if !isSubmitting}
                                    <span class="spanwhite">Amend Order</span>
                                {:else}
                                    <span class="spanwhite">
                                        <span
                                            class="spinner-border spinner-border-sm me-2"
                                        ></span>
                                        Processing...
                                    </span>
                                {/if}
                            </button>
                        </form>
                    </div>

                    <div class="col-md-7 col-sm-12 col-xs-12">
                        <OrderDatafeed></OrderDatafeed>
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
