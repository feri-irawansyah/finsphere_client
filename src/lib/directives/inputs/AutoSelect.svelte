<script>
    import Select from "svelte-select";
    import fetcher from "$lib/fetcher";
    import { createEventDispatcher, onMount } from "svelte";
    import { applicationStore } from "$lib/stores/applicationStore";

    const dispatch = createEventDispatcher();

    let {
        lookup = null,
        params = null,
        pathParams = [],
        options = [],
        valueKey = "value",
        valueKeyOptional = "valueKeyOptional",
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

    /* EFFECT: LOAD DATA */
    $effect(() => {
        if (options.length) {
            items = options;
            return;
        }

        if (!lookup) return;
        if (!hasValidParams(params)) {
            items = [];

            selection = null;
            value = null;
            return;
        }

        load();
    });

    // onMount(() => {
    //     load();
    // })

    /* HELPER */
    function buildLabel(item) {
        if (Array.isArray(labelKey)) {
            return labelKey
                .map((k) => item[k])
                .filter(Boolean)
                .join(labelSeparator ?? " ");
        }
        return item[labelKey];
    }

    function hasValidParams(params) {
        // ⬅️ TIDAK ADA PARAM = VALID
        if (params == null) return true;

        if (typeof params !== "object") return false;

        // minimal satu value yang usable
        return Object.values(params).some(
            (v) => v !== null && v !== undefined && v !== "",
        );
    }

    function buildPath(params, keys) {
        if (!params || !keys.length) return "";
        return keys
            .map((k) => params[k])
            .filter(Boolean)
            .map(encodeURIComponent)
            .join("/");
    }

    /* LOAD OPTIONS */
    async function load() {
        loading = true;

        try {
            const path = buildPath(params, pathParams);
            const url = path
                ? `${applicationStore[mapGroup]}/${lookup}/${path}`
                : `${applicationStore[mapGroup]}/${lookup}`;

            const res = await fetcher(fetch, url);

            items = res.map((x) => ({
                value: x[valueKey],
                label: buildLabel(x),
                optionalvalue: x[valueKeyOptional], //OBJECT ASLI
            }));
        } catch (ex) {
            console.error("AutoSelect API:", ex);
        } finally {
            loading = false;
        }
    }

    /* EFFECT: SYNC VALUE → SELECTION */
    $effect(() => {
        if (value == null || !items.length) return;

        if (multiple) {
            selection = items.filter((i) => value.includes(i.value));
        } else {
            selection = items.find((i) => i.value === value) ?? null;
            // const match = items.find((i) => i.value === value);
            // if (match && match !== selection) {
            //     selection = match;
            // }
        }
    });

    // function handleChange(e) {
    //     console.log("handleChange", e.detail);
    //     if (multiple) {
    //         value = e.detail.map((i) => i.value);
    //     } else {
    //         value = e.detail?.value ?? null;
    //     }
    //     dispatch("change", e.detail);
    // }

    function handleChange(e) {
        const detail = e.detail;

        console.log("detail", detail)

        if (detail == null || (Array.isArray(detail) && detail.length === 0)) {
            value = multiple ? [] : null;
            dispatch("change", null);
            return;
        }

        if (multiple) {
            value = detail.map((i) => i.value);
        } else {
            value = detail.value;
        }

        dispatch("change", e.detail);
    }
</script>

<Select
    {items}
    bind:value={selection}
    {placeholder}
    {required}
    on:change={handleChange}
    on:clear={() => {
        value = multiple ? [] : null;
        selection = multiple ? [] : null;

        dispatch("clear");
        dispatch("change", null); // ⬅️ PENTING (biar cascading konsisten)
    }}
    {loading}
    {disabled}
    {multiple}
    multiFullItemClearable={multiple ? true : false}
/>
