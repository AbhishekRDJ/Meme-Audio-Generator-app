// lib/api.ts
import axios from "axios";

// const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
const BASE = "http://localhost:5000";

const api = axios.create({
    baseURL: BASE,
    headers: { "Content-Type": "application/json" },
    timeout: 120000,
});

export function setAuthToken(token?: string | null) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

export default api;
