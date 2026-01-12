<script>
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

    const { actions, uid, isFormDisabled } = $derived($modalStore.currentModal.params);

    const url = `${applicationStore.urlPlatformConsole}/users`;

    $effect(async () => {
        if (!uid) return;

        const res = await fetcher(fetch, `${url}/${uid}`);

        formData = res;
        formData.entryTime = moment(formData.entryTime).format("LL - LTS");
        formData.updateTime = moment(formData.updateTime).format("LL - LTS");
    });

    async function onSubmit(e, formData) {
        let payload = {
            email: formData.email,
            name: formData.name,
            pwd: formData.pwd,
            pwdExpDate: moment(formData.pwdExpDate).format("YYYY-MM-DD"),
            isEnabled: formData.isEnabled,
        };

        let method = "";

        if (actions == "create") method = "POST";
        else if (actions == "update") {
            method = "PUT";
            payload.userUid = formData.userUid;
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
                <h6 class="text-muted fw-bold">DATA INFORMATION</h6>
            </div>
            <div class="col-12 col-md-6 mb-4">
                <label class="form-label" for="name">Name</label>
                <input
                    id="name"
                    type="text"
                    class="form-control"
                    bind:value={formData.name}
                    disabled={isFormDisabled}
                    placeholder="e.g. Administrator XX Sekuritas Indonesia"
                    required
                />
            </div>
            <div class="col-12 col-md-6 mb-4">
                <label class="form-label" for="email">Email</label>
                <input
                    id="email"
                    type="email"
                    class="form-control"
                    bind:value={formData.email}
                    disabled={isFormDisabled}
                    placeholder="e.g. Administrator XX Sekuritas Indonesia"
                    required
                />
            </div>
            <div class="col-12 col-md-6 mb-4">
                <label class="form-label" for="password">Password</label>
                <input
                    id="password"
                    type="password"
                    class="form-control"
                    autocomplete="one-time-code"
                    disabled={isFormDisabled}
                    bind:value={formData.pwd}
                    required
                />
            </div>
            <div class="col-12 col-md-6 mb-4">
                <label class="form-label" for="pwdExpDate"
                    >Password Expired Date</label
                >
                <input
                    id="pwdExpDate"
                    type="date"
                    class="form-control"
                    disabled={isFormDisabled}
                    bind:value={formData.pwdExpDate}
                    parse-date
                    required
                />
            </div>
            {#if formData.userUid}
                <div class="col-12 col-md-6 mb-4">
                    <label class="form-label" for="entryTime">Entry Time</label>
                    <input
                        id="entryTime"
                        type="text"
                        class="form-control"
                        bind:value={formData.entryTime}
                        disabled
                    />
                </div>
                <div class="col-12 col-md-6 mb-4">
                    <label class="form-label" for="entryTime">Update Time</label
                    >
                    <input
                        id="entryTime"
                        type="text"
                        class="form-control"
                        bind:value={formData.updateTime}
                        disabled
                    />
                </div>
            {/if}
            <div class="col-12">
                <h6 class="text-muted">ACCESS CONTROL</h6>
            </div>
            <div class="col-12">
                <div
                    class="d-flex flex-wrap justify-content-between align-items-center gap-2"
                >
                    <div class="flex-grow-1">
                        <h6 class="mb-1 fw-normal">Enable Login Access.</h6>
                    </div>
                    <div class="form-check form-switch">
                        <input
                            id="isEnabled"
                            bind:checked={formData.isEnabled}
                            
                            class="form-check-input btn-lg"
                            type="checkbox"
                        />
                        <label class="label" for="isEnabled"></label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>
