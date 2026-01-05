<script>
    const { session } = $props();
</script>

<div class="dropdown dropdown-profile">
    <button class="dropdown-toggle gap-2 text-start d-flex justify-content-between" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <div class="d-flex gap-2">
            <img src="/img/avatar.png" style="width: 2.25rem; height: 2.25rem;" alt="profile">
            <div class="d-flex flex-column justify-content-center profile-desc">
                <span class="fw-bold text-primary lh-1">{session?.userName || "Satria Baja Ringan"}</span>
                <span class="text-muted" style="font-size: 14px;">{session?.roleName || "Supernya admin"}</span>
            </div>
        </div>
        <i class="bi bi-stroke-bottom" style="font-size: 0.8rem;"></i>
    </button>
    <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
    </ul>
</div>

<style lang="scss">
    button {
        padding: 1rem 1.5rem;
        display: flex;
        width: 100%;
        border: none;
        background-color: transparent;

        &::after {
            display: none;
        }
    }

    .dropdown-menu {
        width: 100%;
    }
</style>