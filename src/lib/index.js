import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { writable } from "svelte/store";

// place files you want to import through the `$lib` alias in this folder.
export const messages = writable([]);

let connection = null;

export function initSignalR() {
    if (connection) return connection; // biar ga double connect

    connection = new HubConnectionBuilder()
        .withUrl("/api/hubs/progress", {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
            withCredentials: true
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

    connection.on("ReceiveMessage", (msg) => {
        messages.update((prev) => [...prev, msg]);
        console.log("📩 New message:", msg);
    });

    connection.onreconnecting((err) => {
        console.warn("🔄 SignalR reconnecting...", err);
    });

    connection.onreconnected((connectionId) => {
        console.log("✅ SignalR reconnected:", connectionId);
    });

    connection.onclose((err) => {
        console.error("❌ SignalR closed", err);
    });

    connection.start()
        .then(() => console.log("Connected to SignalR!"))
        .catch(err => console.error("SignalR error:", err));

    return connection;
}

export function sendMessage(message) {
    if (!connection) return;
    connection.invoke("SendToAll", message);
}

export const theme = writable('light');

const createModalStore = () => {
    const { subscribe, set, update } = writable(false);
    return {
        subscribe,
        open: () => update(() => true),
        close: () => update(() => false)
    };
}

export const refreshTable = writable(null);