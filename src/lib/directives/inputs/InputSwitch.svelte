<script>
    let {
        label,
        design = "slider",
        options = [],
        fontSize = 14,
        value = $bindable()
    } = $props();

    // UI state (mirror dari value)
    let checked = $state(false);

    const uniqueID = Math.floor(Math.random() * 100000);

    // 🔄 SYNC DARI PARENT → SWITCH
    $effect(() => {
        checked = !!value;
    });

    // ✅ TOGGLE STATE (JANGAN BACA DOM)
    function handleClick() {
        checked = !checked;
        value = checked;
    }

    const slugify = (str = "") =>
        str.toLowerCase().replace(/ /g, "-").replace(/\./g, "");
</script>

{#if design == 'inner'}
<div class="s s--inner">
    <span id={`switch-${uniqueID}`}>{label}</span>
    <button
        role="switch"
        aria-checked={checked}
        aria-labelledby={`switch-${uniqueID}`}
        onclick={handleClick}>
        <span>on</span>
        <span>off</span>
    </button>
</div>

{:else if design == 'slider'}
<div class="s s--slider" style="font-size:{fontSize}px">
    <span id={`switch-${uniqueID}`}>{label}</span>
    <button
        role="switch"
        aria-checked={checked}
        aria-labelledby={`switch-${uniqueID}`}
        onclick={handleClick}>
    </button>
</div>

{:else}
<div class="s s--multi">
    <div
        role="radiogroup"
        class="group-container"
        aria-labelledby={`label-${uniqueID}`}
        style="font-size:{fontSize}px"
        id={`group-${uniqueID}`}>

        <div class="legend" id={`label-${uniqueID}`}>{label}</div>

        {#each options as option}
            <input
                type="radio"
                id={`${slugify(option)}-${uniqueID}`}
                value={option}
                bind:group={value}
            />
            <label for={`${slugify(option)}-${uniqueID}`}>
                {option}
            </label>
        {/each}
    </div>
</div>
{/if}

<style>
	:root {
		--accent-color: #9C52FB;
		--gray: #fff;
	}
    /* Inner Design Option */
    .s--inner button {
        padding: 0.5em;
        background-color: #7E7695;
        border: 1px solid var(--gray);
    }
    [role='switch'][aria-checked='true'] :first-child,
    [role='switch'][aria-checked='false'] :last-child {
        display: none;
        color: #7E7695;
    }

    .s--inner button span {
        user-select: none;
        pointer-events:none;
        padding: 0.25em;
    }

    .s--inner button:focus {
        outline: var(--accent-color) solid 1px;
    }

    /* Slider Design Option */

    .s--slider {
        display: flex;
        align-items: center;
    }

    .s--slider button {
        width: 2.8em;
        height: 1.4em;
        position: relative;
        background: var(--gray);
        border: none;
        border: 1px solid #E0E2E6;
    }

    .s--slider button::before {
        content: '';
        position: absolute;
        width: 1em;
        height: 1em;
        background: #7E7695;
        top: 0.12em;
        right: 1.5em;
        transition: transform 0.3s;
    }

    .s--slider button[aria-checked='true']{
        background-color: var(--accent-color);
        border: 1px solid transparent;
    }

    .s--slider button[aria-checked='true']::before{
        transform: translateX(1.3em);
        transition: transform 0.3s;
        background: #fff;
    }

    .s--slider button:focus {
        box-shadow: 0 0px 0px 0px var(--accent-color);
    }

    .s--multi .group-container {
        border: none;
        padding: 0;
        white-space: nowrap;
    }

    .s--multi label {
        display: inline-block;
        line-height: 1.6;
        position: relative;
        z-index: 2;
    }

    .s--multi input {
        opacity: 0;
        position: absolute;
    }

    .s--multi label:first-of-type {
        padding-right: 5em;
    }

    .s--multi label:last-child {
        margin-left: -5em;
        padding-left: 5em;
    }

    .s--multi:focus-within label:first-of-type:after {
        box-shadow: 0 0px 0px var(--accent-color);
        border-radius: 1.5em;
    }

    /* making the switch UI.  */
    .s--multi label:first-of-type:before,
    .s--multi label:first-of-type:after {
        content: "";
        height: 1.25em;
        overflow: hidden;
        pointer-events: none;
        position: absolute;
        vertical-align: middle;
    }

    .s--multi label:first-of-type:before {
        border-radius: 100%;
        z-index: 2;
        position: absolute;
        width: 1.2em;
        height: 1.2em;
        background: #fff;
        top: 0.2em;
        right: 1.2em;
        transition: transform 0.3s;
    }

    .s--multi label:first-of-type:after {
        background: var(--accent-color);
        border-radius: 1em;
        margin: 0 1em;
        transition: background .2s ease-in-out;
        width: 3em;
        height: 1.6em;
    }

    .s--multi input:first-of-type:checked ~ label:first-of-type:after {
        background: var(--gray);
    }

    .s--multi input:first-of-type:checked ~ label:first-of-type:before {
        transform: translateX(-1.9em);
    }

    .s--multi input:last-of-type:checked ~ label:last-of-type {
        z-index: 1;
    }

    .s--multi input:focus {
        box-shadow: 0 0px 0px var(--accent-color);
        border-radius: 1.5em;
    }

    /* gravy */ 

    /* Inner Design Option */
    [role='switch'][aria-checked='true'] :first-child,
    [role='switch'][aria-checked='false'] :last-child {
        border-radius: 0.25em;
        background: var(--accent-color);
        display: inline-block;
    }

    .s--inner button:focus {
        box-shadow: 0 0px 0px var(--accent-color);
        border-radius: 0.1em;
    }

    /* Slider Design Option */
    .s--slider button {
        border-radius: 1.5em;
    } 
    
    .s--slider button::before {
        border-radius: 100%;
    }

    .s--slider button:focus {
        border: 1px solid transparent;
        box-shadow: 0 0px 0px var(--accent-color);
        border-radius: 1.5em;
    }
   

</style>