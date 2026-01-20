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

    const { params } = $derived($modalStore.currentModal);
    const uid = $derived(params.uid);

    const url = `${applicationStore.urlPlatformConsole}/clientsequitytrading/import`;

    onMount(async () => {
        try {
            if (!uid) return;

        } catch (error) {
            console.error("error", error);
        }
    });

    async function onSubmit(e) {

        const file = fileInput?.files?.[0];

        if (!file) {
            Swal.fire("Failed", "Please select a file.", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        await submitDataModal(e, formData, url, "POST", false);
    }
</script>

<form
    id="formSubmit-{$modalStore.id}"
    onsubmit={async (e) => await onSubmit(e)}
>
    <div class="modal-body modal-scroll">
        <div class="row">
            <div class="col-12 mb-1">
                <input
                    type="file"
                    accept=".xlsx"
                    bind:this={fileInput}
                    id="fileInput"
                    class="form-control fil-input form-control-md"
                    required
                />
            </div>
            <div class="col-12 m-1">
                <a
                    class="form-label"
                    href="/file-import/template-client-equity-trading.xlsx"
                    >Download Template File here
                    (template-client-equity-trading.xlsx)</a
                >
            </div>
        </div>
    </div>
</form>

<style>
    .modal-body {
        overflow: hidden;
    }
</style>
