<script>
    const { children, defaultFilter } = $props();

    const filter = $derived(defaultFilter);

    $inspect(filter);

</script>

<ul class="nav nav-tabs custom-tabs">
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

<style>
    .custom-tabs {
    position: sticky;
    top: 64px;
    /* sesuaikan tinggi header */
    z-index: 30;
    background-color: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .05);
}

.custom-tabs .nav-link {
    border: none !important;
    color: #777;
    font-weight: 500;
    padding: 12px 20px;
    position: relative;
}

.custom-tabs .nav-link.active {
    color: #6C4BF4;
    /* ungu Finsphere */
}

.custom-tabs .nav-link.active::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 3px;
    background-color: #6C4BF4;
    border-radius: 3px;
}
</style>
