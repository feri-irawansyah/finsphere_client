<script>
    const { children, defaultFilter } = $props();

    const filter = $derived(defaultFilter);

    $inspect(filter);

</script>

<ul class="nav nav-pills">
  <li class="nav-item">
    <a class="nav-link {filter === "buy" ? 'active' : ''}" aria-current="page" href="/orders/buy">Buy</a>
  </li>
  <li class="nav-item">
    <a class="nav-link {filter === "sell" ? 'active' : ''}" aria-current="page" href="/orders/sell">Sell</a>
  </li>
  <li class="nav-item">
    <a class="nav-link {filter === "amend" ? 'active' : ''}" aria-current="page" href="/orders/amend">Amend</a>
  </li>
  <li class="nav-item">
    <a class="nav-link {filter === "withdraw" ? 'active' : ''}" aria-current="page" href="/orders/withdraw">Withdraw</a>
  </li>
</ul>

{@render children?.()}
