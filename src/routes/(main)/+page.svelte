<script>
    import { getContext } from 'svelte';

    const { data } = $props();

    const pageInfo = getContext("title");
    pageInfo.title = "Dashboard";
    const cards = [
        {
            title: "Total Active Tenants",
            icon: "/img/dashboard/store.png",
            header: "50 Tenants",
            value: -50,
            percentage: "(21%)",
            lastUpdate: "Last update 05/05/2025"
        },
        {
            title: "Total Assets",
            icon: "/img/dashboard/asset.png",
            header: "100 Assets",
            value: 100,
            percentage: "(24%)",
            lastUpdate: "Last update 05/05/2025"
        },
        {
            title: "Total Users",
            icon: "/img/dashboard/person.png",
            value: 250,
            header: "250 Users",
            value: -20,
            percentage: "(15%)",
            lastUpdate: "Last update 05/05/2025"
        }
    ]
</script>

<div class="row" id="dashboard" data-aos="fade-left">
    <div class="col-12 mb-3">
        <div class="card card-h-100 profile-dashboard">
            <div class="card-body welcome-widget">
                <div class="d-flex flex-column p-4">
                    <h4 class="mb-2 card-title">Welcome Back {data.session.userName}</h4>
                    <p class="">You have earned 49% more than last month which is great thing.</p>
                    <div class="flex-row">
                        <button type="button" class="btn btn-light">Organize Asset</button>
                    </div>
                </div>
                <div class="welcome-wrapper d-lg-block">
                    <div class="welcome-gradient"></div>
                    <img src="/img/dashboard/art.png" alt="img-01" loading="lazy" class="mx-auto d-block welcome-img bottom-0 h-100 right-0">
                </div>
            </div>
        </div>
    </div>
    {#each cards as card }
        <div class="col-12 col-md-4">
            <div class="card card-h-100">
                <div class="card-body p-0 pt-3 ps-3 pe-3">
                    <!-- header title -->
                    <div class="d-flex gap-2 align-items-center">
                        <img src={card.icon} style="width: 1rem; height: 1rem;" alt="">
                        <h6 class="mb-0">{card.title}</h6>
                        <div class="ms-auto">
                            <a href={null} class="text-primary" aria-label="card">
                                <i class="bi bi-three-dots"></i>
                            </a>
                        </div>
                    </div>
                    
                    <!-- content -->
                     <div class="mt-3 d-flex gap-3 align-items-center">
                        <h3> {card.header} </h3>
                        <span class="text-{card.value > 0 ? 'success' : 'danger'}">{card.value} {card.percentage}</span>
                     </div>
                    <p class="text-muted">{card.lastUpdate}</p>
                </div>
            </div>
        </div>
    {/each}
</div>