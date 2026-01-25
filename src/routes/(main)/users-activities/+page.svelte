<script>
    import ModalRoles from "$lib/components/molecules/modals/ModalRoles.svelte";
    import ModalUsers from "$lib/components/molecules/modals/ModalUsers.svelte";
    import ModalUsersRoles from "$lib/components/molecules/modals/ModalUsersRoles.svelte";
    import ClientGrid from "$lib/directives/grids/ClientGrid.svelte";
    import modalStore from "$lib/directives/modal/functions/modal-store.js";
    import { applicationStore } from "$lib/stores/applicationStore";
    import { _paramToVariableName } from "ag-grid-community";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    const { data } = $props();

    let quickFilterFn = $state(null);
    let refresh = $state(null);
    let excel = $state(null);

    onMount(() => {});
</script>

<section id="section">
    <h2 class="page-title">{data.title}</h2>
    <div class="row" id={data.tableName} data-aos="fade-left">
        <div
            class="wrapper-scroll"
            style="max-height: calc(100vh - 80px); overflow-y: auto; padding-bottom: 50px;"
        >
            <div class="container-fluid py-4">
                <div>
                    <div class="position-relative mb-6">
                        <div
                            class="position-relative overflow-hidden rounded h-44 profile-widget"
                        >
                            <div class="size-96"></div>
                            <div class="size-80"></div>
                            <div class="size-40"></div>
                        </div>
                        <div class="text-center">
                            <div
                                class="position-relative d-inline-block mx-auto profile-avatar"
                            >
                                <div class="profile-avatar-wrapper mt-n14">
                                    <img
                                        src="img/user-45.png"
                                        loading="lazy"
                                        alt="user-45"
                                        class="mx-auto profile-avatar-img size-28"
                                    />
                                </div>
                                <div
                                    class="profile-avatar-dot bg-success size-4"
                                ></div>
                            </div>
                            <div class="avatar gap-1">
                                <h5 class="mt-2 mb-1">loginInfo.UserName</h5>
                            </div>
                        </div>
                    </div>

                    <div class="card mt-4">
                        <div class="card-header">
                            <h6 class="mb-1 card-title">Profile Activity</h6>
                            <span class="text-muted">
                                Menampilkan riwayat aktivitas yang terjadi pada
                                akun Anda yang dilakukan dalam aplikasi.
                            </span>
                        </div>
                        <div class="card-body row g-4">
                            <div class="col-12">
                                <ClientGrid
                                    columns={data.columns}
                                    url={`${applicationStore.urlPlatformConsole}/${data.tableName}`}
                                    height={100}
                                    layout={84}
                                    tableName={data.tableName}
                                    {quickFilterFn}
                                    {excel}
                                    {refresh}
                                    on:selected={(e) =>
                                        console.log("selected", e.detail)}
                                    on:quickFilter={(e) =>
                                        (quickFilterFn = e.detail)}
                                    on:refresh={(e) => (refresh = e.detail)}
                                    on:excel={(e) => (excel = e.detail)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .h-44 {
        height: 176px !important;
    }

    .mt-n14 {
        margin-top: -3.5rem !important;
    }

    .size-28 {
        height: 7rem !important;
        width: 7rem !important;
    }

    .size-96 {
        height: 24rem !important;
        width: 24rem !important;
    }

    .size-80 {
        height: 20rem !important;
        width: 20rem !important;
    }

    .size-40 {
        height: 10rem !important;
        width: 10rem !important;
    }

    .profile-widget {
        background-color: rgba(169, 102, 255, 0.1);
    }

    .profile-widget div {
        border-width: 60px;
        border-style: solid;
        rotate: 45deg;
    }

    .profile-widget div:nth-child(1) {
        position: absolute;
        top: 0;
        left: 0;
        border-color: rgba(169, 102, 255, 0.1);
    }

    .profile-widget div:nth-child(2) {
        position: absolute;
        top: 5rem;
        left: 2rem;
        border-color: rgba(169, 102, 255, 0.1);
    }

    .profile-widget div:nth-child(3) {
        position: absolute;
        top: 9rem;
        left: 7rem;
        border-color: rgba(169, 102, 255, 0.1);
    }

    .profile-avatar .profile-avatar-wrapper {
        position: relative;
        padding: 0.25rem;
        border-radius: 50rem;
        background: linear-gradient(
            to top right,
            rgba(169, 102, 255, 0.5),
            rgba(239, 68, 68, 0.5),
            rgba(34, 197, 94, 0.5)
        );
    }

    .profile-avatar .profile-avatar-img {
        border-radius: 50rem;
        border:
            4px solid 239,
            68,
            68;
    }

    .profile-avatar .profile-avatar-dot {
        border-radius: 50rem;
        border:
            2px solid 239,
            68,
            68;
        position: absolute;
        right: 0.625rem;
        bottom: 0.625rem;
    }

    .profile-avatar .profile-avatar-dot {
        border-radius: 50rem;
        border: 8px solid #22c55e;
        position: absolute;
        right: 0.625rem;
        bottom: 0.625rem;
    }
</style>
