<script>
    import { goto } from "$app/navigation";
    import InputPassword from "$lib/directives/inputs/InputPassword.svelte";
    import fetcher from "$lib/fetcher";
    import { applicationStore } from "$lib/stores/applicationStore";
    import Swal from "sweetalert2";

    const URLVerify = `${applicationStore.urlPlatformConsole}/usersmfa/verify`;

    let formData = $state({
        loading: false,
        qrBase64: localStorage.getItem("mfa_qr_base64"),
        secretKey: localStorage.getItem("mfa_secret_key"),
        token: localStorage.getItem("access_token"),
        otp: ["", "", "", "", "", ""],
    });

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

    function maybeLater() {
        localStorage.removeItem("method_mfa");
        localStorage.removeItem("pending_login_email");

        goto("/");
    }

    async function verifyOtp() {
        if (formData.loading) return;

        Swal.fire({
            icon: "question",
            title: "Konfirmasi",
            text: "Apakah Anda yakin ingin mengaktifkan MFA ?",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal",
        }).then(async function (result) {
            if (!result.isConfirmed) return;

            formData.loading = true;

            const finalOTP = formData.otp.join("");

            if (finalOTP.length !== 6) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid OTP",
                    text: "Kode OTP harus 6 digit angka.",
                });
                return;
            }

            if (!formData.token) {
                Swal.fire({
                    icon: "error",
                    title: "Session Expired",
                    text: "Silakan login ulang.",
                });
                return;
            }

            const payload = {
                otp: finalOTP,
            };

            // === SHOW LOADING INSIDE SWEETALERT ===
            Swal.fire({
                title: "Memproses OTP...",
                html: '<div style="font-size:14px;color:#555;">Sedang memverifikasi OTP Anda</div>',
                didOpen: () => Swal.showLoading(),
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
            });

            try {
                const rst = await fetcher(fetch, URLVerify, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });

                localStorage.removeItem("mfa_secret_key");
                localStorage.removeItem("mfa_qr_base64");
                localStorage.removeItem("method_mfa");

                Swal.fire({
                    icon: "success",
                    title: "MFA Setup Completed",
                    text: "MFA Anda berhasil diaktifkan.",
                    timer: 1800,
                    showConfirmButton: false,
                });

                setTimeout(() => {
                    window.location.href = "/";
                    location.reload();
                }, 1200);
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal Mengaktifkan",
                    text: err?.message || "Gagal mengaktifkan MFA.",
                });
            } finally {
                formData.loading = false;
            }
        });
    }
</script>

<div
    class="public d-flex flex-column justify-content-center align-items-center"
>
    <div class="bottom-left-overlay"></div>
    <div class="otp-container">
        <div class="otp-card">
            <h4 class="text-center mb-1">
                Atur MFA melalui Google Authenticator
            </h4>
            <p class="otp-subtitle text-center">
                Siapkan MFA Anda menggunakan aplikasi Google Authenticator.
            </p>
            <div class="mfa-step-label">1. Scan QR Code</div>
            <p class="mfa-step-detail">
                Buka aplikasi Google Authenticator dan pindai kode QR di bawah
                ini untuk menautkan akun Anda.
            </p>

            <div class="mfa-setup-key-box">
                <div style="display: flex; gap:16px; align-items:center;">
                    <!-- QR Code -->
                    <img
                        class="mfa-qr"
                        src={formData.qrBase64}
                        alt="QR Code"
                        ng-dblclick="openQrPreview()"
                    />

                    <div style="flex:1;">
                        <div class="cant-scan-label">
                            Tidak dapat memindai QR?
                        </div>
                        <div class="cant-scan-desc">
                            Gunakan kode <a href={null} class="setup-key-link"
                                >setup di bawah ini</a
                            > untuk menyelesaikan proses MFA secara manual.
                        </div>

                        <div class="setup-key-row">
                            <InputPassword
                                id="secretKey"
                                bind:value={formData.secretKey}
                                autocomplete="one-time-code"
                                withicon={false}
                                withcopypaste={true}
                                readonly
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="mfa-step-label">2. Input Code</div>
            <p class="mfa-step-detail">
                Setelah kode QR berhasil dipindai, masukkan 6 digit kode yang
                dihasilkan oleh Google Authenticator.
            </p>

            <form
                onsubmit={() => {
                    verifyOtp();
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
                        formData.otp.join("").length !== 6}>Lanjutkan</button
                >
                <button
                    type="button"
                    class="otp-btn btn"
                    onclick={() => {
                        maybeLater();
                    }}>Batal</button
                >
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

    .mfa-step-label {
        width: 120px;
        height: 30px;
        border-radius: 12px;
        border: 1px solid #a966ff;
        background: #a966ff26;
        padding: 6px;
        display: flex;
        align-items: center;
        font-size: 13px;
        font-weight: 600;
        color: #a966ff;
        gap: 10px;
        opacity: 1;
        margin-bottom: 8px;
    }

    .mfa-setup-key-box {
        background: #f6f5fc;
        border-radius: 12px;
        border: 1px solid #e0e2e6;
        padding: 16px;
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 12px;
    }

    .cant-scan-label {
        font-weight: 600;
        font-size: 13px;
        color: #232134;
        margin-bottom: 2px;
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

    .mfa-qr {
        width: 124px;
        height: 124px;
        object-fit: contain;
        margin-top: 2px;
        background: #fafbff;
    }

    .cant-scan-desc {
        font-size: 13px;
        color: #7766aa;
        margin-bottom: 9px;
    }
</style>
