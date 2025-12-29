import { initSignalR } from '$lib';
import { redirect } from '@sveltejs/kit';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '$lib/assets/scss/style.scss';

export const ssr = false;
export const prerender = false;

export async function load({ url, fetch }) {
    const publicRoutes = ['/login'];
    const pathname = url.pathname;

    let session = null;
    let error = null;

    try {
        const res = await fetch("/api/auth/session", { credentials: "include" });
        if (res.ok) {
            session = await res.json();
        } else {
            error = `Error fetching session: ${res.status} ${res.statusText}`;
        }
    } catch (err) {
        error = `Error fetching session: ${err.message}`;
    }

    const isLoggedIn = true;

    if (!isLoggedIn && !publicRoutes.includes(pathname)) {
        localStorage.setItem("redirectTo", pathname);
        throw redirect(302, "/login");
    }

    if (isLoggedIn && pathname === "/login") {
        throw redirect(302, localStorage.getItem("redirectTo") || "/");
    }

    if (isLoggedIn && typeof window !== "undefined") {
        initSignalR();
    }

    return { session, error };
}