import { logoutApi } from "@/api/axios"

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USERNAME_KEY = 'username'

export const tokenStorage = {
    setTokens(accessToken: string, refreshToken: string, username?: string) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
        if (username && username.trim()) {
            localStorage.setItem(USERNAME_KEY, username)
        }
    },

    getUserName(): string | null {
        const username = localStorage.getItem(USERNAME_KEY);
        if (username && username.trim()) {
            return username;
        }

        const token = this.getAccessToken();
        if (!token) {
            return null;
        }
        try {
            const [, payloadBase64] = token.split('.');
            if (!payloadBase64) {
                return null;
            }
            const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
            const payloadJson = atob(padded);
            const payload = JSON.parse(payloadJson) as { username?: string };
            return payload.username || null;
        } catch {
            return null;
        }
    },

    getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY)
    },

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY)
    },

    clearTokens() {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USERNAME_KEY)
    },

    hasAccessToken(): boolean {
        return !!this.getAccessToken();
    },

    isAccessTokenValid(): boolean {
        const token = this.getAccessToken();
        if (!token) {
            return false;
        }

        try {
            const [, payloadBase64] = token.split('.');
            if (!payloadBase64) {
                return false;
            }

            const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
            const payloadJson = atob(padded);
            const payload = JSON.parse(payloadJson) as { exp?: number };

            if (typeof payload.exp !== 'number') {
                return false;
            }

            const nowInSeconds = Math.floor(Date.now() / 1000);
            return payload.exp > nowInSeconds;
        } catch {
            return false;
        }
    },

    async logout() {
        const accessToken = this.getAccessToken();

        if (accessToken) {
            try {
                await logoutApi(accessToken);
            } catch (error) {
            }
        }
        this.clearTokens()
    }
}
