<script>
    const { data } = $props();
</script>

<div class="row" id="dashboard" data-aos="fade-left">
    <div class="col-12">
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
</div>