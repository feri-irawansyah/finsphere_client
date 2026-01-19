<script>
    import Swal from "sweetalert2";

    let {
        value = $bindable(),
        withicon = true,
        withcopypaste = false,
        disabled,
        ...props
    } = $props();
    let show = $state(false);

    async function copyToClipboard() {
        if (!value) return;

        try {
            await navigator.clipboard.writeText(value);

            Swal.fire({
                icon: "success",
                title: "Copied!",
                text: "Key copied to clipboard.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Copy failed", err);
        }
    }
</script>

<div class="input-group input-group-password">
    {#if withicon}
        <span class="input-group-text" id="password-icon"
            ><i class="bi bi-lock"></i></span
        >
    {/if}
    <input
        {...props}
        bind:value
        type={show ? "text" : "password"}
        class="form-control"
        autocomplete="one-time-code"
        placeholder={show ? "••••••••••" : "••••••••••"}
        aria-label="Password"
        aria-describedby="password-icon"
        {disabled}
    />
    <button
        type="button"
        {disabled}
        onclick={() => (show = !show)}
        aria-label="show-hode"
        class="input-group-text"
        id="show-hide"><i class="bi bi-eye{!show ? '-slash' : ''}"></i></button
    >
    {#if withcopypaste}
        <a href={null} title="Copy to clipboard" class="input-group-text" onclick={copyToClipboard}
            ><i class="bi bi-clipboard-fill"></i></a>
    {/if}
</div>

<style lang="scss">
    .input-group-password {
        input {
            &::placeholder {
                color: #c6c1d7;
            }
            &:read-only {
                background-color: #f3f3f3;
            }
        }
        .input-group-text {
            background-color: transparent;
        }
        button {
            border-left: none;
            background-color: transparent;
        }
    }
</style>
