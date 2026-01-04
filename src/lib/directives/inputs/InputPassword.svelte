<script>
    let { value = $bindable(), ...props } = $props();

    let show = $state(false);
</script>   

<div class="input-group input-group-password mb-3">
    <span class="input-group-text" id="password-icon"><i class="bi bi-lock"></i></span>
    <input {...props} bind:value={value} type="{show ? 'text' : 'password'}" class="form-control" placeholder="{show ? 'Finsphere@123' : '**********'}" aria-label="Password" aria-describedby="password-icon">
    <button type="button" onclick={() => show = !show} aria-label="show-hode" class="input-group-text" id="show-hide"><i class="bi bi-eye{!show ? '-slash' : ''}"></i></button>
</div>

<style lang="scss">
    .input-group-password {
        input {
            border-right: none;
            border-left: none;

            &::placeholder {
                color: #C6C1D7;
            }
        }
        .input-group-text{
            background-color: transparent;
        }
        button {
            border-left: none;
            background-color: transparent;
        }
    }
</style>