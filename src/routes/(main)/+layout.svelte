<script>
    import Header from '$lib/components/templates/Header.svelte';
    import Sidebar from '$lib/components/templates/Sidebar.svelte';
    import { setContext } from 'svelte';

	const { children, data } = $props();

    let show = $state(true);

    setContext('sidebar', {
        get show() { return show; },
        toggle: () => show = !show
    });

</script>

<Header/>
<Sidebar {data}/>
<div class="main-content">
    {@render children()}
</div>
