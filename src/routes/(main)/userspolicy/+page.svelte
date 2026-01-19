<script>
    import ModalRoles from "$lib/components/molecules/modals/ModalRoles.svelte";
    import ModalUsers from "$lib/components/molecules/modals/ModalUsers.svelte";
    import ModalUsersRoles from "$lib/components/molecules/modals/ModalUsersRoles.svelte";
    import ClientGrid from "$lib/directives/grids/ClientGrid.svelte";
    import AutoSelect from "$lib/directives/inputs/AutoSelect.svelte";
    import InputPassword from "$lib/directives/inputs/InputPassword.svelte";
    import modalStore from "$lib/directives/modal/functions/modal-store.js";
    import fetcher from "$lib/fetcher";
    import { applicationStore } from "$lib/stores/applicationStore";
    import { TimeoutError } from "@microsoft/signalr";
    import { _paramToVariableName } from "ag-grid-community";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    const { data } = $props();

    let formData = $state({
        method: "POST",
        loading: false,
        token: localStorage.getItem("access_token"),
        isRequestingOTP: false,
        isRequestingMfa: false,
        isRequestingPasswordexpired: false,
        otp: ["", "", "", "", "", ""],
        otpmfa: ["", "", "", "", "", ""],
        MfaStatusText: "",
        realMfaStatus: false,
        isMfaEnabled: false,
        isSettingUpMfa: false,

        // init model
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        allRulesPassed: false,
        isMfaSubmitting: false,

        // toggle eye
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,

        strengthClass: "",

        isSettingUpMfa: false,
        showMfaCard: false,
        isMfaEnabled: false,
        qrBase64: "",
        secretKey: "",
        email: "",

        passwordExpiryOption: null,
        showPasswordExpiration: false,

        isCooldown: false,
        showPasswordCard: false,
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

    function handlePaste(e, idx) {
        const digits = e.clipboardData.getData("text").replace(/\D/g, "");

        if (!digits) return;

        e.preventDefault();

        for (let i = 0; i < digits.length; i++) {
            const target = idx + i;
            if (target >= otp.length) break;
            otp[target] = digits[i];
        }

        const last = Math.min(idx + digits.length - 1, otp.length - 1);
        tick().then(() => focusBox(last));
    }

    function CancelMfa() {
        formData.isSettingUpMfa = false;
        formData.showMfaCard = false;

        // kembalikan toggle ke status sebenarnya
        formData.isMfaEnabled = policyData.realMfaStatus;

        // clear form
        formData.qrBase64 = "";
        formData.secretKey = "";
        formData.otpmfa = ["", "", "", "", "", ""];
    }

    // ----------------------------------------
    // KIRIM ULANG OTP (EMAIL)
    // ----------------------------------------

    formData.resendText = "Kirim Ulang Email";
    formData.isCooldown = false;
    let cooldownSeconds = 30;
    let countdownInterval = null;

    function startCooldown() {
        formData.isCooldown = true;
        let remaining = cooldownSeconds;

        formData.resendText = `Kirim ulang tersedia dalam ${remaining}s`;

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

    function ResendEmail() {
        if (formData.isCooldown) return;

        try {
            Swal.fire({
                title: "Kirim ulang kode verifikasi?",
                text: `Kami akan mengirimkan ulang kode 6 digit ke email anda.`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Ya, kirim ulang",
                cancelButtonText: "Batal",
            }).then(async function (result) {
                if (!result.isConfirmed) return;

                formData.loading = true;

                const URLResend = `${applicationStore.urlPlatformConsole}/userpolicy/change-password/request`;

                // === TAMPILKAN LOADING LANGSUNG ===
                Swal.fire({
                    title: "Mengirim ulang kode...",
                    html: '<div style="font-size:14px;color:#555;">Mohon tunggu sebentar</div>',
                    didOpen: () => Swal.showLoading(),
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                });

                const rst = await fetcher(fetch, URLResend, {
                    method: "POST",
                });

                if (rst.message === "Password request successfully") {
                    // === SWEETALERT SUKSES � Auto Close ===
                    Swal.fire({
                        icon: "success",
                        title: "Kode Terkirim",
                        text: "Kode verifikasi baru telah dikirim ke email Anda.",
                        timer: 2500,
                        timerProgressBar: true,
                        confirmButtonText: "OK",
                    });

                    startCooldown();
                } else {
                    // === ERROR NORMAL ===
                    Swal.fire({
                        icon: "error",
                        title: "Gagal",
                        text: rst.message,
                    });
                }
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Gagal mengirim ulang email verifikasi.",
            });
        } finally {
            formData.loading = false;
        }
    }

    function CancelChangePassword() {
        formData.showPasswordCard = false;

        // reset form untuk keamanan
        formData.currentPassword = "";
        formData.newPassword = "";
        formData.confirmPassword = "";
        formData.otp = ["", "", "", "", "", ""];
    }

    async function RequestChangePassword() {
        const URLRequest = `${applicationStore.urlPlatformConsole}/userpolicy/change-password/request`;

        if (!formData.token) {
            Swal.fire({
                icon: "error",
                title: "Sesi Berakhir",
                text: "Silakan login kembali.",
            });
            window.location.href = "#/login";
            return;
        }

        try {
            // Disable button
            formData.isRequestingOTP = true;

            formData.loading = true;

            const rst = await fetcher(fetch, URLRequest, {
                method: "POST",
            });

            if (rst.message === "Password request successfully") {
                formData.showPasswordCard = true;

                let alertText = "";

                if (formData.method === "email")
                    alertText =
                        "Kami telah mengirimkan kode verifikasi ke alamat email Anda.";
                else if (formData.method === "mfa")
                    alertText =
                        "Silakan buka aplikasi Google Authenticator Anda untuk melihat kode OTP baru.";
                else alertText = "Kode verifikasi telah dikirim.";

                Swal.fire({
                    icon: "success",
                    title: "Kode Terkirim",
                    text: alertText,
                    timer: 2800,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text: "Unable to request password change.",
                });
            }
        } catch (err) {
            formData.isRequestingOTP = false;

            Swal.fire({
                icon: "error",
                title: "Gagal Melakukan Request",
                text: err?.detail || "Gagal melakukan permintaan.",
            });
        } finally {
            formData.loading = false;
        }
    }

    function submitChangePassword() {
        if (formData.loading) return;

        if (!formData.token) {
            Swal.fire({
                icon: "error",
                title: "Sesi Berakhir",
                text: "Silakan login kembali.",
            });
            window.location.href = "#/login";
            return;
        }

        const URLSubmit = `${applicationStore.urlPlatformConsole}/userpolicy/change-password/verify`;

        try {
            Swal.fire({
                icon: "question",
                title: "Konfirmasi",
                text: "Apakah Anda yakin ingin mengubah password?",
                showCancelButton: true,
                confirmButtonText: "Ya, Ubah",
                cancelButtonText: "Batal",
            }).then(async function (result) {
                if (!result.isConfirmed) return;

                // Mulai proses
                formData.loading = true;

                // === TAMPILKAN LOADING SWEETALERT ===
                Swal.fire({
                    title: "Memproses...",
                    html: '<div style="font-size:14px;color:#555;">Sedang mengubah password Anda</div>',
                    didOpen: () => Swal.showLoading(),
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                });

                const payload = {
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword,
                    otp: formData.otp.join(""),
                };

                try {
                    const rst = await fetcher(fetch, URLSubmit, {
                        method: "POST",
                        body: JSON.stringify(payload),
                    });

                    if (rst.message === "Password successfully changed.") {
                        Swal.fire({
                            icon: "success",
                            title: "Password berhasil diubah",
                            text: "Anda dapat menggunakan password baru.",
                            timer: 1500,
                            showConfirmButton: false,
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Gagal Mengubah Password",
                            text: rst?.detail || "Terjadi kesalahan.",
                        });
                    }
                } catch (err) {
                    Swal.fire({
                        icon: "error",
                        title: "Gagal Mengubah Password",
                        text: err?.detail || "Terjadi kesalahan.",
                    });
                } finally {
                    formData.loading = false;
                }
            });
        } catch (err) {
            const detail = err?.detail;
            let message = "Terjadi kesalahan.";

            if (detail === "Invalid OTP") {
                message = "Kode OTP salah. Maksimal 5 kali percobaan.";
            } else {
                message = detail;
            }

            Swal.fire({
                icon: "error",
                title: "Gagal Mengubah Password",
                text: message,
            });
        } finally {
            formData.loading = false;
        }
    }

    formData.qrZoomVisible = false;

    function openQrPreview() {
        formData.qrZoomVisible = true;
    }

    function closeQrPreview() {
        formData.qrZoomVisible = false;
    }

    function toggleQr() {
        formData.showQr = !formData.showQr;
    }

    function toggleSecret() {
        formData.showSecret = !formData.showSecret;
    }

    formData.showQr = true;
    formData.showSecret = false;

    formData.qrBase64 = "";
    formData.secretKey = "";

    async function RequestMfa() {
        const URLRequest = `${applicationStore.urlPlatformConsole}/userpolicy/mfa/enable`;

        if (!formData.token) {
            Swal.fire({
                icon: "error",
                title: "Sesi Berakhir",
                text: "Silakan login kembali.",
            });

            window.location.href = "#/login";
            return;
        }

        try {
            const rst = await fetcher(fetch, URLRequest, {
                method: "POST",
            });

            formData.showMfaCard = true;

            formData.qrBase64 = rst.qrCode;
            formData.secretKey = rst.secretKey;

            Swal.fire({
                icon: "success",
                title: "Permintaan MFA",
                text: "Silakan scan QR code dan Input OTP untuk Mengaktifkan MFA",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (err) {
            console.log("errc", err);
            formData.showMfaCard = false;

            Swal.fire({
                icon: "error",
                title: "Gagal Mengaktifkan",
                text: err?.message || "Gagal mengaktifkan MFA.",
            });
        }
    }

    function ToggleMfaSwitch() {
        // === CASE 1: Toggle ON ===
        if (formData.isMfaEnabled === true) {
            // MFA memang sudah aktif ? tidak perlu apa2
            if (formData.realMfaStatus === true) return;

            // User baru mau setup MFA
            formData.isSettingUpMfa = true;
            RequestMfa();
            return;
        }

        // === CASE 2: Toggle OFF ===
        if (formData.isMfaEnabled === false) {
            // Jika user sedang setup ? ini hanya cancel
            if (formData.isSettingUpMfa) {
                CancelMfa();
                return;
            }

            // Jika MFA memang aktif ? benar-benar disable dari server
            if (formData.realMfaStatus === true) DisableMfa();
        }
    }

    // === 3. Initial state ===
    formData.isMfaEnabled = false;

    async function VerifyOtp() {
        const URLRequest = `${applicationStore.urlPlatformConsole}/userpolicy/mfa/verify`;

        if (formData.isMfaSubmitting) return;

        try {
            Swal.fire({
                icon: "question",
                title: "Konfirmasi",
                text: "Apakah Anda yakin ingin mengaktifkan MFA ?",
                showCancelButton: true,
                confirmButtonText: "Ya",
                cancelButtonText: "Batal",
            }).then(async function (result) {
                if (!result.isConfirmed) return;

                const finalOTP = formData.otpmfa.join("");
                formData.loading = true;

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

                try {
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

                    formData.isMfaSubmitting = true;

                    const rst = await fetcher(fetch, URLRequest, {
                        method: "POST",
                        body: JSON.stringify(payload),
                    });

                    Swal.fire({
                        icon: "success",
                        title: "MFA Setup Completed",
                        text: "MFA Anda berhasil diaktifkan.",
                        timer: 1800,
                        showConfirmButton: false,
                    });

                    setTimeout(() => {
                        location.reload();
                    }, 1200);
                } catch (err) {
                    Swal.fire({
                        icon: "error",
                        title: "Verification Failed",
                        text:
                            err?.detail ||
                            "Terjadi kesalahan saat memperbarui pengaturan.",
                    });
                } finally {
                    formData.loading = false;
                }
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Verification Failed",
                text: "OTP tidak valid, silakan coba lagi.",
            });

            formData.isMfaSubmiloadingtting = false;
        } finally {
            formData.loading = false;
        }
    }

    function DisableVerifyOtp() {
        const URLRequest = `${applicationStore.urlPlatformConsole}/userpolicy/mfa/disable`;

        if (formData.isMfaSubmitting) return;

        try {
            const finalOTP = formData.otpmfa.join("");

            if (finalOTP.length !== 6) {
                Swal.fire({
                    icon: "error",
                    title: "OTP Tidak Valid",
                    text: "Kode OTP harus terdiri dari 6 digit angka.",
                });
                return;
            }

            if (!formData.token) {
                Swal.fire({
                    icon: "error",
                    title: "Sesi Berakhir",
                    text: "Silakan login kembali.",
                });
                return;
            }

            const payload = {
                email: formData.email,
                otp: finalOTP,
            };

            // === KONFIRMASI SEBELUM PROSES OTP ===
            Swal.fire({
                icon: "question",
                title: "Konfirmasi OTP",
                text: "Apakah Anda yakin ingin menonaktifkan MFA menggunakan kode OTP ini?",
                showCancelButton: true,
                confirmButtonText: "Ya, Lanjutkan",
                cancelButtonText: "Batal",
            }).then(async function (result) {
                if (!result.isConfirmed) return;

                // === SHOW PROGRESS MODAL ===
                Swal.fire({
                    title: "Memproses OTP...",
                    html: '<div style="font-size:14px;color:#555;">Harap tunggu, kami sedang memverifikasi kode OTP Anda</div>',
                    didOpen: () => Swal.showLoading(),
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });

                formData.isMfaSubmitting = true;

                const rst = await fetcher(fetch, url, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });

                Swal.fire({
                    icon: "success",
                    title: "MFA Nonaktif",
                    text: "Multi-Factor Authentication telah berhasil dinonaktifkan.",
                    timer: 1800,
                    showConfirmButton: false,
                });

                // Reset UI
                formData.isMfaEnabled = false;
                formData.showMfaCardDisable = false;

                setTimeout(() => {
                    location.reload();
                }, 1200);
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "OTP Tidak Valid",
                text:
                    err?.message ||
                    "Kode OTP yang Anda masukkan tidak sesuai. Silakan coba kembali.",
            });

            formData.isMfaSubmitting = false;
        }
    }

    function DisableMfa() {
        Swal.fire({
            icon: "warning",
            title: "Nonaktifkan MFA?",
            text: "Untuk menonaktifkan MFA, Anda perlu memverifikasi kode OTP dari aplikasi Google Authenticator.",
            showCancelButton: true,
            confirmButtonText: "Lanjutkan",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                // tampilkan card OTP disable
                formData.showMfaCardDisable = true;
                formData.showMfaCard = false;

                // reset OTP input
                formData.otpmfa = ["", "", "", "", "", ""];

                // $scope.$applyAsync();
            } else {
                // user batal ? kembalikan toggle ke posisi "ON"
                formData.isMfaEnabled = true;
                // $scope.$applyAsync();
            }
        });
    }

    const expiryOptions = $state([
        { label: "30 Hari", value: 30 },
        { label: "6 Bulan", value: 180 },
        { label: "1 Tahun", value: 365 },
    ]);

    function OpenPasswordExpiration() {
        formData.passwordExpiryOption = null;
        formData.showPasswordExpiration = true;
    }

    function CancelPasswordExpiration() {
        formData.showPasswordExpiration = false;
        formData.passwordExpiryOption = null;
    }

    function SubmitPasswordExpiration() {
        const URLRequest = `${applicationStore.urlPlatformConsole}/userpolicy/change-password/expired`;

        if (!formData.token) {
            Swal.fire({
                icon: "error",
                title: "Sesi Berakhir",
                text: "Silakan login kembali.",
            });
            return;
        }

        try {
            formData.isRequestingPasswordexpired = true;

            const payload = {
                days: formData.passwordExpiryOption,
            };

            Swal.fire({
                icon: "question",
                title: "Konfirmasi",
                text: "Simpan pengaturan masa berlaku password?",
                showCancelButton: true,
                confirmButtonText: "Ya",
                cancelButtonText: "Batal",
                reverseButtons: true,
            }).then(async function (result) {
                if (!result.isConfirmed) return;

                // === Loading ===
                Swal.fire({
                    title: "Menyimpan Pengaturan...",
                    html: '<div style="font-size:14px;color:#555;">Harap tunggu, sistem sedang menyimpan pengaturan Anda.</div>',
                    didOpen: () => Swal.showLoading(),
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });

                const rst = await fetcher(fetch, URLRequest, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });

                formData.isRequestingPasswordexpired = false;

                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Pengaturan masa berlaku password telah diperbarui.",
                    timer: 1800,
                    showConfirmButton: false,
                });

                formData.showPasswordExpiration = false;

                setTimeout(() => {
                    location.reload();
                }, 1200);
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    err?.detail ||
                    "Terjadi kesalahan saat memperbarui pengaturan.",
            });
        }
    }

    async function GetStatusMFA() {
        const URLRequest = `${applicationStore.urlPlatformConsole}/userpolicy/mfa/status`;
        const URLMethod = "GET";

        const rst = await fetcher(fetch, URLRequest);

        formData.realMfaStatus = rst.enabled === true;
        formData.method = rst.enabled ? "mfa" : "email";
        formData.isMfaEnabled = formData.realMfaStatus;
        formData.MfaStatusText = formData.realMfaStatus
            ? "Aktif"
            : "Tidak Aktif";
    }

    if (formData.method === "mfa")
        formData.subtitleText =
            "Masukkan 6 digit kode yang dihasilkan oleh aplikasi Google Authenticator Anda.";
    else if (formData.method === "email")
        formData.subtitleText =
            "Kami telah mengirimkan kode 6 digit ke email Anda. Masukkan kode tersebut untuk verifikasi perubahan password Anda.";
    else formData.subtitleText = "Masukkan kode verifikasi 6 digit.";

    onMount(async () => {
        await GetStatusMFA();
    });
</script>

<section id="section">
    <h2 class="page-title">{data.title}</h2>
    <div class="row" id={data.tableName} data-aos="fade-left">
        <div
            class="wrapper-scroll"
            style="max-height: calc(100vh - 80px); overflow-y: auto; padding-bottom: 50px;"
        >
            <div class="container-fluid py-4">
                <div>
                    <div class="position-relative mb-6">
                        <div
                            class="position-relative overflow-hidden rounded h-44 profile-widget"
                        >
                            <div class="size-96"></div>
                            <div class="size-80"></div>
                            <div class="size-40"></div>
                        </div>
                        <div class="text-center">
                            <div
                                class="position-relative d-inline-block mx-auto profile-avatar"
                            >
                                <div class="profile-avatar-wrapper mt-n14">
                                    <img
                                        src="img/user-45.png"
                                        loading="lazy"
                                        alt="user-45"
                                        class="mx-auto profile-avatar-img size-28"
                                    />
                                </div>
                                <div
                                    class="profile-avatar-dot bg-success size-4"
                                ></div>
                            </div>
                            <div class="avatar gap-1">
                                <h5 class="mt-2 mb-1">loginInfo.UserName</h5>
                            </div>
                        </div>
                    </div>

                    <div class="row justify-content-center">
                        <div class="col-12 col-md-8">
                            <div class="card mt-4">
                                <div class="card-header">
                                    <h6 class="mb-1 card-title">
                                        Account Policy Settings
                                    </h6>
                                    <span class="text-muted">
                                        Kelola kebijakan keamanan akun Anda,
                                        termasuk pembaruan kata sandi dan
                                        pengaktifan verifikasi Multi-Factor
                                        Authentication (MFA).
                                    </span>
                                </div>
                                <div class="card-body row p-4">
                                    <div class="col-12">
                                        <div class="card mb-0">
                                            <div class="card-header">
                                                <div class="flex-shrink-0">
                                                    <div
                                                        class="d-flex gap-2 align-items-center"
                                                    >
                                                        <img
                                                            src="img/google.png"
                                                            loading="lazy"
                                                            alt="google"
                                                            class="size-5"
                                                        />
                                                        <h5 class="mb-0">
                                                            Google
                                                            Authentication
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="card-body">
                                                <p class="text-muted">
                                                    Untuk meningkatkan keamanan
                                                    akun, kami telah menyediakan
                                                    fitur Verifikasi
                                                    Multi-Factor Authentication
                                                    (MFA). Anda dapat
                                                    mengaktifkannya menggunakan
                                                    aplikasi Google
                                                    Authenticator untuk
                                                    menghasilkan kode
                                                    verifikasi. Fitur ini tetap
                                                    dapat digunakan tanpa
                                                    koneksi internet.
                                                </p>
                                                <div
                                                    class="d-flex justify-content-end align-items-center"
                                                >
                                                    <div
                                                        class="d-flex align-items-center gap-2"
                                                    >
                                                        <label
                                                            for="MfaStatusText"
                                                            class="form-label cursor-pointer mb-0 fw-medium"
                                                        >
                                                            <span
                                                                >Status MFA</span
                                                            >

                                                            <span
                                                                id="MfaStatusText"
                                                                class="ms-2 text-muted"
                                                            >
                                                                {formData.MfaStatusText}
                                                            </span>
                                                        </label>

                                                        <div
                                                            class="form-switch switch-outline-primary pt-3"
                                                        >
                                                            <div
                                                                class="form-check form-switch"
                                                            >
                                                                <input
                                                                    id="isMfaEnabled"
                                                                    onchange={() => {
                                                                        ToggleMfaSwitch();
                                                                    }}
                                                                    bind:checked={
                                                                        formData.isMfaEnabled
                                                                    }
                                                                    class="form-check-input btn-lg"
                                                                    type="checkbox"
                                                                />
                                                                <label
                                                                    class="label"
                                                                    for="isMfaEnabled"
                                                                ></label>
                                                            </div>
                                                            <!-- <input
                                                        type="checkbox"
                                                        id="mfaToggle"
                                                        ng-model="isMfaEnabled"
                                                        ng-change="ToggleMfaSwitch()"
                                                    /> -->
                                                            <label
                                                                class="label"
                                                                for="mfaToggle"
                                                            ></label>
                                                        </div>
                                                    </div>
                                                </div>

                                                {#if formData.showMfaCard}
                                                    <div class="card-body">
                                                        <hr />
                                                        <div
                                                            class="mfa-step-label"
                                                        >
                                                            1. Scan QR Code
                                                        </div>
                                                        <p
                                                            class="mfa-step-detail"
                                                        >
                                                            Buka aplikasi Google
                                                            Authenticator dan
                                                            pindai kode QR di
                                                            bawah ini untuk
                                                            menautkan akun Anda.
                                                        </p>

                                                        <div
                                                            class="mfa-setup-key-box"
                                                        >
                                                            <div
                                                                style="display: flex; gap:16px; align-items:center;"
                                                            >
                                                                <!-- QR Code -->
                                                                <img
                                                                    class="mfa-qr"
                                                                    ng-show="showQr"
                                                                    src={formData.qrBase64}
                                                                    alt="QR Code"
                                                                    ondblclick={() => {
                                                                        openQrPreview();
                                                                    }}
                                                                />

                                                                <div
                                                                    style="flex:1;"
                                                                >
                                                                    <div
                                                                        class="cant-scan-label"
                                                                    >
                                                                        Tidak
                                                                        dapat
                                                                        memindai
                                                                        QR?
                                                                    </div>
                                                                    <div
                                                                        class="cant-scan-desc"
                                                                    >
                                                                        Gunakan
                                                                        kode <a
                                                                            href={null}
                                                                            class="setup-key-link"
                                                                            >setup
                                                                            di
                                                                            bawah
                                                                            ini</a
                                                                        > untuk menyelesaikan
                                                                        proses MFA
                                                                        secara manual.
                                                                    </div>

                                                                    <div
                                                                        class="setup-key-row"
                                                                    >
                                                                        <InputPassword
                                                                            id="secretKey"
                                                                            bind:value={
                                                                                formData.secretKey
                                                                            }
                                                                            autocomplete="one-time-code"
                                                                            withicon={false}
                                                                            withcopypaste={true}
                                                                            readonly
                                                                        />

                                                                        <!-- type="{{ showSecret ? 'text' : 'password' }}" -->

                                                                        <!-- <div
                                                                        class="icon-group"
                                                                    >
                                                                        Copy
                                                                        <button
                                                                            class="icon-btn-mfa"
                                                                            type="button"
                                                                            ng-click="CopySecret()"
                                                                        >
                                                                            <svg
                                                                                width="18"
                                                                                height="18"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                            >
                                                                                <rect
                                                                                    x="9"
                                                                                    y="9"
                                                                                    width="13"
                                                                                    height="13"
                                                                                    stroke="#232134"
                                                                                    stroke-width="2"
                                                                                />
                                                                                <rect
                                                                                    x="2"
                                                                                    y="2"
                                                                                    width="13"
                                                                                    height="13"
                                                                                    stroke="#232134"
                                                                                    stroke-width="2"
                                                                                />
                                                                            </svg>
                                                                        </button>
                                                                    </div> -->
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div
                                                            class="mfa-step-label"
                                                        >
                                                            2. Input Code
                                                        </div>
                                                        <p
                                                            class="mfa-step-detail"
                                                        >
                                                            Setelah kode QR
                                                            berhasil dipindai,
                                                            masukkan 6 digit
                                                            kode yang dihasilkan
                                                            oleh Google
                                                            Authenticator.
                                                        </p>

                                                        <form
                                                            onsubmit={async () => {
                                                                VerifyOtp();
                                                            }}
                                                        >
                                                            <div class="mb-4">
                                                                <!-- <div
                                                                class="otp-wrapper col-12 d-flex justify-content-start align-items-center gap-2"
                                                            >
                                                                <input
                                                                    ng-model="otpmfa[0]"
                                                                    data-idx="0"
                                                                    maxlength="1"
                                                                    class="otp-box"
                                                                    type="text"
                                                                    inputmode="numeric"
                                                                    pattern="[0-9]*"
                                                                />
                                                                <input
                                                                    ng-model="otpmfa[1]"
                                                                    data-idx="1"
                                                                    maxlength="1"
                                                                    class="otp-box"
                                                                    type="text"
                                                                    inputmode="numeric"
                                                                    pattern="[0-9]*"
                                                                />
                                                                <input
                                                                    ng-model="otpmfa[2]"
                                                                    data-idx="2"
                                                                    maxlength="1"
                                                                    class="otp-box"
                                                                    type="text"
                                                                    inputmode="numeric"
                                                                    pattern="[0-9]*"
                                                                />
                                                                <input
                                                                    ng-model="otpmfa[3]"
                                                                    data-idx="3"
                                                                    maxlength="1"
                                                                    class="otp-box"
                                                                    type="text"
                                                                    inputmode="numeric"
                                                                    pattern="[0-9]*"
                                                                />
                                                                <input
                                                                    ng-model="otpmfa[4]"
                                                                    data-idx="4"
                                                                    maxlength="1"
                                                                    class="otp-box"
                                                                    type="text"
                                                                    inputmode="numeric"
                                                                    pattern="[0-9]*"
                                                                />
                                                                <input
                                                                    ng-model="otpmfa[5]"
                                                                    data-idx="5"
                                                                    maxlength="1"
                                                                    class="otp-box"
                                                                    type="text"
                                                                    inputmode="numeric"
                                                                    pattern="[0-9]*"
                                                                />
                                                            </div> -->
                                                                <div
                                                                    class="otp-wrapper col-12 d-flex justify-content-start align-items-center gap-2"
                                                                >
                                                                    {#each otp as value, idx (idx)}
                                                                        <input
                                                                            class="otp-box"
                                                                            maxlength="1"
                                                                            autocomplete="one-time-code"
                                                                            bind:this={
                                                                                otpBoxes[
                                                                                    idx
                                                                                ]
                                                                            }
                                                                            bind:value={
                                                                                formData
                                                                                    .otpmfa[
                                                                                    idx
                                                                                ]
                                                                            }
                                                                            oninput={(
                                                                                e,
                                                                            ) =>
                                                                                handleInput(
                                                                                    e,
                                                                                    idx,
                                                                                    6,
                                                                                )}
                                                                            onkeydown={(
                                                                                e,
                                                                            ) =>
                                                                                handleKeydown(
                                                                                    e,
                                                                                    idx,
                                                                                )}
                                                                            onpaste={(
                                                                                e,
                                                                            ) =>
                                                                                handlePaste(
                                                                                    e,
                                                                                    idx,
                                                                                )}
                                                                        />
                                                                    {/each}
                                                                </div>
                                                            </div>
                                                            <div
                                                                class="action-bar d-flex justify-content-end align-items-center mt-4"
                                                            >
                                                                <button
                                                                    class="btn btn-gradient-primary me-2"
                                                                    type="submit"
                                                                    disabled={formData.loading ||
                                                                        formData.otpmfa.join(
                                                                            "",
                                                                        )
                                                                            .length !==
                                                                            6}
                                                                    >{#if !formData.loading}
                                                                        <span
                                                                            >Verify
                                                                        </span>{:else}
                                                                        <span
                                                                            >Processing
                                                                            ... <span
                                                                                class="spinner-border spinner-border-sm"

                                                                            ></span>
                                                                        </span>
                                                                    {/if}
                                                                </button>
                                                            </div>
                                                        </form>

                                                        {#if formData.qrZoomVisible}
                                                            <button
                                                                class="btn btn-primary qr-zoom-overlay"
                                                                onclick={() =>
                                                                    closeQrPreview()}
                                                            >
                                                                <img
                                                                    alt="qr-zoom"
                                                                    class="qr-zoom-image"
                                                                    src={formData.qrBase64}
                                                                />
                                                            </button>
                                                        {/if}
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Password -->
                                <div class="card-body row p-4">
                                    <div class="col-12">
                                        <div class="card mb-0">
                                            <div class="card-header">
                                                <div class="flex-shrink-0">
                                                    <div
                                                        class="d-flex gap-2 align-items-center"
                                                    >
                                                        <i
                                                            class="bi bi-key-fill"
                                                            style="font-size: 20px"
                                                        ></i>
                                                        <h5 class="mb-0">
                                                            Password
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="card-body">
                                                <p class="text-muted">
                                                    Untuk menjaga keamanan akun
                                                    Anda, silakan perbarui kata
                                                    sandi Anda secara berkala.
                                                    Pastikan Anda menggunakan
                                                    kata sandi yang kuat dan
                                                    tidak digunakan pada layanan
                                                    lain. Setelah kata sandi
                                                    diperbarui, Anda akan
                                                    diminta untuk melakukan
                                                    verifikasi ulang saat login
                                                    berikutnya.
                                                </p>
                                                <div
                                                    class="d-flex justify-content-end align-items-center"
                                                >
                                                    <div
                                                        class="d-flex align-items-center gap-2"
                                                    >
                                                        {#if !formData.showPasswordCard}
                                                            <button
                                                                class="btn btn-gradient-primary"
                                                                onclick={async () => {
                                                                    await RequestChangePassword();
                                                                }}
                                                                disabled={formData.loading}
                                                                >{#if !formData.loading}
                                                                    Change
                                                                    Password
                                                                {:else}<span
                                                                        class="spinner-border spinner-border-sm me-1"

                                                                    ></span>Please
                                                                    wait ...
                                                                {/if}</button
                                                            >
                                                        {/if}
                                                        {#if formData.showPasswordCard}
                                                            <button
                                                                class="btn btn-outline-primary"
                                                                onclick={() => {
                                                                    CancelChangePassword();
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        {/if}
                                                    </div>
                                                </div>
                                            </div>

                                            {#if formData.showPasswordCard}
                                                <div class="card-body">
                                                    <hr />
                                                    <p class="mb-3 text-muted">
                                                        Untuk memperbarui kata
                                                        sandi, silakan masukkan
                                                        kata sandi Anda saat
                                                        ini.
                                                    </p>

                                                    <form
                                                        onsubmit={async () =>
                                                            await submitChangePassword()}
                                                        id="passwordResetForm"
                                                    >
                                                        <!-- CURRENT PASSWORD -->
                                                        <div class="mb-4">
                                                            <label
                                                                class="form-label"
                                                                for="oldPassword"
                                                                >Kata Sandi Saat
                                                                Ini</label
                                                            >
                                                            <div
                                                                class="password-input-wrapper"
                                                            >
                                                                <InputPassword
                                                                    id="oldPassword"
                                                                    bind:value={
                                                                        formData.oldPassword
                                                                    }
                                                                    autocomplete="one-time-code"
                                                                    required
                                                                    withicon={false}
                                                                    placeholder="Kata Sandi Saat Ini"
                                                                />
                                                            </div>
                                                        </div>

                                                        <!-- NEW PASSWORD -->
                                                        <div class="mb-4">
                                                            <label
                                                                class="form-label"
                                                                for="newPassword"
                                                                >Kata Sandi Baru</label
                                                            >
                                                            <div
                                                                class="password-input-wrapper"
                                                            >
                                                                <InputPassword
                                                                    id="newPassword"
                                                                    bind:value={
                                                                        formData.newPassword
                                                                    }
                                                                    autocomplete="one-time-code"
                                                                    required
                                                                    withicon={false}
                                                                    placeholder="Kata Sandi Baru"
                                                                />
                                                            </div>
                                                        </div>

                                                        <!-- CONFIRM NEW PASSWORD -->
                                                        <div class="mb-4">
                                                            <label
                                                                class="form-label"
                                                                for="confirmPassword"
                                                                >Konfirmasi Kata
                                                                Sandi Baru</label
                                                            >
                                                            <InputPassword
                                                                id="confirmPassword"
                                                                bind:value={
                                                                    formData.confirmPassword
                                                                }
                                                                autocomplete="one-time-code"
                                                                required
                                                                withicon={false}
                                                                placeholder="Konfirmasi Kata Sandi Baru"
                                                            />
                                                        </div>

                                                        <div class="mb-4">
                                                            <label
                                                                class="form-label"
                                                                for=""
                                                            >
                                                                {formData.method ===
                                                                "mfa"
                                                                    ? "Masukkan 6 digit kode yang dihasilkan oleh aplikasi Google Authenticator Anda."
                                                                    : formData.method ===
                                                                        "email"
                                                                      ? "Kami telah mengirimkan kode 6 digit ke email Anda. Masukkan kode tersebut untuk verifikasi perubahan password Anda."
                                                                      : "Masukkan kode verifikasi 6 digit."}
                                                            </label>
                                                            <div
                                                                class="otp-wrapper col-12 d-flex justify-content-start align-items-center gap-2"
                                                            >
                                                                <!-- <input
                                                                    nmodel="otp[0]"
                                                                    data-idx="0"
                                                                    maxlength="1"
                                                                    class="otp-box"
                                                                    type="text"
                                                                    inputmode="numeric"
                                                                    pattern="[0-9]*"
                                                                />
                                                                <input
                                                                    ng-model="otp[1]"
                                                                    data-idx="1"
                                                                    maxlength="1"
                                                                    class="otp-box"
                                                                    type="text"
                                                                    inputmode="numeric"
                                                                    pattern="[0-9]*"
                                                                />
                                                                <input
                                                                    ng-model="otp[2]"
                                                                    data-idx="2"
                                                                    maxlength="1"
                                                                    class="otp-box"
                                                                    type="text"
                                                                    inputmode="numeric"
                                                                    pattern="[0-9]*"
                                                                />
                                                                <input
                                                                    ng-model="otp[3]"
                                                                    data-idx="3"
                                                                    maxlength="1"
                                                                    class="otp-box"
                                                                    type="text"
                                                                    inputmode="numeric"
                                                                    pattern="[0-9]*"
                                                                />
                                                                <input
                                                                    ng-model="otp[4]"
                                                                    data-idx="4"
                                                                    maxlength="1"
                                                                    class="otp-box"
                                                                    type="text"
                                                                    inputmode="numeric"
                                                                    pattern="[0-9]*"
                                                                />
                                                                <input
                                                                    ng-model="otp[5]"
                                                                    data-idx="5"
                                                                    maxlength="1"
                                                                    class="otp-box"
                                                                    type="text"
                                                                    inputmode="numeric"
                                                                    pattern="[0-9]*"
                                                                /> -->
                                                                {#each otp as value, idx (idx)}
                                                                    <input
                                                                        class="otp-box"
                                                                        maxlength="1"
                                                                        autocomplete="one-time-code"
                                                                        bind:this={
                                                                            otpBoxes[
                                                                                idx
                                                                            ]
                                                                        }
                                                                        bind:value={
                                                                            formData
                                                                                .otp[
                                                                                idx
                                                                            ]
                                                                        }
                                                                        oninput={(
                                                                            e,
                                                                        ) =>
                                                                            handleInput(
                                                                                e,
                                                                                idx,
                                                                                6,
                                                                            )}
                                                                        onkeydown={(
                                                                            e,
                                                                        ) =>
                                                                            handleKeydown(
                                                                                e,
                                                                                idx,
                                                                            )}
                                                                        onpaste={(
                                                                            e,
                                                                        ) =>
                                                                            handlePaste(
                                                                                e,
                                                                                idx,
                                                                            )}
                                                                    />
                                                                {/each}
                                                            </div>
                                                            <div
                                                                class="col-12 d-flex justify-content-start align-items-center mt-2"
                                                                ng-if="method === 'email'"
                                                            >
                                                                <span
                                                                    class="fs-sm text-muted"
                                                                >
                                                                    Tidak terima
                                                                    code OTP ?
                                                                    <a
                                                                        href={null}
                                                                        class="text-primary text-decoration-none"
                                                                        disabled={formData.isCooldown}
                                                                        onclick={async () => {
                                                                            ResendEmail();
                                                                        }}
                                                                        >{formData.resendText}</a
                                                                    >
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <!-- PASSWORD RULES -->
                                                        <div
                                                            class="password-rules mt-3"
                                                        >
                                                            <h6>
                                                                Aturan Kata
                                                                Sandi:
                                                            </h6>
                                                            <ul>
                                                                <li
                                                                    class:passed={rules.minLength}
                                                                >
                                                                    Minimal 8
                                                                    karakter
                                                                </li>
                                                                <li
                                                                    class:passed={rules.uppercase}
                                                                >
                                                                    Mengandung
                                                                    huruf besar
                                                                    (A&ndash;Z)
                                                                </li>
                                                                <li
                                                                    class:passed={rules.number}
                                                                >
                                                                    Mengandung
                                                                    angka
                                                                    (0&ndash;9)
                                                                </li>
                                                                <li
                                                                    class:passed={rules.special}
                                                                >
                                                                    Contains
                                                                    symbol
                                                                    (!@#$%^&*)
                                                                </li>
                                                                <li
                                                                    class:passed={rules.notOnlyLettersOrNumbers}
                                                                >
                                                                    Tidak boleh
                                                                    hanya
                                                                    terdiri dari
                                                                    huruf atau
                                                                    hanya angka
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        <!-- SUBMIT BUTTON -->
                                                        <button
                                                            class="btn btn-primary"
                                                            type="submit"
                                                            disabled={formData.loading ||
                                                                !formData.allRulesPassed ||
                                                                formData.newPassword !==
                                                                    formData.confirmPassword ||
                                                                formData.otp.join(
                                                                    "",
                                                                ).length !== 6}
                                                        >
                                                            <span
                                                                >{#if !formData.loading}Update
                                                                    Password
                                                                {/if}
                                                                {#if formData.loading}<i
                                                                        class="fa fa-spinner fa-spin"
                                                                    ></i> Processing...
                                                                {/if}</span
                                                            >
                                                        </button>
                                                    </form>
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                </div>

                                <!-- password expiration -->
                                <div class="card-body row p-4">
                                    <div class="col-12">
                                        <div class="card mb-0">
                                            <div class="card-header">
                                                <div class="flex-shrink-0">
                                                    <div
                                                        class="d-flex gap-2 align-items-center"
                                                    >
                                                        <i
                                                            class="bi bi-calendar-x-fill"
                                                            style="font-size: 20px"
                                                        ></i>
                                                        <h5 class="mb-0">
                                                            Password Expiration
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="card-body">
                                                <p class="text-muted">
                                                    Atur kebijakan kedaluwarsa
                                                    kata sandi yang akan
                                                    diterapkan pada seluruh
                                                    pengguna di bawah otorisasi
                                                    Anda. Pengguna yang melewati
                                                    masa berlaku yang ditentukan
                                                    akan diminta untuk membuat
                                                    kata sandi baru.
                                                </p>
                                                <div
                                                    class="d-flex justify-content-end align-items-center"
                                                >
                                                    <div
                                                        class="d-flex align-items-center gap-2"
                                                    >
                                                        {#if !formData.showPasswordExpiration}
                                                            <button
                                                                onclick={() =>
                                                                    OpenPasswordExpiration()}
                                                                class="btn-gradient-primary"
                                                                >Set Password
                                                                Expiration
                                                            </button>
                                                        {/if}
                                                        {#if formData.showPasswordExpiration}
                                                            <button
                                                                onclick={() => {
                                                                    CancelPasswordExpiration();
                                                                }}
                                                                class="btn-gradient-primary"
                                                            >
                                                                Cancel
                                                            </button>
                                                        {/if}
                                                    </div>
                                                </div>
                                            </div>

                                            {#if formData.showPasswordExpiration}
                                                <div class="card-body">
                                                    <hr />

                                                    <p class="mb-2 fw-semibold">
                                                        Password Expiry
                                                        Duration:
                                                    </p>

                                                    <div class="mb-3">
                                                        <AutoSelect
                                                            id="passwordExpiryOption"
                                                            bind:value={
                                                                formData.passwordExpiryOption
                                                            }
                                                            options={[
                                                                {
                                                                    value: 30,
                                                                    label: "30 Hari",
                                                                },
                                                                {
                                                                    value: 180,
                                                                    label: "6 Bulan",
                                                                },
                                                                {
                                                                    value: 360,
                                                                    label: "1 Tahun",
                                                                },
                                                            ]}
                                                            placeholder="Please choose one option"
                                                            required
                                                        />
                                                    </div>

                                                    <div
                                                        class="d-flex justify-content-end"
                                                    >
                                                        <button
                                                            class="btn btn-primary"
                                                            onclick={() => {
                                                                SubmitPasswordExpiration();
                                                            }}
                                                            disabled={!formData.passwordExpiryOption}
                                                        >
                                                            Save Expiration
                                                            Settings
                                                        </button>
                                                    </div>
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .size-5 {
        height: 20px !important;
        width: 20px !important;
    }

    .h-44 {
        height: 176px !important;
    }

    .mt-n14 {
        margin-top: -3.5rem !important;
    }

    .size-28 {
        height: 7rem !important;
        width: 7rem !important;
    }

    .size-96 {
        height: 24rem !important;
        width: 24rem !important;
    }

    .size-80 {
        height: 20rem !important;
        width: 20rem !important;
    }

    .size-40 {
        height: 10rem !important;
        width: 10rem !important;
    }

    .profile-widget {
        background-color: rgba(169, 102, 255, 0.1);
    }

    .profile-widget div {
        border-width: 60px;
        border-style: solid;
        rotate: 45deg;
    }

    .profile-widget div:nth-child(1) {
        position: absolute;
        top: 0;
        left: 0;
        border-color: rgba(169, 102, 255, 0.1);
    }

    .profile-widget div:nth-child(2) {
        position: absolute;
        top: 5rem;
        left: 2rem;
        border-color: rgba(169, 102, 255, 0.1);
    }

    .profile-widget div:nth-child(3) {
        position: absolute;
        top: 9rem;
        left: 7rem;
        border-color: rgba(169, 102, 255, 0.1);
    }

    .profile-avatar .profile-avatar-wrapper {
        position: relative;
        padding: 0.25rem;
        border-radius: 50rem;
        background: linear-gradient(
            to top right,
            rgba(169, 102, 255, 0.5),
            rgba(239, 68, 68, 0.5),
            rgba(34, 197, 94, 0.5)
        );
    }

    .profile-avatar .profile-avatar-img {
        border-radius: 50rem;
        border:
            4px solid 239,
            68,
            68;
    }

    .profile-avatar .profile-avatar-dot {
        border-radius: 50rem;
        border:
            2px solid 239,
            68,
            68;
        position: absolute;
        right: 0.625rem;
        bottom: 0.625rem;
    }

    .profile-avatar .profile-avatar-dot {
        border-radius: 50rem;
        border: 8px solid #22c55e;
        position: absolute;
        right: 0.625rem;
        bottom: 0.625rem;
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

    .password-rules li.passed {
        color: #00b060;
        font-weight: 600;
    }

    .mfa-qr {
        width: 124px;
        height: 124px;
        object-fit: contain;
        margin-top: 2px;
        background: #fafbff;
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

    .cant-scan-label {
        font-weight: 600;
        font-size: 13px;
        color: #232134;
        margin-bottom: 2px;
    }

    .setup-key-input {
        width: 100%;
        height: 42px;
        border-radius: 6px;
        border: 1px solid #e0e2e6;
        background: #f3f3f3;
        padding: 12px 90px 12px 16px;
        font-size: 16px;
        color: #232134;
        font-family: monospace;
        box-sizing: border-box;
        outline: none;
    }
</style>
