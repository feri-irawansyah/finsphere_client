<script>
    import AutoSelect from "$lib/directives/inputs/AutoSelect.svelte";
    import modalStore, {
        submitDataModal,
    } from "$lib/directives/modal/functions/modal-store";
    import fetcher from "$lib/fetcher"
    import { applicationStore } from "$lib/stores/applicationStore";
    import moment from "moment";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let formData = $state({
        name: "",
        description: "",
        serviceId: "",
        mvServiceCategory: "",
        tenantCategoryFlags: "",
        tenantCategoryFlagsList: ""
    });

    const { actions, uid } = $derived($modalStore.params);

    const url = `${$applicationStore.urlPlatformConsole}/services`;

    $effect(async () => {
        if (!uid) return;

        const res = await fetcher(fetch, `${url}/${uid}`);

        formData = res;
    });

    async function onSubmit(e, formData) {
        let payload = {
            name: formData.name,
            description: formData.description,
            serviceId: formData.serviceId,
            mvServiceCategory: formData.mvServiceCategory,
            tenantCategoryFlags: formData.tenantCategoryFlags || 0,
            tenantCategoryFlagsList: formData.tenantCategoryFlagsList,
        };

        let method = "";

        if (actions == "create") method = "POST";
        else if (actions == "update") {
            method = "PUT";
            payload.serviceUid = formData.serviceUid;
        }

        await submitDataModal(e, payload, url, method);
    }
</script>

<form
    id="formSubmit-{$modalStore.id}"
    onsubmit={async (e) => await onSubmit(e, formData)}
>
    <div class="modal-body">
        <div class="row">
            <div class="col-12 mb-3">
                <label class="form-label" for="serviceId">Service ID</label>
                <input
                    id="serviceId"
                    type="text"
                    class="form-control"
                    bind:value={formData.serviceId}
                    disabled={$modalStore.params.isFormDisabled}
                    placeholder="e.g. ORDER_HANDLING"
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="name">Name</label>
                <input
                    id="name"
                    type="text"
                    class="form-control"
                    bind:value={formData.name}
                    disabled={$modalStore.params.isFormDisabled}
                    placeholder="e.g. Order Handling Service"
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="description">Description</label>
                <textarea
                    id="description"
                    type="text"
                    class="form-control"
                    rows="6"
                    disabled={$modalStore.params.isFormDisabled}
                    bind:value={formData.description}
                    required
                ></textarea>
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="serviceUid">Service Category</label>
                <AutoSelect
                    lookup="mastervalues/SERVICE_CATEGORY"
                    bind:value={formData.mvServiceCategory}
                    labelKey={["code"]}
                    valueKey="code"
                    placeholder="Please choose one option"
                    required
                    disabled={$modalStore.params.isFormDisabled}
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="serviceUid">Tenant Category Flags</label>
                <AutoSelect
                    lookup="mastervalues/TENANT_CATEGORY"
                    bind:value={formData.mvServiceCategory}
                    labelKey={["code"]}
                    valueKey="code"
                    placeholder="Please choose options"
                    required
                    disabled={$modalStore.params.isFormDisabled}
                />
            </div>
        </div>
    </div>
</form>
