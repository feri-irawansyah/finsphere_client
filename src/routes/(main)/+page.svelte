<script>
    const { data } = $props();
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

<section id="section" class="container-fluid">
    <h2 class="page-title">{data.title}</h2>
    
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
        <div class="col-12 col-xxl-8 mt-3">
            <div class="card card-h-100">
                <div class="card-header d-flex flex-column flex-md-row align-items-md-center gap-3">
                    <h6 class="card-title mb-0 flex-grow-1">Product Sales</h6>
                    <div class="d-flex flex-wrap align-items-center flex-shrink-0 gap-2">
                        <button class="btn btn-primary border py-1 px-3">All</button>
                        <button class="btn btn-outline-light border py-1 px-3">Weekly</button>
                        <button class="btn btn-outline-light border py-1 px-3">Monthly</button>
                        <button class="btn btn-outline-light border py-1 px-3">Yearly</button>
                    </div>
                </div>
                <div class="card-body">
                    <div id="productSalesChart" dir="ltr"></div>
                </div>
            </div>
        </div>
    </div>
</section>