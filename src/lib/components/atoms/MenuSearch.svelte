<script>
    import { theme } from "$lib";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function search(e) {
        dispatch('search', e.target.value);
    }

</script>

<div class="input-group px-4 py-3 input-search {$theme === 'dark' ? 'dark' : ''}">
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

        &.dark {
            .input-group-text{
                background-color: #2C2C2C !important;
                border: 1px solid #2A2A2A !important;
            }
        }
    }
</style>