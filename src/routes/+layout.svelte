<script>
    import { page } from '$app/state';
    import { initSignalR } from '$lib';
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
      initSignalR();
  })
</script>

<svelte:head>
  <title>Finsphere | {title}</title>
  <link rel="icon" href="/favicon.ico" />
</svelte:head>

{@render children()}
