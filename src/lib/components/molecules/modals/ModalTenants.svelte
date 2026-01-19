<script>
    import WizardComponent from "../WizardComponent.svelte";
    import AutoSelect from "$lib/directives/inputs/AutoSelect.svelte";
    import Swal from "sweetalert2";
    import modalStore, {
        submitDataModal,
    } from "$lib/directives/modal/functions/modal-store";
    import InputPassword from "$lib/directives/inputs/InputPassword.svelte";
    import { applicationStore } from "$lib/stores/applicationStore";
    import fetcher from "$lib/fetcher";
    import { onMount } from "svelte";

    let activeTab = $state(1);

    const { params, wizard } = $derived($modalStore.currentModal);
    const uid = $derived(params.uid);

    let formData = $state({
        tenantId: "",
        mvTenantCategory: "",
        serviceUid: "",
        email: "",
        name: "",
        pwd: "",
        userName: "",
    });

    const url = `${applicationStore.urlPlatformConsole}/tenants`;
    
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

        if (wizard.step !== 1) {
            modalStore.nextStep();
            return;
        }

        let payload = {
            tenantId: formData.tenantId,
            mvTenantCategory: formData.mvTenantCategory,
            serviceUid: formData.serviceUid,
            userName: formData.userName,
            email: formData.email,
            name: formData.name,
            pwd: formData.pwd,
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

<div class="modal-body modal-scroll">
    <WizardComponent
        {activeTab}
        wizardHeader={params.wizardHeader}
        wizardTitle={params.title}
        subTitle={params.subTitle}
    >
        {#snippet children(id)}
            <!-- STEP 1 -->
            <form
                id="formSubmit-{$modalStore.id}"
                onsubmit={async (e) => await onSubmit(e, formData)}
            >
                {#if id === 0 || id === 2}
                    <div class="mb-3">
                        <label class="form-label" for="tenantId"
                            >Tenant ID</label
                        >
                        <input
                            id="tenantId"
                            type="text"
                            class="form-control"
                            autocomplete="one-time-code"
                            bind:value={formData.tenantId}
                            required
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="name">Tenant Name</label>
                        <input
                            id="name"
                            type="text"
                            class="form-control"
                            autocomplete="one-time-code"
                            bind:value={formData.name}
                            required
                        />
                    </div>
                    <div class="col-12 mb-3">
                        <label class="form-label" for="mvServiceCategory"
                            >Tenant Category</label
                        >
                        <AutoSelect
                            id="mvServiceCategory"
                            lookup="mastervalues/TENANT_CATEGORY"
                            bind:value={formData.mvTenantCategory}
                            labelKey={["code"]}
                            valueKey="code"
                            placeholder="Please choose one option"
                            on:change={(e) => {
                                formData.serviceUid = "";
                            }}
                            required
                    disabled={params.isFormDisabled}
                        />
                    </div>

                    {#if formData.mvTenantCategory && wizard.step != 2}
                        <div class="col-12 mb-3">
                            <label class="form-label" for="serviceUid"
                                >Service</label
                            >
                            <AutoSelect
                                id="serviceUid"
                                lookup="servicesbytenantcategory/{formData.mvTenantCategory}"
                                bind:value={formData.serviceUid}
                                labelKey={["serviceId", "name"]}
                                valueKey="serviceUid"
                                placeholder="Please choose one option"
                                required
                    disabled={params.isFormDisabled}
                            />
                        </div>
                    {/if}
                {/if}

                <!-- STEP 2 -->
                {#if id === 1}
                    <div class="mb-3">
                        <label class="form-label" for="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            class="form-control"
                            bind:value={formData.email}
                            autocomplete="one-time-code"
                            placeholder="e.g. johndoe@gmail.com"
                            required
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="name">User Name</label>
                        <input
                            id="userName"
                            type="text"
                            class="form-control"
                            bind:value={formData.userName}
                            autocomplete="one-time-code"
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="pwd">Password</label>
                        <InputPassword
                            id="pwd"
                            bind:value={formData.pwd}
                            autocomplete="one-time-code"
                            required
                            withicon={false}
                        />
                    </div>
                {/if}
            </form>
        {/snippet}
    </WizardComponent>
</div>
