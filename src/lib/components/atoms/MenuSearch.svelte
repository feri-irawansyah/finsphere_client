<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function search(e) {
        dispatch('search', e.target.value);
    }

</script>

<div class="input-group px-4 py-2 input-search">
    <span class="input-group-text" id="menu-search"><i class="bi bi-searching"></i></span>
    <input type="text" class="form-control" placeholder="Search Menu" aria-label="search" aria-describedby="menu-search" oninput={search}>
</div>

<style lang="scss">
    .input-search {
        input {
            border-left: none;
        }
        .input-group-text{
            background-color: #fff !important;
        }
    }
</style>