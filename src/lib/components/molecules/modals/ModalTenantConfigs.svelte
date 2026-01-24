<script>
    import Swal from "sweetalert2";
    import modalStore, {
        submitDataModal,
    } from "$lib/directives/modal/functions/modal-store";
    import { applicationStore } from "$lib/stores/applicationStore";
    import fetcher from "$lib/fetcher";
    import { onMount } from "svelte";

    let activeTab = $state(1);

    const { params, wizard } = $derived($modalStore.currentModal);
    const uid = $derived(params.uid);

    let formData = $state({
        serviceId: "",
        configKey: "",
        configValue: "",
    });

    const url = `${applicationStore.urlPlatformConsole}/tenantconfigs`;
    
    onMount(async () => {
        try {
            if (!uid) return;

            const res = await fetcher(fetch, `${url}/${uid}`);

            formData = res;
        } catch (error) {
            console.error("error", error);
        }
    });

    async function onSubmit(e, formData) {
        e.preventDefault();

       
        let payload = {
            serviceId: formData.serviceId,
            configKey: formData.configKey,
            configValue: formData.configValue
        };

        let method = "";

        if (params.actions == "create") method = "POST";
        else if (params.actions == "update") {
            method = "PUT";
            payload.tenantUid = formData.tenantUid;
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
                <label class="form-label" for="serviceId">Service ID</label>
                <input
                    id="serviceId"
                    type="text"
                    class="form-control"
                    bind:value={formData.serviceId}
                    placeholder="e.g. SERVICE_HANDLING"
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="configKey">Config Key</label>
                <input
                    id="configKey"
                    type="text"
                    class="form-control"
                    bind:value={formData.configKey}
                    placeholder="e.g. KEY OF CONFIGURATION"
                    required
                />
            </div>
           <div class="col-12 mb-3">
                <label class="form-label" for="configValue">Config Value</label>
                <input
                    id="configValue"
                    type="text"
                    class="form-control"
                    bind:value={formData.configValue}
                    placeholder="e.g. VALUE OF CONFIGURATION"
                    required
                />
            </div>
        </div>
    </div>
</form>
