<script>
    import { page } from '$app/state';
    import { initSignalR } from '$lib';
    import Header from '$lib/components/templates/Header.svelte';
    import Sidebar from '$lib/components/templates/Sidebar.svelte';
    import { onMount, setContext } from 'svelte';

	const { children, data } = $props();

    let show = $state(true);

    setContext('sidebar', {
        get show() { return show; },
        toggle: () => show = !show
    });

    onMount(() => {
        initSignalR(data.session);
    });

</script>

<Sidebar {data}/>
<div class="main-content {show ? 'show' : ''}">
    <div class="content p-0 m-0 z-0">
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

        .content {
            flex: 1;
            min-height: 0;   /* 🔥 PENTING BANGET */
            overflow-y: auto;
        }
    }
</style>
