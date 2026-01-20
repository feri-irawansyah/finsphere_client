<script>
    import { goto } from "$app/navigation";
    import InputPassword from "$lib/directives/inputs/InputPassword.svelte";
    import fetcher from "$lib/fetcher";
    import { applicationStore } from "$lib/stores/applicationStore";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let formData = $state({
        email: localStorage.getItem("expiredPasswordEmail"),
        resetToken: localStorage.getItem("expiredPasswordResetToken"),
        loading: false,
        allRulesPassed: false,
        newPassword: "",
    });

    let rules = $state({
        minLength: false,
        uppercase: false,
        number: false,
        special: false,
        notOnlyLettersOrNumbers: false,
    });

    $effect(() => {
        // #region Untuk onchange dari password rules
        // Aturan Kata Sandi:
        // Minimal 8 karakter
        // Mengandung huruf besar (A–Z)
        // Mengandung angka (0–9)
        // Contains symbol (!@#$%^&*)
        // Tidak boleh hanya terdiri dari huruf atau hanya angka
        let password = formData.newPassword;
        password = password || "";

        console.log("anua");

        rules.minLength = password.length >= 8;
        rules.uppercase = /[A-Z]/.test(password);
        rules.number = /[0-9]/.test(password);
        rules.special = /[^A-Za-z0-9]/.test(password);
        rules.notOnlyLettersOrNumbers = !(
            /^[A-Za-z]+$/.test(password) || /^[0-9]+$/.test(password)
        );

        let score = 0;
        if (rules.minLength) score++;
        if (rules.uppercase) score++;
        if (rules.number) score++;
        if (rules.special) score++;
        if (rules.notOnlyLettersOrNumbers) score++;

        if (!password) {
            formData.strengthClass = "";
        } else if (score <= 2) {
            formData.strengthClass = "strength-weak";
        } else if (score <= 4) {
            formData.strengthClass = "strength-medium";
        } else {
            formData.strengthClass = "strength-strong";
        }

        formData.allRulesPassed = score === 5;
        // #endregion
    });

    async function triggerExpiredPasswordOtp() {
        const URLSubmit = `${applicationStore.urlPlatformConsole}/usersexpiredpassword/request`;

        try {
            const email = localStorage.getItem("expiredPasswordEmail");
            if (!email) return;

            Swal.fire({
                title: "Mengirim OTP...",
                didOpen: () => Swal.showLoading(),
                allowOutsideClick: false,
            });

            const payload = {
                email: formData.email,
            };

            const rst = await fetcher(fetch, URLSubmit, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (rst?.success) {
                localStorage.setItem("expiredPasswordState", "OTP_SENT");

                Swal.fire({
                    icon: "success",
                    title: "Kode Verifikasi Dikirim",
                    text: "Silakan masukkan kode OTP untuk melanjutkan.",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    window.location.href = "/expired-password-verify";
                });
            }
        } catch (err) {
            Swal.fire(
                "Error",
                "Gagal mengirim OTP. Silakan coba lagi.",
                "error",
            );
        }
    }

    async function submitChangePassword() {
        if (formData.loading) return;

        try {
            formData.loading = true;

            Swal.fire({
                icon: "question",
                title: "Konfirmasi",
                text: "Apakah Anda yakin ingin memperbarui kata sandi?",
                showCancelButton: true,
                confirmButtonText: "Ya, Ubah",
                cancelButtonText: "Batal",
            }).then(async function (result) {
                if (!result.isConfirmed) return;

                try {
                    let URLSubmit = `${applicationStore.urlPlatformConsole}/usersexpiredpassword/reset`;

                    // === LOADING SWEETALERT ===
                    Swal.fire({
                        title: "Memproses...",
                        html: '<div style="font-size:14px;color:#555;">Sedang memperbarui kata sandi Anda</div>',
                        didOpen: () => Swal.showLoading(),
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                    });

                    const payload = {
                        email: formData.email,
                        resetToken: formData.resetToken,
                        newPassword: formData.newPassword,
                        confirmPassword: formData.confirmPassword,
                    };

                    const rst = await fetcher(fetch, URLSubmit, {
                        method: "POST",
                        body: JSON.stringify(payload),
                    });

                    console.log("anuan", rst);

                    if (rst?.success === true) {
                        Swal.fire({
                            icon: "success",
                            title: "Password berhasil diubah",
                            text: "Silakan login menggunakan password baru Anda.",
                            timer: 1800,
                            showConfirmButton: false,
                        }).then(() => {
                            localStorage.removeItem("expiredPasswordEmail");
                            localStorage.removeItem(
                                "expiredPasswordResetToken"
                            );
                            localStorage.removeItem("expiredPasswordMethod");
                            goto("/login");
                            return;
                        });
                    } else {
                        let msg = rst?.message;

                        if (
                            msg === "Reset token is invalid." ||
                            msg === "Reset token already used." ||
                            msg === "Reset token has expired."
                        ) {
                            localStorage.removeItem(
                                "expiredPasswordResetToken",
                            );
                            triggerExpiredPasswordOtp();
                        }

                        Swal.fire({
                            icon: "error",
                            title: "Gagal Mengubah Password",
                            text: msg || "Terjadi kesalahan.",
                        });
                    }
                } catch (err) {
                    let msg = err?.message;

                    if (msg === "Reset token has expired.") {
                        msg =
                            "Kode verifikasi sudah kedaluwarsa. Kami akan mengirimkan kode baru.";

                        Swal.fire({
                            icon: "warning",
                            title: "Kode Kedaluwarsa",
                            text: msg,
                            confirmButtonText: "OK",
                        }).then(() => {
                            localStorage.removeItem(
                                "expiredPasswordResetToken",
                            );
                            triggerExpiredPasswordOtp();
                        });

                        return;
                    } else if (
                        msg === "Reset token is invalid." ||
                        msg === "Reset token already used."
                    ) {
                        msg =
                            "Link reset password tidak valid. Silakan ulangi proses.";

                        Swal.fire({
                            icon: "error",
                            title: "Gagal Mengubah Password",
                            text: msg,
                            confirmButtonText: "Kembali ke login",
                        }).then(() => {
                            window.location.href = "/login";
                        });
                        return;
                    } else if (err?.message) {
                        msg = err.message;
                    }

                    Swal.fire({
                        icon: "error",
                        title: "Gagal Mengubah Password",
                        text: msg,
                        confirmButtonText: "OK",
                    });
                } finally {
                    formData.loading = false;
                }
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal Mengirim Permintaan",
                text:
                    err?.message ||
                    "Terjadi kesalahan saat memproses permintaan.",
                confirmButtonText: "OK",
            });
        } finally {
            formData.loading = false;
        }
    }

    onMount(() => {
        if (localStorage.getItem("expiredPasswordState") !== "OTP_VERIFIED") {
            goto("/login");
        }
    });
</script>

<div
    class="public d-flex flex-column justify-content-center align-items-center"
>
    <div class="bottom-left-overlay"></div>
    <div class="otp-container">
        <div class="otp-card">
            <h4 class="text-center">Atur Kata Sandi Baru</h4>
            <p class="text-muted text-center">
                Silahkan buat kata sandi baru. Anda tidak dapat menggunakan
                kembali kata sandi yang pernah digunakan sebelumnya.
            </p>

            <form
                onsubmit={async () => await submitChangePassword()}
                id="passwordResetForm"
            >
                <!-- NEW PASSWORD -->
                <div class="mb-4">
                    <div class="password-input-wrapper">
                        <InputPassword
                            id="newPassword"
                            bind:value={formData.newPassword}
                            autocomplete="one-time-code"
                            required
                            withicon={false}
                            placeholder="Kata Sandi Baru"
                        />
                    </div>
                </div>

                <!-- CONFIRM NEW PASSWORD -->
                <div class="mb-4">
                    <InputPassword
                        id="confirmPassword"
                        bind:value={formData.confirmPassword}
                        autocomplete="one-time-code"
                        required
                        withicon={false}
                        placeholder="Konfirmasi Kata Sandi Baru"
                    />
                </div>

                <!-- PASSWORD RULES -->
                <div class="password-rules mt-3">
                    <h6>Aturan Kata Sandi:</h6>
                    <ul>
                        <li class:passed={rules.minLength}>
                            Minimal 8 karakter
                        </li>
                        <li class:passed={rules.uppercase}>
                            Mengandung huruf besar (A&ndash;Z)
                        </li>
                        <li class:passed={rules.number}>
                            Mengandung angka (0&ndash;9)
                        </li>
                        <li class:passed={rules.special}>
                            Contains symbol (!@#$%^&*)
                        </li>
                        <li class:passed={rules.notOnlyLettersOrNumbers}>
                            Tidak boleh hanya terdiri dari huruf atau hanya
                            angka
                        </li>
                    </ul>
                </div>

                <button
                    type="submit"
                    class="btn btn-gradient-primary w-100"
                    disabled={formData.loading ||
                        !formData.allRulesPassed ||
                        formData.newPassword !== formData.confirmPassword}
                    >{#if !formData.loading}Update Password{:else}
                        <span class="spinner-border spinner-border-sm me-1"
                        ></span>Please wait ...{/if}</button
                >
                <div class="my-3 text-center">
                    <p>
                        <a href="/login" class="text-muted text-decoration-none"
                            >Kembali ke login</a
                        >
                    </p>
                </div>
            </form>
        </div>
    </div>
    <div class="top-right-overlay"></div>
</div>

<style lang="scss">
    .otp-container {
        position: relative;
        z-index: 10;
    }

    .otp-card {
        width: 560px;
        padding: 374px;
        background: #fff;
        border-radius: 24px;
        border: 1px solid #e0e0e0;
        padding: 26px 36px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        gap: 32px;
    }

    .password-rules li.passed {
        color: #00b060;
        font-weight: 600;
    }
</style>
