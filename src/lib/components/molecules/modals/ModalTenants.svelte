<script>
    import AutoComplete from "$lib/directives/inputs/AutoComplete.svelte";
    import AutoSelect from "$lib/directives/inputs/AutoSelect.svelte";
    import WizardComponent from "../WizardComponent.svelte";

    let form = $state({
        email: '',
        password: '',
        select: 'two',
        select: 0,
        relationship: 2,
    })

    $inspect(form);

    const items = [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
    ];

</script>
<div class="modal-header">
    <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body">
    <WizardComponent>
        {#snippet children(id, text)}
            <form>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">{text}</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1">
                </div>
                <div class="mb-3">
                    <label for="select" class="form-label">Example Select</label>
                    <AutoSelect id="select" customOptions={items} bind:value={form.select} required/>
                </div>
                <div class="mb-3">
                    <label for="select2" class="form-label">Example Select</label>
                    <AutoSelect id="select2" customOptions={[
                        { value: 1, label: 'Satu' },
                        { value: 2, label: 'Dua' },
                        { value: 3, label: 'Tiga' },
                    ]} bind:value={form.select2} required/>
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1">
                    <label class="form-check-label" for="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        {/snippet}
    </WizardComponent>
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary">Understood</button>
</div>