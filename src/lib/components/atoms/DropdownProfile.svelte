<script>
    import { goto } from "$app/navigation";
    import fetcher from "$lib/fetcher";
    import { applicationStore } from "$lib/stores/applicationStore";
    import Swal from "sweetalert2";

    const { session } = $props();
    
    let dark = $state(
    typeof window !== 'undefined'
        ? localStorage.getItem('theme') === 'dark'
        : false
    );
</script>

<div class="dropdown dropdown-profile">
    <button
        class="dropdown-toggle gap-2 text-start d-flex justify-content-between"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
    >
        <div class="d-flex gap-2">
            <img
                src="/img/avatar.png"
                style="width: 2.25rem; height: 2.25rem;"
                alt="profile"
            />
            <div class="d-flex flex-column justify-content-center profile-desc">
                <span class="fw-bold text-primary lh-1"
                    >{session?.userName || "Satria Baja Ringan"}</span
                >
                <span class="text-muted" style="font-size: 14px;"
                    >{session?.roleName || "Supernya admin"}</span
                >
            </div>
        </div>
        <i class="bi bi-stroke-bottom" style="font-size: 0.8rem;"></i>
    </button>
    <ul class="dropdown-menu">
        <div class="d-flex p-3 m-1">
            <img
                src="/img/avatar.png"
                style="width: 2.25rem; height: 2.25rem;"
                alt="profile"
            />
            <div class="ps-2">
                <h6 class="mb-0 text-truncate">{session?.userName}</h6>
                <p class="mb-0 text-truncate">
                    <a href={null} class="text-decoration-none"
                        >{session?.email}</a
                    >
                </p>
            </div>
        </div>
        <hr class="m-0 mb-3" />
        <li class="m-2">
            <a class="dropdown-item text-muted" href="/users-activities"
                ><i class="bi bi-bell me-2"></i>Profile Activity</a
            >
        </li>
        <li class="m-2">
            <a class="dropdown-item text-muted" href="/users-policy"
                ><i class="bi bi-gear me-2"></i>Account Policy</a
            >
        </li>
        <hr />
        <li class="m-2">
            <a
                class="dropdown-item text-muted"
                href={null}
                onclick={async () => {
                    try {
                        const res = await fetcher(
                            fetch,
                            `${applicationStore.urlPlatformConsole}/logout`,
                            {
                                method: "POST",
                            },
                        );

                        if (res.message) {
                            localStorage.clear();
                            dark = false;
                            goto("/login");
                        }
                    } catch (error) {
                        Swal.fire({
                            icon: "error",
                            title: "Logout Failed",
                            text: error.message,
                        });
                    }
                }}><i class="bi bi-logout me-2"></i>Log Out</a
            >
        </li>
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
