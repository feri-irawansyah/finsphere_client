<script>    
    let form = $state({
        email: '',
    });

</script>

<div class="login d-flex flex-row">
    <div class="left-section">
        <div class="image-wrapper position-relative">
            <div class="top-right-overlay"></div>
            <img src="/img/login-banner.jpg" alt="Login banner">
            <div class="bottom-left-overlay"></div>
        </div>
    </div>
    <div class="right-section d-flex flex-column justify-content-center align-items-center w-100">
        <form action="" class="d-flex flex-column w-50 gap-1">
            <img src="/favicon.ico" class="my-2" style="width: 2rem;" alt="">
            <h1 class="text-primary fw-bold" style="font-size: 1.5rem;">Need a Password Reset ?</h1>
            <p>Submit your email and we’ll send instructions to reset your password.</p>

            <div class="input-group input-group-email mb-3">
                <span class="input-group-text" id="email-icon"><i class="bi bi-profile"></i></span>
                <input bind:value={form.email} required type="email" class="form-control" placeholder="Email" aria-label="Email" aria-describedby="email-icon">
            </div>
            <button type="submit" class="btn btn-gradient-primary w-100">Log In</button>
            <div class="my-3 text-center">
                <p>Already Remenber Password ? <a href="/login" class="text-primary text-decoration-none">Login Here!</a></p>
            </div>
        </form>
    </div>
</div>

<style lang="scss">
    .login {
        height: 100vh;
        width: 100vw;
        overflow: hidden;

        .left-section {
            width: 50%;
            height: 100%;

            .image-wrapper {
                width: 50vw; 
                height: 100vh;
                overflow: hidden;

                img {
                    width: 101%;
                    height: 130%;
                    object-fit: cover;
                    object-position: top;
                    transform: scale(1.07);
                }

                .bottom-left-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 30vw;
                    height: 100vh;
                    background: radial-gradient(
                        120% 120% at bottom left,
                        #A966FF,
                        rgba(169, 102, 255, 0.15),
                        transparent 90%
                    );
                    z-index: 1;
                }

                .top-right-overlay {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 30vw;
                    height: 100vh;
                    background: radial-gradient(
                        120% 120% at top right,
                        #A966FF,
                        rgba(169, 102, 255, 0.15),
                        transparent 90%
                    );
                    z-index: 1;
                }
            }
        }
    }
</style>