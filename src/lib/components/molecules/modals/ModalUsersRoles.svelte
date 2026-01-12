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
        userUid: "",
        roleUid: "",
    });

    const { actions, uid } = $derived($modalStore.params);

    const url = `${$applicationStore.urlPlatformConsole}/usersroles`;

    $effect(async () => {
        if (!uid) return;

        const res = await fetcher(fetch, `${url}/${uid}`);

        formData = res;
    });

    async function onSubmit(e, formData) {
        let payload = {
            userUid: formData.userUid,
            roleUid: formData.roleUid,
        };

        let method = "";

        if (actions == "create") method = "POST";
        else if (actions == "update") {
            method = "PUT";
            payload.userRoleUid = formData.userRoleUid;
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
                <label class="form-label" for="userUid">User ID</label>
                <AutoSelect
                    lookup="users"
                    bind:value={formData.userUid}
                    labelKey={["name", "email"]}
                    valueKey="userUid"
                    placeholder="Select User"
                    required
                    disabled={$modalStore.params.isFormDisabled}
                />
            </div>
            <div class="col-12 mb-4">
                <label class="form-label" for="roleUid">Role ID</label>
                <AutoSelect
                    lookup="roles"
                    bind:value={formData.roleUid}
                    labelKey={["roleId", "description"]}
                    valueKey="roleUid"
                    placeholder="Select User"
                    required
                    disabled={$modalStore.params.isFormDisabled}
                />
            </div>
        </div>
    </div>
</form>
