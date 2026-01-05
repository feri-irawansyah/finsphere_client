<script>
    import { page } from '$app/state';
    import Header from '$lib/components/templates/Header.svelte';
    import Sidebar from '$lib/components/templates/Sidebar.svelte';
    import { setContext } from 'svelte';

	const { children, data } = $props();

    let show = $state(false);

    setContext('sidebar', {
        get show() { return show; },
        toggle: () => show = !show
    });

    const title = $derived.by(() => {
        const segments = page.url.pathname
        .split('/')
        .filter(Boolean)
        .slice(0, 2); // 👈 cuma ambil 2 path

        if (segments.length === 0) return 'Dashboard';

        return segments
        .map(seg =>
            seg
            .split('-')
            .map(w => w[0].toUpperCase() + w.slice(1))
            .join(' ')
        )
        .join(' - ');
    });

</script>

<Sidebar {data}/>
<div class="main-content {show ? 'show' : ''}">
    <h2>{title}</h2>
    <div class="px-3 py-2 z-0">
        {@render children()}
    </div>
</div>

<style lang="scss">
    .main-content {
        h2 {
            font-size: 1.5rem;
            color: #0B032D;
            font-weight: 600;
            border-bottom: 1px solid #E0E2E6;
            padding: 1.5rem;
        }
        position: absolute;
        right: 0;
        width: calc(100% - 5rem);
        transition: width 0.7s ease;

        &.show {
            width: calc(100% - 22.5rem);
        }
    }
</style>
