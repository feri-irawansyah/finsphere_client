<div class="public d-flex flex-row">
    <div class="left-section">
        <div class="image-wrapper position-relative">
            <div class="top-right-overlay"></div>
            <img src="/img/login-banner.jpg" alt="Login banner">
            <div class="bottom-left-overlay"></div>
        </div>
    </div>
    <div class="right-section">
        <h1>Login</h1>
    </div>
</div>

<style lang="scss">
    .public {
        height: 100vh;
        width: 100vw;
        overflow: hidden;

        .left-section {
            width: 50%;
            height: 100%;

            .image-wrapper {
                background-color: saddlebrown;
                width: 50vw; 
                height: 100vh;
                overflow: hidden;

                img {
                    width: 120%;
                    height: 130%;
                    object-fit: cover;
                    object-position: top;
                    transform: scale(1.07);
                }

                .top-right-overlay {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 20vh;
                    height: 40vh;
                    background: linear-gradient(-180deg, #A966FF00 0%, #A966FF);
                    z-index: 1;
                }
    
                .bottom-left-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 20vh;
                    height: 40vh;
                    background: linear-gradient(#A966FF00 0%, #A966FF);
                }
            }
        }
    }
</style>