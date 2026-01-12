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

    let activeTab = $state(1);

    const { wizardHeader, nextStepWizard, submitData } = $derived(
        $modalStore.params,
    );

    let formData = $state({
        tenantId: "",
        mvTenantCategory: "",
        serviceUid: "",
        email: "",
        name: "",
        pwd: "",
        userName: "",
    });

    const url = `${$applicationStore.urlPlatformConsole}/tenants`;

    $effect(async () => {
        console.log("$modalstore", $modalStore);
        if (!$modalStore.params.uid) return;

        const res = await fetcher(fetch, `${url}/${$modalStore.params.uid}`);

        formData = res;
    });

    async function onSubmit(e, formData) {
        e.preventDefault();

        if ($modalStore.wizard.step !== 1) {
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

        if ($modalStore.params.actions == "create") method = "POST";
        else if ($modalStore.params.actions.actions == "update") {
            method = "PUT";
            payload.tenantUid = formData.tenantUid;
        }

        await submitDataModal(e, payload, url, method);
    }
</script>

<div class="modal-body">
    <WizardComponent
        {activeTab}
        {wizardHeader}
        wizardTitle={$modalStore.title}
        subTitle={$modalStore.subTitle}
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
                            disabled={$modalStore.params.isFormDisabled}
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
                            disabled={$modalStore.params.isFormDisabled}
                        />
                    </div>
                    <div class="col-12 mb-3">
                        <label class="form-label" for="mvServiceCategory"
                            >Tenant Category</label
                        >
                        <AutoSelect
                            lookup="mastervalues/TENANT_CATEGORY"
                            bind:value={formData.mvTenantCategory}
                            labelKey={["code"]}
                            valueKey="code"
                            placeholder="Please choose one option"
                            on:change={(e) => {
                                formData.serviceUid = "";
                            }}
                            required
                            disabled={$modalStore.params.isFormDisabled}
                        />
                    </div>

                    {#if formData.mvTenantCategory && $modalStore.wizard.step != 2}
                        <div class="col-12 mb-3">
                            <label class="form-label" for="serviceUid"
                                >Service</label
                            >
                            <AutoSelect
                                lookup="servicesbytenantcategory/{formData.mvTenantCategory}"
                                bind:value={formData.serviceUid}
                                labelKey={["serviceId", "name"]}
                                valueKey="serviceUid"
                                placeholder="Please choose one option"
                                required
                                disabled={$modalStore.params.isFormDisabled}
                            />
                        </div>
                    {/if}
                {/if}

                <!-- STEP 2 -->
                {#if id === 1 || id === 2}
                    {#if $modalStore.wizard.step != 2}
                        <div class="mb-3">
                            <label class="form-label" for="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                class="form-control"
                                bind:value={formData.email}
                                autocomplete="one-time-code"
                                disabled={$modalStore.params.isFormDisabled}
                                placeholder="e.g. johndoe@gmail.com"
                                required
                            />
                        </div>
                    {/if}
                    <div class="mb-3">
                        <label class="form-label" for="name">User Name</label>
                        <input
                            id="userName"
                            type="text"
                            class="form-control"
                            bind:value={formData.userName}
                            autocomplete="one-time-code"
                            disabled={$modalStore.params.isFormDisabled}
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>
                    {#if $modalStore.wizard.step != 2}
                        <div class="mb-3">
                            <label class="form-label" for="pwd">Password</label>
                            <InputPassword
                                id="pwd"
                                bind:value={formData.pwd}
                                autocomplete="one-time-code"
                                required
                                withicon="false"
                                disabled={$modalStore.params.isFormDisabled}
                            />
                        </div>
                    {/if}
                {/if}
            </form>
        {/snippet}
    </WizardComponent>
</div>
