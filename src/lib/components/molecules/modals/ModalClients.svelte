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
        name: "",
        email: "",
        pwd: "",
        pwdExpDate: "",
        entryTime: "",
        updateTime: "",
        isEnabled: true,
    });

    const { params } = $derived($modalStore.currentModal);
    const uid = $derived(params.uid);

    const url = `${applicationStore.urlPlatformConsole}/clientsequitytrading`;

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
            clientId: formData.clientId,
            clientName: formData.clientName,
            sid: formData.sid,
            originId: formData.originId,
            tradeLimit: formData.tradeLimit,
        };

        let method = "";

        if (params.actions == "create") method = "POST";
        else if (params.actions == "update") {
            method = "PUT";
            payload.clientEquityTradingUid = formData.clientEquityTradingUid;
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
                <label class="form-label" for="clientId">Client ID</label>
                <input
                    id="clientId"
                    type="text"
                    class="form-control"
                    bind:value={formData.clientId}
                    placeholder="e.g. CID0001"
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="clientName">Client Name</label>
                <input
                    id="clientName"
                    type="text"
                    class="form-control"
                    bind:value={formData.clientName}
                    placeholder="e.g. John Doe"
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="sid">SID</label>
                <input
                    id="sid"
                    type="text"
                    class="form-control"
                    bind:value={formData.sid}
                    placeholder="e.g. 123456789012345"
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="originId">Origin ID</label>
                <input
                    id="originId"
                    type="text"
                    class="form-control"
                    bind:value={formData.originId}
                    placeholder="e.g. MMI"
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="originId">Trade Limit</label>
                <input
                    id="tradeLimit"
                    type="text"
                    class="form-control"
                    bind:value={formData.tradeLimit}
                    placeholder="e.g. 1,000,000,000"
                    required
                />
            </div>
        </div>
    </div>
</form>
