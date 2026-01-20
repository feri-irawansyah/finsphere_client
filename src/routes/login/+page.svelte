<script>
    import InputPassword from "$lib/directives/inputs/InputPassword.svelte";
    import { goto } from "$app/navigation";
    import fetcher from "$lib/fetcher";
    import Swal from "sweetalert2";
    import { applicationStore } from "$lib/stores/applicationStore";
    import { onMount } from "svelte";

    let form = $state({
        email: "",
        password: "",
    });

    let loading = false;

    async function loginSubmit(e) {
        e.preventDefault();
        loading = true;

        // bersihin storage kaya Angular
        localStorage.removeItem("method_mfa");
        localStorage.removeItem("access_token");

        const email = form.email;
        const password = form.password;

        const payload = {
            Email: email,
            Password: password,
        };

        try {
            const resp = await fetcher(
                fetch,
                `${applicationStore.urlPlatformConsole}/login`,
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                },
            );

            loading = false;

            localStorage.setItem(
                "method_mfa",
                resp.enableMFA ? "google_auth" : "email",
            );

            // === MFA TIDAK AKTIF ===
            if (!resp.enableMFA) {
                localStorage.setItem("access_token", resp.accessToken);
                goto("/mfa-enable");
            }
            // === MFA AKTIF ===
            else {
                localStorage.setItem("pending_login_email", email);
                goto("/login-otp");
            }
        } catch (err) {
            loading = false;

            const detail = err?.detail;
            console.log("err", err);
            localStorage.setItem("expiredPasswordEmail", email);

            if (err.status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "Login Gagal",
                    text: detail,
                });
            }

            // === PASSWORD EXPIRED ===
            if (
                detail ===
                "Kata sandi Anda telah kedaluwarsa. Silakan melakukan pengaturan ulang kata sandi."
            ) {
                Swal.fire({
                    icon: "warning",
                    title: "Password Kedaluwarsa",
                    text: "Kami akan mengirimkan kode verifikasi untuk reset password Anda.",
                    confirmButtonText: "Lanjutkan",
                }).then(() => {
                    triggerExpiredPasswordOtp();
                });
                return;
            }
        }
    }

    async function triggerExpiredPasswordOtp() {
        Swal.fire({
            title: "Memproses...",
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        });

        const email = localStorage.getItem("expiredPasswordEmail");

        try {
            const res = await fetcher(
                fetch,
                `${applicationStore.urlPlatformConsole}/usersexpiredpassword/request`,
                {
                    method: "POST",
                    body: JSON.stringify({ email }),
                },
            );

            if (res?.success) {
                localStorage.setItem("expiredPasswordMethod", res.data.method);
                localStorage.setItem("expiredPasswordState", "OTP_SENT");

                Swal.fire({
                    icon: "success",
                    title: "Kode Verifikasi Dikirim",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    goto("/expired-password-verify");
                });
            } else {
                Swal.fire("Error", "Gagal mengirim OTP.", "error");
            }
        } catch (err) {
            console.log(err);
            Swal.fire("Error", "Terjadi kesalahan saat mengirim OTP.", "error");
        }
    }

    onMount(() => {
        localStorage.removeItem("expiredPasswordEmail");
        localStorage.removeItem("expiredPasswordResetToken");
        localStorage.removeItem("expiredPasswordMethod");
        localStorage.removeItem("expiredPasswordState");

        localStorage.removeItem("forgotPasswordResetToken");
        localStorage.removeItem("forgotPasswordMethod");
        localStorage.removeItem("forgotPasswordState");
        localStorage.removeItem("pending_login_email");
    });
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
        <form onsubmit={loginSubmit} class="d-flex flex-column w-50 gap-1">
            <h1 class="text-gradient fw-bold m-0" style="font-size: 1.5rem;">
                Log In to Finsphere Dashboard
            </h1>
            <p>
                Sign in to access your dashboard and stay on top of your
                financial activity real-time
            </p>

            <div class="input-group input-group-email mb-3">
                <span class="input-group-text" id="email-icon"
                    ><i class="bi bi-profile"></i></span
                >
                <input
                    bind:value={form.email}
                    autofocus
                    required
                    type="email"
                    class="form-control"
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="email-icon"
                />
            </div>
            <InputPassword bind:value={form.password} required />
            <div class="mt-3 mb-3 text-end">
                <a
                    href="/forget-password"
                    class="text-muted text-decoration-none">Forgot Password?</a
                >
            </div>
            <button type="submit" class="btn btn-gradient-primary w-100"
                >Log In</button
            >
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

    .text-gradient {
        background: linear-gradient(183deg, #358ffc, #358ffc, #ec4899);
        filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04))
            drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1));
        color: transparent;
        -webkit-background-clip: text;
    }
</style>
