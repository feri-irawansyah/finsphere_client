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
        email: "",
        pwd: "",
        pwdExpDate: "",
        entryTime: "",
        updateTime: "",
        isEnabled: true,
    });

    const { params } = $derived(
        $modalStore.currentModal
    );

    const url = `${applicationStore.urlPlatformConsole}/permissions`;

    $effect(async () => {
        if (!params.uid) return;

        const res = await fetcher(fetch, `${url}/${params.uid}`);

        formData = res;
    });

    async function onSubmit(e, formData) {
        let payload = {
            permissionId: formData.permissionId,
            name: formData.name,
            description: formData.description,
            serviceId: formData.serviceId,
        };

        let method = "";

        if (params.actions == "create") method = "POST";
        else if (params.actions == "update") {
            method = "PUT";
            payload.permissionUid = formData.permissionUid;
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
            <div class="col-12 mb-4">
                <label class="form-label" for="permissionId">Permission ID</label>
                <input
                    id="permissionId"
                    type="text"
                    class="form-control"
                    bind:value={formData.permissionId}
                    disabled={params.isFormDisabled}
                    placeholder="e.g. Permission Add"
                    required
                />
            </div>
            <div class="col-12 mb-4">
                <label class="form-label" for="name">Name</label>
                <input
                    id="name"
                    type="text"
                    class="form-control"
                    bind:value={formData.name}
                    disabled={params.isFormDisabled}
                    placeholder="e.g. Permission Open"
                    required
                />
            </div>
            <div class="col-12 mb-4">
                <label class="form-label" for="description">Description</label>
                <textarea
                    id="description"
                    type="text"
                    class="form-control"
                    rows="6"
                    disabled={params.isFormDisabled}
                    bind:value={formData.description}
                    required
                ></textarea>
            </div>
            <div class="col-12 mb-4">
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
