<script>
    import ClientGrid from '$lib/directives/grids/ClientGrid.svelte';
    import Swal from 'sweetalert2';

    const { data } = $props();

    function doubleClientGrid(e) {
        Swal.fire({
            title: 'Double Click',
            text: JSON.stringify(e.detail),
            icon: 'info'
        })
    }
</script>

<section id="section">
    <h2 class="page-title">{data.title}</h2>
    <div class="row" id="users" data-aos="fade-left">
        <div class="col-12">
            <ClientGrid 
                columns={data.columns}
                url="/api/platform/console/roles"
                height={100}
                layout={85}
                tableName={data.tableName}
                on:selected={(e) => console.log('selected', e.detail)}
                on:doubleClicked={(e) => {
                    doubleClientGrid(e)
                }}
                clickRightRow={[
                    {
                        name: 'Open Detail',
                        icon: '<i class="bi bi-eye"></i>',
                        action: () => {
                            Swal.fire({
                                title: 'Right Click',
                                text: 'Open Detail',
                                icon: 'info'
                            })
                        }
                    },
                ]}>
                <h1>Okeh</h1>
            </ClientGrid>
        </div>
    </div>
</section>