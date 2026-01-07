<script>
    const { children, defaultFilter } = $props();

    const filter = $derived(defaultFilter);

    $inspect(filter);

</script>

<ul class="nav nav-pills">
  <li class="nav-item">
    <a class="nav-link {filter === "buy" ? 'active' : ''}" aria-current="page" href="#">Active</a>
  </li>
  <li class="nav-item">
    <a class="nav-link {filter === "sell" ? 'active' : ''}" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link disabled" aria-disabled="true">Disabled</a>
  </li>
</ul>

{@render children?.()}
