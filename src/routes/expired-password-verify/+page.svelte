<script>
    import { goto } from "$app/navigation";
    import fetcher from "$lib/fetcher";
    import { applicationStore } from "$lib/stores/applicationStore";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let formData = $state({
        email: localStorage.getItem("expiredPasswordEmail"),
        method: localStorage.getItem("expiredPasswordMethod"),
        loading: false,
        isCooldown: false,
        subtitleText: "",
        otp: ["", "", "", "", "", ""],
        resendText: "Kirim Ulang Email Verifikasi",
    });

    async function otpVerify() {
        if (formData.loading) return;

        try {
            formData.loading = true;

            const finalOTP = formData.otp.join("");

            if (finalOTP.length !== 6 || /\D/.test(finalOTP)) {
                Swal.fire({
                    icon: "error",
                    title: "OTP Tidak Valid",
                    text: "Kode OTP harus 6 digit angka.",
                });
                return;
            }

            const URLVerify = `${applicationStore.urlPlatformConsole}/usersexpiredpassword/verify`;

            const payload = {
                email: formData.email,
                otp: finalOTP,
            };

            const rst = await fetcher(fetch, URLVerify, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (rst.success) {
                const resetToken = rst.data.resetToken;

                localStorage.setItem("expiredPasswordResetToken", resetToken);
                localStorage.setItem("expiredPasswordState", "OTP_VERIFIED");

                Swal.fire({
                    icon: "success",
                    title: "OTP Terverifikasi!",
                    text: "Silakan lanjut untuk membuat password baru.",
                    timer: 1200,
                    showConfirmButton: false,
                }).then(() => {
                    
                    goto("/expired-password-reset");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "OTP Salah",
                    text: rst.message || "OTP tidak valid.",
                });
            }
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

    async function resendEmail() {
        if (formData.loading || formData.isCooldown) return;

        try {
            formData.loading = true;
            formData.isCooldown = true;

            let email = localStorage.getItem("expiredPasswordEmail");

            Swal.fire({
                title: "Kirim ulang kode verifikasi?",
                text: `Kami akan mengirimkan ulang kode 6 digit ke ${email}.`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Ya, kirim ulang",
                cancelButtonText: "Batal",
            }).then(async (result) => {
                if (!result.isConfirmed) return;

                try {
                    const payload = { email: email };
                    const URLResend = `${applicationStore.urlPlatformConsole}/usersexpiredpassword/request`;

                    // === SHOW LOADING ===
                    Swal.fire({
                        title: "Mengirim Kode...",
                        html: '<div style="font-size:14px;color:#555;">Sedang mengirim kode verifikasi ke email Anda</div>',
                        didOpen: () => Swal.showLoading(),
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                    });

                    const rst = await fetcher(fetch, URLResend, {
                        method: "POST",
                        body: JSON.stringify(payload),
                    });

                    if (rst && rst.success) {
                        Swal.fire({
                            icon: "success",
                            title: "Kode Terkirim",
                            text: "Kode verifikasi baru telah dikirim ke email Anda.",
                            timer: 1500,
                            showConfirmButton: false,
                        });

                        // Mulai cooldown xxxxx
                        startCooldown();
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Gagal",
                            text: rst.message,
                        });
                    }
                } catch (err) {
                    console.log("err", err);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Gagal mengirim ulang email verifikasi.",
                    });
                } finally {
                    formData.loading = false;
                }
            });
        } catch (err) {
            console.log("err", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Gagal mengirim ulang email verifikasi.",
            });
        } finally {
            formData.loading = false;
        }
    }

    let otp = $state(["", "", "", "", "", ""]);
    let otpBoxes = [];

    function focusBox(idx) {
        if (idx < 0 || idx >= otpBoxes.length) return;
        otpBoxes[idx]?.focus();
        otpBoxes[idx]?.select();
    }

    function handleInput(e, idx, otpLength) {
        const value = e.target.value.replace(/\D/g, "");

        otp[idx] = value;

        // kalau isi & bukan input terakhir → pindah fokus
        if (value && idx < otpLength - 1) {
            otpBoxes[idx + 1]?.focus();
        }
    }

    function handleKeydown(e, idx) {
        if (e.key === "Backspace") {
            if (!otp[idx] && idx > 0) {
                focusBox(idx - 1);
            }
        } else if (e.key === "ArrowLeft") {
            focusBox(idx - 1);
        } else if (e.key === "ArrowRight") {
            focusBox(idx + 1);
        } else if (e.key.length === 1 && /\D/.test(e.key)) {
            e.preventDefault();
        }
    }

    // ----------------------------------------
    // KIRIM ULANG OTP (EMAIL)
    // ----------------------------------------

    let cooldownSeconds = 30;
    let countdownInterval = null;

    function startCooldown() {
        formData.isCooldown = true;
        let remaining = cooldownSeconds;

        formData.resendText = `Kirim ulang tersedia dalam ${remaining}s`;

        // safety: hentikan interval lama kalau ada
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        countdownInterval = setInterval(() => {
            remaining--;
            formData.resendText = `Kirim ulang tersedia dalam ${remaining}s`;

            if (remaining <= 0) {
                clearInterval(countdownInterval);
                formData.isCooldown = false;
                formData.resendText = "Kirim Ulang Email Verifikasi";
            }
        }, 1000);
    }

    onMount(() => {
        
        if (localStorage.getItem("expiredPasswordState") !== "OTP_SENT") {
            goto("/login");
        }

        // === SET SUBTITLE DINAMIS ===
        if (formData.method === "google_auth")
            formData.subtitleText =
                "Masukkan 6 digit kode yang dihasilkan oleh aplikasi Google Authenticator Anda.";
        else if (formData.method === "email")
            formData.subtitleText =
                "Kami telah mengirimkan kode 6 digit ke email Anda. Masukkan kode tersebut untuk melanjutkan.";
        else formData.subtitleText = "Masukkan kode verifikasi 6 digit.";
    });
