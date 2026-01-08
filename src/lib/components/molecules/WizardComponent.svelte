<script>
    const { wizardHeader, activeTab, children, wizardTitle, subTitle } = $props();

    const activeIndex = $derived(wizardHeader.findIndex(h => h.tabId === activeTab));
</script>

<div class="wizard-component">
    <h3 class="wizard-title">{wizardTitle}</h3>
    <p class="wizard-subtitle">{subTitle}</p>

    <div class="wizard-header">
        {#each wizardHeader as tab, i}
            <div class="wizard-item">
                {#if i !== 0}
                    <div
                        class="wizard-line left"
                        class:filled={i <= activeIndex}
                    ></div>
                {/if}

                <div
                    class="wizard-step"
                    class:active={i === activeIndex}
                    class:completed={i < activeIndex}
                >
                    <i class={i === activeIndex ? "bi bi-pen" : i < activeIndex ? "bi bi-check" : tab.icon}></i>
                </div>

                {#if i !== wizardHeader.length - 1}
                    <div
                        class="wizard-line right"
                        class:filled={i < activeIndex}
                    ></div>
                {/if}

                <span class="wizard-label">{tab.title}</span>
            </div>
        {/each}
    </div>

    <div class="wizard-content">
        {@render children(activeTab)}
    </div>
</div>

<style lang="scss">
    $step-size: 50px;
    $line-height: 3px;

    .wizard-component {
        text-align: center;

        .wizard-content {
            text-align: start;
        }
    }

    .wizard-header {
        display: flex;
        justify-content: space-between; /* Ubah ke space-between */
        align-items: center;
        position: relative;
        margin: 0 20px; /* Beri margin untuk jarak dari tepi */
    }

    .wizard-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        flex: 1; /* Buat setiap item mengisi ruang yang sama */
        min-width: 0; /* Penting untuk mencegah overflow */
    }

    /* ================= LINE ================= */
    .wizard-line {
        position: absolute;
        top: calc(#{$step-size} / 2);
        width: 100%; /* Garis mengisi seluruh ruang antar step */
        height: $line-height;
        background: #E0E2E6;
    }

    .wizard-line.filled {
        // gradient #A966FF00 0% dan #7B16FE
        background: linear-gradient(to right, #A966FF00 0%, #7B16FE 100%);
    }

    .wizard-line.left {
        right: 50%; /* Mulai dari tengah step sebelumnya */
        margin-right: calc(#{$step-size} / 2 + 0); /* Beri jarak dari step */
    }

    .wizard-line.right {
        left: 50%; /* Mulai dari tengah step saat ini */
        margin-left: calc(#{$step-size} / 2 + 0); /* Beri jarak dari step */
    }

    /* ================= STEP ================= */
    .wizard-step {
        width: $step-size;
        height: $step-size;
        border-radius: 50%;
        background: #F5F7F9;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        position: relative;

        i {
            color: #7E7695;
        }
    }

    .wizard-step.active {
        background: linear-gradient(to bottom, #d2b0ff 0%, #7B16FE 100%);
        color: white;
        box-shadow: 0 0 0 4px rgba(185, 13, 253, 0.2);

        i {
            color: white !important;
        }
    }

    .wizard-step.completed {
        background: linear-gradient(to bottom, #d2b0ff 0%, #7B16FE 100%);
        color: white;

        i {
            color: white !important;
        }
    }

    .wizard-label {
        margin-top: 8px;
        font-size: 0.75rem;
        text-transform: uppercase;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }
</style>