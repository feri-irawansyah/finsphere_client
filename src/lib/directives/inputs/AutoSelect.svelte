<script>
    import Select from "svelte-select";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    // props
    let {
        lookup_name,        // nama lookup dari parent
        value = $bindable(), // untuk 2-way binding
        onChange = () => {},           // optional handler
        onInput = () => {},
        required = false,
        withApi = false,
        customOptions = [],
        ...props
    } = $props();

    // state items
    let items = $state([]);
    let selection = $state(null);

    // ambil data dari API saat lookup_name berubah
    $effect(() => {
        if (!lookup_name && !withApi) {
            items = customOptions;
            return
        };
        loadOptions(lookup_name);
    });

    async function loadOptions(name) {
        try {
            const res = await fetch(`/api/data/option/${name}`);
            if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
            const data = await res.json();

            // pastikan format sesuai untuk svelte-select
            items = data.data.map((x) => ({
                value: x.value ?? x.id ?? x.code,
                label: x.label ?? x.name ?? x.text ?? String(x.value ?? x.id),
            }));

            if (value && !selection) {
                const match = items.find((x) => x.value == value);
                if (match) selection = match;
            }
        } catch (err) {
            console.error("AutoComplete fetch error:", err);
            items = [];
        }
    }

    // handle perubahan value
    function handleChange(event) {
        value = event.detail?.value ?? event.detail;
        onChange?.(event);
        dispatch("change", event.detail);
    }

    // handle perubahan input
    function handleInput(event) {
        onInput?.(event);
        dispatch("input", event.detail);
    }

    $inspect(selection)
</script>

<Select
    {...props}
    value={selection}
    {items}
    on:select={handleChange}
    on:input={handleInput}
    class="form-control form-select"
/>