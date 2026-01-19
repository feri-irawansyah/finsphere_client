<script>
    import Select from "svelte-select";
    import fetcher from "$lib/fetcher";
    import { createEventDispatcher } from "svelte";
    import { applicationStore } from "$lib/stores/applicationStore";

    const dispatch = createEventDispatcher();

    let {
        id = "",
        lookup = null,
        options = [],
        valueKey = "value",
        labelKey = "label",
        disabled = false,
        value = $bindable(),
        placeholder = "Select...",
        mapGroup = "urlPlatformConsole",
        multiple,
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
            const res = await fetcher(
                fetch,
                `${applicationStore[mapGroup]}/${lookup}`,
            );

            items = res.map((x) => ({
                value: x[valueKey],
                label: buildLabel(x),
                allData: x,
            }));
        } catch (ex) {
            console.error("AutoSelect API:", ex);
        } finally {
            loading = false;
        }
    }

    /* sync value -> selection */
    // $effect(() => {
    //     if (!value || !items.length) return;

    //     const match = items.find((i) => i.value === value);
    //     if (match && match !== selection) {
    //         selection = match;
    //     }
    // });

    // $effect(() => {

    //     console.log("items",items);
    //     if (!items.length) return;

    //     if (value == null) {
    //         selection = null;
    //         return;
    //     }

    //     if(multiple) {
    //         selection = items.filter((i) => value.includes(i.value));
    //     } else {
    //         console.log("value",value)
    //         const match = items.find((i) => i.value === value);
    //         if (match && match !== selection) {
    //             selection = match;
    //         }
    //     }
    // });

    $effect(() => {
        if (!items.length) return;

        if (value == null) {
            selection = null;
            return;
        }

        if (multiple) {
            selection = items.filter((i) => value.includes(i.value));
        } else {
            const match = items.find((i) => i.value === value);
            selection = match ?? null;
        }
    });

    function handleChange(e) {
        if (multiple) {
            value = e.detail.map((i) => i.value);
        } else {
            value = e.detail?.value ?? null;
        }

        dispatch("change", e.detail);
    }
</script>

<Select
    {id}
    {items}
    bind:value={selection}
    {placeholder}
    {required}
    on:change={handleChange}
    {loading}
    {disabled}
    {multiple}
/>
