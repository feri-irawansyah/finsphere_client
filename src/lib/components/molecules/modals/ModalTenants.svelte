<script>
    import WizardComponent from "../WizardComponent.svelte";
    import AutoSelect from "$lib/directives/inputs/AutoSelect.svelte";
    import Swal from "sweetalert2";
    import modalStore from "$lib/directives/modal/functions/modal-store";

    let activeTab = $state(1);

    const { wizardHeader, nextStepWizard, submitData } = $derived($modalStore.params);

    let form = $state({
        email: '',
        expired: '',
        select: null
    });

</script>

<div class="modal-body">
    <WizardComponent {activeTab} {wizardHeader} wizardTitle="Create New Tenant" subTitle="Create a new tenant to manage its users, categories, and services within your workspace.">

        {#snippet children(id)}

            <!-- STEP 1 -->
            {#if id === 1}
                <form onsubmit={(e) => activeTab = nextStepWizard(e, 2)}>
                    <div class="mb-3">
                        <label class="form-label" for="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            class="form-control"
                            bind:value={form.email}
                            required
                        />
                    </div>

                    <div class="modal-footer d-flex justify-content-between">
                        <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">
                            Close
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Next
                        </button>
                    </div>
                </form>
            {/if}

            <!-- STEP 2 -->
            {#if id === 2}
                <form onsubmit={(e) => activeTab = nextStepWizard(e, 3)}>
                    <div class="mb-3">
                        <label class="form-label" for="select">Select</label>
                        <AutoSelect
                            id="select"
                            customOptions={[
                                { value: 1, label: 'Satu' },
                                { value: 2, label: 'Dua' },
                                { value: 3, label: 'Tiga' }
                            ]}
                            bind:value={form.select}
                            required
                        />
                    </div>

                    <div class="modal-footer d-flex justify-content-between">
                        <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">
                            Close
                        </button>
                        <div class="d-flex">
                                <button
                                type="button"
                                class="btn btn-outline-secondary"
                                onclick={() => activeTab = 1}
                            >
                                Back
                            </button>
                            <button type="submit" class="btn btn-success">
                                Next
                            </button>
                        </div>
                    </div>
                </form>
            {:else if id === 3}
                <form onsubmit={async (e) => await submitData(e, form)}>
                    <div class="mb-3">
                        <label class="form-label" for="date">Expired</label>
                        <input type="date"  id="date" class="form-control" bind:value={form.expired} required>
                    </div>

                    <div class="modal-footer d-flex justify-content-between">
                        <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">
                            Close
                        </button>
                        <div class="d-flex">
                                <button
                                type="button"
                                class="btn btn-outline-secondary"
                                onclick={() => activeTab = 2}
                            >
                                Back
                            </button>
                            <button type="submit" class="btn btn-success">
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            {/if}

        {/snippet}
    </WizardComponent>
</div>
