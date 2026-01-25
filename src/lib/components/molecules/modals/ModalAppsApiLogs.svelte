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
        apiType: "",
        level: "",
        category: "",
        description: "",
        content: "",
    });

    const url = `${applicationStore.urlPlatformConsole}/appsapilogs`;
    
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
            apiType: formData.apiType,
            level: formData.level,
            category: formData.category,
            description: formData.description,
            content: formData.content
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
                <label class="form-label" for="apiType">API Type</label>
                <input
                    id="apiType"
                    type="text"
                    class="form-control"
                    bind:value={formData.apiType}
                    placeholder="e.g. API_TYPE"
                    required
                />
            </div>
            <div class="col-12 mb-3">
                <label class="form-label" for="level">Level</label>
                <input
                    id="level"
                    type="text"
                    class="form-control"
                    bind:value={formData.level}
                    placeholder="e.g. LEVEL_APPLICATION"
                    required
                />
            </div>
           <div class="col-12 mb-3">
                <label class="form-label" for="category">Category</label>
                <input
                    id="category"
                    type="text"
                    class="form-control"
                    bind:value={formData.category}
                    placeholder="e.g. CATEGORY_APPLICATION"
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
                    placeholder="e.g. DESCRIPTION_APPLICATION"
                    required
                ></textarea>
            </div>
           <div class="col-12 mb-3">
                <label class="form-label" for="content">Content</label>
                <textarea
                    id="content"
                    type="text"
                    class="form-control"
                    rows="6"
                    bind:value={formData.content}
                    placeholder="e.g. CONTENT_APPLICATION"
                    required
                ></textarea>
            </div>
        </div>
    </div>
</form>
