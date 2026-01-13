import { redirect } from '@sveltejs/kit';
import fetcher from '$lib/fetcher';

import 'bootstrap-icons/font/bootstrap-icons.css';
import * as bootstrap from 'bootstrap';
import '$lib/assets/scss/style.scss';
import { applicationStore } from '$lib/stores/applicationStore';
import { get } from 'svelte/store';

export const ssr = false;
export const prerender = false;

export async function load({ url, fetch }) {
    const publicRoutes = ['/login', '/forget-password'];
    const pathname = url.pathname;

    let session = null;
    
    const app = applicationStore;

    // ✅ fetch session di SEMUA route
    try {
        // $inspect($applicationStore.urlPlatformConsole)
        session = await fetcher(fetch, `${app.urlPlatformConsole}/authuserinfo`);
    } catch {
        session = null;
    }

    const isLoggedIn = !!session;

    // 🔒 BELUM LOGIN → akses private
    if (!isLoggedIn && !publicRoutes.includes(pathname)) {
        localStorage.setItem('redirectTo', pathname);
        throw redirect(302, '/login');
    }

    // 🔁 SUDAH LOGIN → buka public route
    if (isLoggedIn && publicRoutes.includes(pathname)) {
        const redirectTo = localStorage.getItem('redirectTo') || '/';
        localStorage.removeItem('redirectTo');

        // 🔥 guard biar ga redirect ke halaman yg sama
        if (redirectTo !== pathname) {
            throw redirect(302, redirectTo);
        }
    }

    return { session };
}
