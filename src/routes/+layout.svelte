<script>
    import { page } from '$app/state';
    import { initSignalR } from '$lib';
    import ModalRegistry from '$lib/directives/modal/functions/modal-registry';
    import modalStore from '$lib/directives/modal/functions/modal-store';
    import ModalContainer from '$lib/directives/modal/ModalContainer.svelte';
    import AOS from 'aos';
    import { onMount } from 'svelte';

    const { children } = $props();

    const title = $derived.by(() => {
        const segments = page.url.pathname
        .split('/')
        .filter(Boolean)
        .slice(0, 2); // 👈 cuma ambil 2 path

        if (segments.length === 0) return 'Home';

        return segments
        .map(seg =>
            seg
            .split('-')
            .map(w => w[0].toUpperCase() + w.slice(1))
            .join(' ')
        )
        .join(' - ');
    });

    onMount(() => {
        AOS?.init({
            once: false,
            duration: 600
        });
        initSignalR();

        console.log($modalStore)
    });
</script>

<svelte:head>
  <title>Finsphere | {title}</title>
  <link rel="icon" href="/favicon.ico" />
</svelte:head>

{#if $modalStore.open}
    <ModalContainer id={$modalStore.id} size={$modalStore.size}>
        <!-- svelte-ignore svelte_component_deprecated -->
        <svelte:component
            this={ModalRegistry[$modalStore.component]}
            {...$modalStore.params}
        />
    </ModalContainer>
{/if}
{@render children()}
