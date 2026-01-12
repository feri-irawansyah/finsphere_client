import { writable } from "svelte/store";

export let applicationStore = writable({
    urlPlatformConsole: "/api/platform/console",
    urlPlatformOMS: "/api/direct-trading/oms",
});