<script>
    import Select from "svelte-select";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let { lookup_name, value = $bindable(), onChange = () => {}, onInput = () => {}, required = false, ...props } = $props();

    let items = $state([]);
    let loading = $state(false);
    let debounceTimer;
    let filterText = $state("");
    let selection = $state(null);

    // load data default (20 record pertama)
    $effect(() => {
        if (!lookup_name) return;
        loadOptions("");
    });

    // fungsi fetch data
    async function loadOptions(keyword = "") {
        if (!lookup_name) return;

        try {
            loading = true;
            const url = new URL(`/api/data/option/${lookup_name}`, window.location.origin);
            if (keyword) url.searchParams.set("keyword", keyword);

            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

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
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        const keyword = filterText;
        if(!keyword) return;

        clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
            loadOptions(keyword);
        }, 500);
    });

    // debounce handler buat pencarian
    function clearSearch(event) {
        filterText = "";
        loadOptions("");
        value = null;
    }

    // handle saat user pilih item
    function handleChange(event) {
        value = event.detail?.value ?? event.detail;
        onChange?.(event);
        dispatch("change", event.detail);
    }
    
</script>

<Select
    {...props}
    {items}
    value={selection}
    on:change={handleChange}
    bind:filterText
    isLoading={loading}
    class="form-control"
    clearFilterTextOnBlur={false}
    on:clear={clearSearch}
/>
