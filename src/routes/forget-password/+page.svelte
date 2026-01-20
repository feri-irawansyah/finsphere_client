<script>
    import { goto } from "$app/navigation";
    import fetcher from "$lib/fetcher";
    import { applicationStore } from "$lib/stores/applicationStore";
    import Swal from "sweetalert2";

    const URLForgetPassword = `${applicationStore.urlPlatformConsole}/usersforgotpassword/request`;

    let formData = $state({
        email: "",
        loading: false,
    });

    async function forgotPasswordRequest() {
        if (formData.loading) return;

        try {
            formData.loading = true;

            const payload = {
                email: formData.email,
            };

            const rst = await fetcher(fetch, URLForgetPassword, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (!rst || rst.success !== true) {
                throw new Error(res.data?.message || "Request failed");
            }

            if (rst.data.otpSent) {
                const method = rst.data.method;

                localStorage.setItem("forgotPasswordEmail", formData.email);
                localStorage.setItem("forgotPasswordMethod", method);
                localStorage.setItem("forgotPasswordState", "OTP_SENT");

                Swal.fire({
                    icon: "success",
                    title: "Request Berhasil",
                    text: "Kode OTP telah dikirim. Silakan cek email Anda.",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    
                    goto("/forget-password-verify");
                });
            } else {
                // OTP tidak dikirim (user tidak ada / email gagal / google auth)
                Swal.fire({
                    icon: "info",
                    title: "Permintaan Diproses",
                    text: "Jika email terdaftar, kami akan mengirimkan instruksi reset password.",
                    confirmButtonText: "OK",
                });
            }
        } catch (err) {
            console.log("err", err);
        } finally {
            formData.loading = false;
        }
    }
</script>

<div class="login d-flex flex-row">
    <div class="left-section">
        <div class="image-wrapper position-relative">
            <div class="top-right-overlay"></div>
            <img src="/img/login-banner.jpg" alt="Login banner" />
            <div class="bottom-left-overlay"></div>
        </div>
    </div>
    <div
        class="right-section d-flex flex-column justify-content-center align-items-center w-100"
    >
        <form
            action=""
            onsubmit={() => {
                forgotPasswordRequest();
            }}
            class="d-flex flex-column w-50 gap-1"
        >
            <img src="/favicon.ico" class="my-2" style="width: 2rem;" alt="" />
            <h1 class="text-primary fw-bold" style="font-size: 1.5rem;">
                Lupa Kata Sandi ?
            </h1>
            <p>
                Masukkan alamat email Anda dan kami akan mengirimkan instruksi
                untuk mengatur ulang kata sandi Anda.
            </p>

            <div class="input-group input-group-email mb-3">
                <span class="input-group-text" id="email-icon"
                    ><i class="bi bi-profile"></i></span
                >
                <input
                    bind:value={formData.email}
                    required
                    type="email"
                    class="form-control"
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="email-icon"
                />
            </div>
            <button
                type="submit"
                class="btn btn-gradient-primary w-100"
                disabled={formData.loading}
                >{#if !formData.loading}Reset Password{:else}
                    <span class="spinner-border spinner-border-sm me-1"
                    ></span>Please wait ...{/if}</button
            >
            <div class="my-3 text-center">
                <p>
                    Sudah ingat kata sandi? <a
                        href="/login"
                        class="text-primary text-decoration-none"
                        >Masuk di sini!</a
                    >
                </p>
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
                    width: 111%;
                    height: 130%;
                    object-fit: cover;
                    object-position: top;
                    transform: scale(1.27);
                }

                .bottom-left-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 30vw;
                    height: 100vh;
                    background: radial-gradient(
                        120% 120% at bottom left,
                        #a966ff,
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
                        #a966ff,
                        rgba(169, 102, 255, 0.15),
                        transparent 90%
                    );
                    z-index: 1;
                }
            }
        }
    }
</style>
