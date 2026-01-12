import { writable } from "svelte/store";

export const applicationStore = writable({
    urlPlatformConsole: "/api/platform/console",
    urlPlatformOMS: "/api/direct-trading/oms",
});