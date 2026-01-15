<!-- examples -->
<!-- without api:: -->
<!-- <AutoSelect
    bind:value={formData.roleUid}
    options={[
        { value: 5, label: "Active X" },
        { value: 1, label: "Active" },
        { value: 0, label: "Inactive" },
    ]}
/> -->

<!-- with api:: -->
<!-- <AutoSelect
    lookup="users"
    bind:value={formData.roleUid}
    labelKey={["name", "email"]}
    valueKey="userUid"
    labelSeparator = " x ",
    placeholder="Select User"
    required
/> -->

<script>
    import Select from "svelte-select";
    import fetcher from "$lib/fetcher";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let {
        lookup = null,
        options = [],
        valueKey = "value",
        labelKey = "label",
        disabled = false,
        value = $bindable(),
        placeholder = "Select...",
        labelSeparator = " - ",
        required = false,
    } = $props();

    let items = $state([]);
    let selection = $state(null);
    let loading = $state(false);

    /* load options */
    $effect(() => {
        if (options.length) {
            items = options;
            return;
        }

        if (!lookup) return;

        load();
    });

    function buildLabel(item) {
        if (Array.isArray(labelKey)) {
            return labelKey
                .map((k) => item[k])
                .filter(Boolean)
                .join(labelSeparator ?? " ");
        }
        return item[labelKey];
    }

    async function load() {
        loading = true;

        try {
            const res = await fetcher(fetch, `/api/platform/console/${lookup}`);

            items = res.map((x) => ({
                value: x[valueKey],
                label: buildLabel(x),
            }));
        } catch (ex) {
            console.error("AutoSelect API:", ex);
        } finally {
            loading = false;
        }
    }

    /* sync value -> selection */
    $effect(() => {
        if (!value || !items.length) return;

        const match = items.find((i) => i[valueKey] === value);
        if (match && match !== selection) {
            selection = match;
        }
    });

    function handleChange(e) {
        selection = e.detail;
        value = e.detail?.value ?? null;
        dispatch("change", value);
    }
</script>

<Select
    {items}
    bind:value={selection}
    {placeholder}
    {required}
    on:select={handleChange}
    {loading}
    {disabled}
/>
