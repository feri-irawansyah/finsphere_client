<script>
    import InputPassword from "$lib/directives/inputs/InputPassword.svelte";
    import modalStore, {
        submitDataModal,
    } from "$lib/directives/modal/functions/modal-store";
    import fetcher from "$lib/fetcher";
    import { applicationStore } from "$lib/stores/applicationStore";
    import moment from "moment";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let formData = $state({
        appId: "",
        name: "",
        description: "",
        entryTime: "",
        updateTime: "",
    });

    const { params } = $derived($modalStore.currentModal);
    const uid = $derived(params.uid);

    const url = `${applicationStore.urlPlatformConsole}/apps`;

    let availablePermissions = $state([]);
    let selectedPermissions = $state([]);

    onMount(async () => {
        try {
            const resPermissionsList = await fetcher(
                fetch,
                `${applicationStore.urlPlatformConsole}/apipermissionsbyserviceidregistered`,
            );

            availablePermissions = resPermissionsList.map((item) => ({
                name: item.name,
                apiPermissionUid: item.apiPermissionUid,
                checked: false,
            }));

            if (!uid) return;

            const res = await fetcher(fetch, `${url}/${uid}`);

            formData = res;
            formData.entryTime = moment(res.entryTime).format("LL - LTS");
            formData.updateTime = moment(res.updateTime).format("LL - LTS");

            const resSelectedPermissionsList = await fetcher(
                fetch,
                `${applicationStore.urlPlatformConsole}/appsapipermissionsbyappuid/${uid}`,
            );

            const apiPermissionUids = resSelectedPermissionsList.map(
                (rp) => rp.apiPermissionUid,
            );

            selectedPermissions = availablePermissions.filter((p) =>
                apiPermissionUids.includes(p.apiPermissionUid),
            );

            availablePermissions = availablePermissions.filter(
                (p) => !apiPermissionUids.includes(p.apiPermissionUid),
            );
        } catch (error) {
            console.error("error", error);
        }
    });

     function existsInSelected(apiPermissionUid) {
        return selectedPermissions.some(
            (p) => p.apiPermissionUid === apiPermissionUid,
        );
    }

    function moveRight() {
        const selectedSet = new Set(
            selectedPermissions.map((p) => p.apiPermissionUid),
        );

        const moved = availablePermissions.filter((p) => p.checked);

        availablePermissions = availablePermissions.filter((p) => !p.checked);

        selectedPermissions = [
            ...selectedPermissions,
            ...moved
                .map((p) => ({ ...p, checked: false }))
                .filter((p) => !selectedSet.has(p.apiPermissionUid)),
        ];
    }

    function moveAllRight() {
        selectedPermissions = [
            ...selectedPermissions,
            ...availablePermissions
                .map((p) => ({ ...p, checked: false }))
                .filter((p) => !existsInSelected(p.apiPermissionUid)),
        ];

        availablePermissions = [];
    }

    function moveLeft() {
        const moved = selectedPermissions.filter((p) => p.checked);
        if (moved.length === 0) return;

        const currentAvailable = availablePermissions;

        selectedPermissions = selectedPermissions.filter((p) => !p.checked);

        availablePermissions = [
            ...currentAvailable,
            ...moved
                .map((p) => ({ ...p, checked: false }))
                .filter(
                    (p) =>
                        !currentAvailable.some(
                            (x) => x.apiPermissionUid === p.apiPermissionUid,
                        ),
                ),
        ];
        console.log("hee 5");
    }

    function moveAllLeft() {
        availablePermissions = [
            ...availablePermissions,
            ...selectedPermissions
                .map((p) => ({ ...p, checked: false }))
                .filter(
                    (p) =>
                        !availablePermissions.some(
                            (x) => x.apiPermissionUid === p.apiPermissionUid,
                        ),
                ),
        ];

        selectedPermissions = [];
    }

    async function onSubmit(e, formData) {
        let payload = {
            appId: formData.appId,
            name: formData.name,
            description: formData.description,
            apiPermissionUids: selectedPermissions.map(p => p.apiPermissionUid)
        };

        let method = "";

        if (params.actions == "create") method = "POST";
        else if (params.actions == "update") {
            method = "PUT";
            payload.appUid = formData.appUid;
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
                <label class="form-label" for="appid">App ID</label>
                <input
                    id="appid"
                    type="text"
                    class="form-control"
                    bind:value={formData.appId}
                    placeholder="e.g. Adm"
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
                    placeholder="e.g. Administrator XX Sekuritas Indonesia"
                    required
                />
            </div>
            <div class="col-12  mb-3">
                <label class="form-label" for="password">Description</label>
                 <textarea
                    id="description"
                    type="text"
                    class="form-control"
                    rows="6"
                    bind:value={formData.description}
                    placeholder="e.g. Role Administrator"
                    required
                 ></textarea>
            </div>

            <div class="col-12 mb-3">
                <h6 class="text-muted fw-bold">ASSIGNED PERMISSION</h6>
            </div>
            <div class="col-12">
                <div class="permission-box">
                    <!-- LEFT -->
                    <div class="panel">
                        <p class="form-label">Available Permission</p>
                        <small
                            >{availablePermissions.length} option(s) available</small
                        >

                        <div class="list">
                            {#each availablePermissions as p}
                                <label>
                                    <div
                                        class="form-check check-soft-secondary"
                                    >
                                        <input
                                            id={p.apiPermissionUid}
                                            type="checkbox"
                                            class="form-check-input"
                                            bind:checked={p.checked}
                                        />

                                        <label
                                            class="form-check-label"
                                            for={p.apiPermissionUid}
                                        >
                                            <small>{p.name}</small>
                                        </label>
                                    </div>
                                </label>
                            {/each}
                        </div>
                    </div>

                    <!-- BUTTONS -->
                    <div class="buttons mt-5 pt-1">
                        <button
                            type="button"
                            class="btn btn-outline-primary p-1"
                            onclick={moveAllRight}>&gt;&gt;</button
                        >
                        <button
                            type="button"
                            class="btn btn-outline-primary p-1"
                            onclick={moveRight}>&gt;</button
                        >
                        <button
                            type="button"
                            class="btn btn-outline-primary p-1"
                            onclick={moveLeft}>&lt;</button
                        >
                        <button
                            type="button"
                            class="btn btn-outline-primary p-1"
                            onclick={moveAllLeft}>&lt;&lt;</button
                        >
                        <!-- 
                        <button
                            type="button"
                            class="btn btn-dashed-dark"
                            ng-click="moveAllRight()"
                            ng-disabled="availablePermissions.length == 0"
                            >&gt;</button
                        >
                        <button
                            type="button"
                            class="btn btn-dashed-dark"
                            ng-click="moveRight()"
                            ng-disabled="availablePermissions.length == 0"
                            >&gt;</button
                        >
                        <button
                            type="button"
                            class="btn btn-dashed-dark"
                            ng-click="moveLeft()"
                            ng-disabled="selectedPermissions.length == 0"
                            >&lt;</button
                        >
                        <button
                            type="button"
                            class="btn btn-dashed-dark"
                            ng-click="moveAllLeft()"
                            ng-disabled="selectedPermissions.length == 0"
                            >&lt;&lt;</button
                        > -->
                    </div>

                    <!-- RIGHT -->
                    <div class="panel">
                        <p class="form-label">Selected Permission</p>
                        <small
                            >{selectedPermissions.length} option(s) selected</small
                        >

                        <div class="list">
                            {#if selectedPermissions.length === 0}
                                <div class="empty">
                                    <div class="permission-empty-state">
                                        <div class="permission-empty-content">
                                            <img
                                                src="/img/common/inbox.png"
                                                alt="img-01"
                                            />
                                            <p class="text-primary">
                                                Nothing assigned
                                            </p>
                                            <p>
                                                Select items from the left to
                                                add permissions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            {/if}

                            {#each selectedPermissions as p}
                                <label>
                                    <div
                                        class="form-check check-soft-secondary"
                                    >
                                        <input
                                            id={p.apiPermissionUid}
                                            type="checkbox"
                                            bind:checked={p.checked}
                                            class="form-check-input"
                                        />
                                        <label
                                            class="form-check-label"
                                            for={p.apiPermissionUid}
                                        >
                                            <small>{p.name}</small>
                                        </label>
                                    </div>
                                </label>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    </div>
</form>


<style>
    .permission-box {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .panel {
        width: 100%;
    }

    .list {
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 10px;
        height: 184px;
        overflow-y: auto;
        margin-top: 5px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
    }

    .buttons button {
        width: 34px;
        height: 34px;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0;
        font-weight: 600;
        font-size: 16px;
    }

    .empty {
        text-align: center;
        color: #888;
        padding: 5px;
    }

    .panel .form-label {
        margin-bottom: 0px !important;
    }

    /* PANEL KANAN */
    .permission-empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px;
    }

    .permission-empty-content {
        text-align: center;
        max-width: 260px;
    }

    .permission-empty-content p {
        font-size: 14px;
        color: #64748b;
        margin: 0;
    }

    .check-soft-secondary .form-check-input {
        border-color: rgb(116, 176, 228);
        background-color: rgb(116, 176, 228, 0.15);
    }

    .check-soft-secondary .form-check-input:checked {
        background-color: #74b0e4;
        border-color: #74b0e4;
    }
</style>