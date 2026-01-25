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
        apiPermissionId: "",
        name: "",
        description: "",
        serviceId: "",
    });

    const { params } = $derived($modalStore.currentModal);
    const uid = $derived(params.uid);

    const url = `${applicationStore.urlPlatformConsole}/apipermissions`;

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
        let payload = {
            apiPermissionId: formData.apiPermissionId,
            name: formData.name,
            description: formData.description,
            serviceId: formData.serviceId,
        };

        let method = "";

        if (params.actions == "create") method = "POST";
        else if (params.actions == "update") {
            method = "PUT";
            payload.apiPermissionUid = formData.apiPermissionUid;
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
                <label class="form-label" for="apiPermissionId">API Permission ID</label>
                <input
                    id="apiPermissionId"
                    type="text"
                    class="form-control"
                    bind:value={formData.apiPermissionId}
                    placeholder="e.g. API_PERM_001"
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
                    bind:value={formData.description}
                    required
                ></textarea>
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="serviceId">Service ID</label>
                  <AutoSelect
                    id="serviceId"
                    lookup="services"
                    bind:value={formData.serviceId}
                    labelKey={["serviceId", "name"]}
                    valueKey="serviceId"
                    placeholder="Please choose one option"
                    required
                    disabled={params.isFormDisabled}
                />
            </div>
        </div>
    </div>
</form>
