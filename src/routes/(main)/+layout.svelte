<script>
    import { page } from '$app/state';
    import Header from '$lib/components/templates/Header.svelte';
    import Sidebar from '$lib/components/templates/Sidebar.svelte';
    import { setContext } from 'svelte';

	const { children, data } = $props();

    let show = $state(true);
    let title = $state('');

    setContext('sidebar', {
        get show() { return show; },
        toggle: () => show = !show
    });

    setContext('title', {
        get title() { return title; },
        set title(value) { title = value; }
    })

</script>

<Sidebar {data}/>
<div class="main-content {show ? 'show' : ''}">
    <h2>{title}</h2>
    <div class="content px-3 py-2 z-0">
        {@render children()}
    </div>
</div>

<style lang="scss">
    .main-content {
        position: absolute;
        inset: 0 0 0 auto; /* top right bottom */
        height: 100vh;
        display: flex;
        flex-direction: column;

        width: calc(100% - 5rem);
        transition: width 0.7s ease;
        overflow: hidden;

        &.show {
            width: calc(100% - 22.5rem);
        }

        h2 {
            flex: 0 0 auto;
            font-size: 1.5rem;
            color: #0B032D;
            font-weight: 600;
            border-bottom: 1px solid #E0E2E6;
            padding: 1.5rem;
        }

        .content {
            flex: 1;
            min-height: 0;   /* 🔥 PENTING BANGET */
            overflow-y: auto;
        }
    }

</style>