</script>

<div
    class="public d-flex flex-column justify-content-center align-items-center"
>
    <div class="bottom-left-overlay"></div>
    <div class="otp-container">
        <div class="otp-card">
            <h4 class="text-center mb-1">Verifikasi Akses Akun</h4>

            <p class="mfa-step-detail text-center">
                Kami telah mengirimkan kode 6 digit ke email Anda. Masukkan kode
                tersebut untuk melanjutkan.
            </p>

            <form
                onsubmit={() => {
                    otpVerify();
                }}
            >
                <div class="otp-wrapper col-12 text-center gap-2">
                    {#each otp as value, idx (idx)}
                        <input
                            class="otp-box mx-1"
                            maxlength="1"
                            autocomplete="one-time-code"
                            bind:this={otpBoxes[idx]}
                            bind:value={formData.otp[idx]}
                            oninput={(e) => handleInput(e, idx, 6)}
                            onkeydown={(e) => handleKeydown(e, idx)}
                            onpaste={(e) => handlePaste(e, idx)}
                        />
                    {/each}
                </div>

                <button
                    type="submit"
                    class="otp-btn btn btn-gradient-primary my-2 mt-4"
                    disabled={formData.loading ||
                        formData.otp.join("").length !== 6}
                    >{#if !formData.loading}Verify{:else}
                        <span class="spinner-border spinner-border-sm me-1"
                        ></span>Please wait ...
                    {/if}</button
                >

                {#if formData.method === "email"}
                    <div
                        class="col-12 d-flex justify-content-center align-items-center"
                    >
                        <span class="fs-sm text-muted">
                            Tidak menerima kode verifikasi?
                            <a
                                href={null}
                                class="text-decoration-none"
                                disabled={formData.isCooldown ||
                                    formData.loading}
                                onclick={() => {
                                    resendEmail();
                                }}
                            >
                                {formData.resendText}
                            </a>
                        </span>
                    </div>
                {/if}
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

    .otp-title {
        font-size: 20px;
        font-weight: 700;
        color: #111;
    }

    .otp-subtitle {
        color: #777;
        font-size: 14px;
    }

    .otp-btn {
        width: 488px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .otp-btn:hover {
        opacity: 0.9;
    }

    .otp-box {
        width: 50px;
        height: 55px;
        border-radius: 10px;
        border: 1px solid #ddd;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
    }
</style>
