<script>
	import { page } from '$app/state';

</script>

<div class="not-found">
    <img src="/svg/empty.svg" alt="empty">
    <h1>{page.status}</h1>
    <h3>Page {page.error.message}</h3>
</div>

<style lang="scss">
    .not-found {
        img {
            width: 10rem;
        }
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
</style>