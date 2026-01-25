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

    // svelte-ignore state_referenced_locally
        console.log("params", uid);

    const url = `${applicationStore.urlPlatformConsole}/apps`;

    onMount(async () => {
        try {
            if (!uid) return;

            const res = await fetcher(fetch, `${url}/${uid}`);

            console.log("res", res);

            formData = res;
            formData.entryTime = moment(res.entryTime).format("LL - LTS");
            formData.updateTime = moment(res.updateTime).format("LL - LTS");
        } catch (error) {
            console.error("error", error);
        }
    });

    async function onSubmit(e, formData) {
        let payload = {
            appId: formData.appId,
            name: formData.name,
            description: formData.description,
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
           
            {#if formData.appUid}
                <div class="col-12 col-md-6 mb-3">
                    <label class="form-label" for="entryTime">Entry Time</label>
                    <input
                        id="entryTime"
                        type="text"
                        class="form-control"
                        bind:value={formData.entryTime}
                        disabled
                    />
                </div>
                <div class="col-12 col-md-6 mb-3">
                    <label class="form-label" for="updateTime"
                        >Update Time</label
                    >
                    <input
                        id="updateTime"
                        type="text"
                        class="form-control"
                        bind:value={formData.updateTime}
                        disabled
                    />
                </div>
            {/if}
        </div>
    </div>
</form>
