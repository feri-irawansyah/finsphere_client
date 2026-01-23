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
        tenantUid: "",
        appUid: "",
        clientId: "",
        clientSecret: "",
        apiId: "",
        apiSecret: "",
        expiryTime: null,
    });

    const { params } = $derived($modalStore.currentModal);
    const uid = $derived(params.uid);

    const url = `${applicationStore.urlPlatformConsole}/tenantsappscredentials`;

    onMount(async () => {
        try {
            if (!uid) return;

            const res = await fetcher(fetch, `${url}/${uid}`);

            formData = res;

            // get tenant:
            const tenantUid = await fetcher(
                fetch,
                `${applicationStore.urlPlatformConsole}/tenants/${formData.tenantUid}`,
            );

            formData.mvTenantCategory = tenantUid.mvTenantCategory;
        } catch (error) {
            console.error("error", error);
        }
    });

    async function onSubmit(e, formData) {
        let payload = {
            tenantUid: formData.tenantUid,
            appUid: formData.appUid,
            clientId: formData.clientId,
            clientSecret: formData.clientSecret,
            apiId: formData.apiId,
            apiSecret: formData.apiSecret,
            expiryTime: formData.expiryTime,
        };

        let method = "";

        if (params.actions == "create") method = "POST";
        else if (params.actions == "update") {
            method = "PUT";
            payload.tenantAppCredentialUid = formData.tenantAppCredentialUid;
        }

        await submitDataModal(e, payload, url, method);
    }
</script>

<form
    id="formSubmit-{$modalStore.id}"
    onsubmit={async (e) => await onSubmit(e, formData)}
>
    <div class="modal-body modal-scroll">
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
                    disabled={params.isFormDisabled}
                    on:change={(e) => {
                        formData.mvTenantCategory =
                            e.detail.allData.mvTenantCategory;
                        formData.serviceUid = "";
                    }}
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="appUid">App ID</label>
                <AutoSelect
                    id="appUid"
                    lookup="apps"
                    bind:value={formData.appUid}
                    labelKey={["appId", "name"]}
                    valueKey="appUid"
                    placeholder="Please choose one option"
                    disabled={params.isFormDisabled}
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="clientId">Client ID</label>
                <input
                    id="clientId"
                    type="text"
                    class="form-control"
                    bind:value={formData.clientId}
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="clientSecret">Client Secret</label>
                <input
                    id="clientSecret"
                    type="text"
                    class="form-control"
                    bind:value={formData.clientSecret}
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="apiId">API ID</label>
                <input
                    id="apiId"
                    type="text"
                    class="form-control"
                    bind:value={formData.apiId}
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="apiSecret">API Secret</label>
                <input
                    id="apiSecret"
                    type="text"
                    class="form-control"
                    bind:value={formData.apiSecret}
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="expiryTime"
                    >Expiry Time</label
                >
                <input
                    id="expiryTime"
                    type="date"
                    class="form-control"
                    bind:value={formData.expiryTime}
                    parse-date
                    required
                />
            </div>
        </div>
    </div>
</form>
