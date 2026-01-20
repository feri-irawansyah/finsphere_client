<script>
    import { goto } from "$app/navigation";
    import fetcher from "$lib/fetcher";
    import { applicationStore } from "$lib/stores/applicationStore";
    import Swal from "sweetalert2";

    const URLEnable = `${applicationStore.urlPlatformConsole}/usersmfa/enable`;

    let formData = $state({
        loading: false,
    });

    function maybeLater() {
        localStorage.removeItem("method_mfa");
        localStorage.removeItem("pending_login_email");

        goto("/");
    }

    async function enableMfa() {
        formData.loading = true;

        const token = localStorage.getItem("access_token");

        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Sesi Berakhir",
                text: "Silakan login kembali.",
            });
            window.location.href = "/login";
            return;
        }

        try {
            const rst = await fetcher(fetch, URLEnable, {
                method: "POST",
            });

            // Simpan secret key dan QR code ke localStorage
            localStorage.setItem("mfa_secret_key", rst.secretKey);
            localStorage.setItem("mfa_qr_base64", rst.qrCode);

            Swal.fire({
                icon: "success",
                title: "MFA Diaktifkan",
                text: "Silakan scan QR code pada langkah berikutnya.",
                timer: 1200,
                showConfirmButton: false,
            }).then(() => {
                goto("/mfaverify");
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal Mengaktifkan",
                text: err?.message || "Gagal mengaktifkan MFA.",
            });
        } finally {
            formData.loading = false;
        }
    }
</script>

<div
    class="public d-flex flex-column justify-content-center align-items-center"
>
    <div class="bottom-left-overlay"></div>
    <div class="otp-container">
        <div class="otp-card">
            <div class="otp-icon-wrapper">
                <div class="otp-icon-circle"></div>
            </div>

            <h2 class="otp-title">Amankan Akses Akun Anda dengan MFA</h2>
            <p class="otp-subtitle">
                Keamanan akun Anda adalah prioritas kami. Aktifkan Multi-Factor
                Authentication (MFA) untuk perlindungan ekstra dari akses yang
                tidak sah.
            </p>

            <form onsubmit={() => enableMfa()}>
                <button
                    type="submit"
                    class="otp-btn btn btn-gradient-primary mb-3"
                    >Aktifkan MFA</button
                >
                <a
                    class="otp-maybe-latter text-decoration-none text-muted"
                    onclick={() => maybeLater()}
                    href={null}
                >
                    Lewati untuk Sekarang
                </a>
            </form>
        </div>
    </div>
    <div class="top-right-overlay"></div>
</div>

<style>
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
        text-align: center;
        gap: 32px;
    }

    .otp-icon-circle {
        width: 72px;
        height: 72px;
        background-image: url("/img/auth/Group 9.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        display: flex;
        margin: 0 auto;
        opacity: 1;
    }

    .otp-icon-wrapper {
        margin-bottom: 26px;
    }

    .otp-title {
        font-size: 20px;
        font-weight: 700;
        color: #111;
        margin-bottom: 6px;
    }

    .otp-subtitle {
        color: #777;
        margin-bottom: 25px;
        font-size: 14px;
    }

    .otp-btn {
        width: 488px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 12px 16px;
        border-radius: 6px;
        border: 1px solid #8937f5;
        background: #9747ff;
        box-shadow:
            0px 7px 3px -5px #0b032d30,
            inset 0px 4px 4px 0px #a5bdd540;
        cursor: pointer;
        color: #ffffff;
        font-weight: 600;
        font-size: 14px;
        opacity: 1;
    }

    .otp-btn:hover {
        opacity: 0.9;
    }
</style>
