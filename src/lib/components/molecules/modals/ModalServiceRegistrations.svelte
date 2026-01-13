<script>
    import AutoSelect from "$lib/directives/inputs/AutoSelect.svelte";
    import modalStore, {
        submitDataModal,
    } from "$lib/directives/modal/functions/modal-store";
    import fetcher from "$lib/fetcher";
    import { applicationStore } from "$lib/stores/applicationStore";
    import moment from "moment";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let formData = $state({
        serviceUid: "",
        tenantUid: "",
        isDisabled: "",
        registerTime: "",
        mvTenantCategory: "",
    });

    const { params } = $derived($modalStore.currentModal);
    const uid = $derived(params.uid);

    const url = `${applicationStore.urlPlatformConsole}/serviceregistrations`;

    $effect(async () => {
        if (!uid) return;

        const res = await fetcher(fetch, `${url}/${uid}`);

        formData = res;

        // get tenant:
        const tenantUid = await fetcher(
            fetch,
            `${applicationStore.urlPlatformConsole}/tenants/${formData.tenantUid}`,
        );

        formData.mvTenantCategory = tenantUid.mvTenantCategory;
    });

    async function onSubmit(e, formData) {
        let payload = {
            serviceUid: formData.serviceUid,
            tenantUid: formData.tenantUid,
            isDisabled: formData.isDisabled,
            registerTime: formData.registerTime,
        };

        let method = "";

        if (params.actions == "create") method = "POST";
        else if (params.actions == "update") {
            method = "PUT";
            payload.serviceRegistrationUid = formData.serviceRegistrationUid;
            delete payload.registerTime;
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
                <label class="form-label" for="tenantUid">Tenant ID</label>
                <AutoSelect
                    id="tenantUid"
                    lookup="tenants"
                    bind:value={formData.tenantUid}
                    labelKey={["tenantId", "name"]}
                    valueKey="tenantUid"
                    placeholder="Please choose one option"
                    on:change={(e) => {
                        formData.mvTenantCategory =
                            e.detail.allData.mvTenantCategory;
                        formData.serviceUid = "";
                    }}
                    required
                    disabled={params.isFormDisabled}
                />
            </div>
            {#if formData.mvTenantCategory}
                <div class="col-12 mb-3">
                    <label class="form-label" for="serviceUid"
                        >Service ID ({formData.mvTenantCategory})</label
                    >
                    <AutoSelect
                        id="serviceUid"
                        lookup="servicesbytenantcategory/{formData.mvTenantCategory}"
                        bind:value={formData.serviceUid}
                        labelKey={["serviceId", "name"]}
                        valueKey="serviceUid"
                        placeholder="Please choose one option"
                        required
                        disabled={params.isFormDisabled}
                    />
                </div>
            {/if}
            <div class="col-12 mb-3">
                <label class="form-label" for="registerTime"
                    >Register Time</label
                >
                <input
                    id="registerTime"
                    type="date"
                    class="form-control"
                    disabled={params.isFormDisabled}
                    bind:value={formData.registerTime}
                    parse-date
                    required
                />
            </div>
            <div class="col-12">
                <div
                    class="d-flex flex-wrap justify-content-between align-items-center gap-2"
                >
                    <div class="flex-grow-1">
                        <h6 class="mb-1 fw-normal">Disabled</h6>
                    </div>
                    <div class="form-check form-switch">
                        <input
                            id="isDisabled"
                            bind:checked={formData.isDisabled}
                            disabled={params.isFormDisabled}
                            class="form-check-input btn-lg"
                            type="checkbox"
                        />
                        <label class="label" for="isDisabled"></label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>
