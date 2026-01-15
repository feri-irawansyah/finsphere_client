<script>
    import OrderDatafeed from "$lib/components/templates/OrderDatafeed.svelte";
    import OrderTab from "$lib/components/templates/OrderTab.svelte";
    // import { form, field } from "svelte-forms";
    // import { min, required } from "svelte-forms/validators";
    import AutoSelect from "$lib/directives/inputs/AutoSelect.svelte";


    let isSubmitting = false;
    let isFormDisabled = $state(false);
    let formData = $state({
        clientId: '',
        counterpartId: '',
        symbolId: '',
    });

    // const clientId = field("clientId", "", [required()]);
    // const counterpartId = field("counterpartId", "", [required()]);
    // const symbolId = field("symbolId", "", [required()]);

    // const myForm = form(clientId, counterpartId, symbolId);
    // console.log("myForm", $myForm);

    async function onSubmit(e, formData) {
        let payload = {
            clientId: clientId.value,
            name: formData.name,
            pwd: formData.pwd,
            //pwdExpDate: moment(formData.pwdExpDate).format("YYYY-MM-DD"),
        };

        let method = "";
        method = "POST";

        await submitDataModal(e, payload, url, method);
    }
</script>

<section id="section">
    <h2 class="page-title">Order Buy</h2>
    <div class="row">
        <div class="col-12">
            <OrderTab defaultFilter="buy">
                <div class="row g-4 mt-4">
                    <div class="col-md-5 col-sm-12 col-xs-12">
                        <form onsubmit={onSubmit}>
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
                                        lookup="client"
                                        bind:value={formData.clientId}
                                        labelKey={["clientId", "name"]}
                                        valueKey="clientId"
                                        placeholder="Choose One Option"
                                        required
                                        disabled={isFormDisabled}
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
                                        lookup="counterpart"
                                        bind:value={formData.counterpartId}
                                        labelKey={["counterpartId", "name"]}
                                        valueKey="counterpartId"
                                        placeholder="Choose One Option"
                                        required
                                        disabled={isFormDisabled}
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
                                        placeholder="Choose One Option"
                                        required
                                        disabled={isFormDisabled}
                                    />
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
                                        ng-model="formData.limit"
                                        angular-currency="optionsCurrency"
                                        variable-options="true"
                                        disabled
                                    />
                                </div>
                            </div>

                            <hr class="my-4" />

                            <!-- TYPE ORDER -->
                            <div class="row mb-4">
                                <div class="col-6">
                                    <input
                                        type="radio"
                                        ng-model="formData.ordertype"
                                        ng-value="1"
                                        ng-change="ordertype_onChange()"
                                    />
                                    Market Order
                                </div>

                                <div class="col-6">
                                    <input
                                        type="radio"
                                        ng-model="formData.ordertype"
                                        ng-value="2"
                                        ng-change="ordertype_onChange()"
                                    />
                                    Limit Order
                                </div>
                            </div>

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
                                        ng-model="formData.price"
                                        angular-currency="optionsCurrency"
                                        variable-options="true"
                                        required
                                        ng-disabled="disablePrice"
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
                                        ng-model="formData.lot"
                                        angular-currency="optionsCurrencyRounded"
                                        variable-options="true"
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
                                    100000
                                </span>
                            </div>

                            <!-- SUBMIT BUTTON -->
                            <button
                                type="submit"
                                class="btn btn-success w-100 mt-4">
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
                        <OrderDatafeed></OrderDatafeed>
                    </div>
                </div>
            </OrderTab>
        </div>
    </div>
</section>
