import { logoutApi } from "@/api/axios"

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_EMAIL_KEY = 'user_email'
const LEGACY_USERNAME_KEY = 'username'

export const tokenStorage = {
    setTokens(accessToken: string, refreshToken: string, email?: string) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
        if (email && email.trim()) {
            localStorage.setItem(USER_EMAIL_KEY, email)
        }
    },

    getUserName(): string | null {
        const email = localStorage.getItem(USER_EMAIL_KEY);
        if (email && email.trim()) {
            return email;
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
            const payload = JSON.parse(payloadJson) as { email?: string };
            return payload.email || null;
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
        localStorage.removeItem(USER_EMAIL_KEY)
        localStorage.removeItem(LEGACY_USERNAME_KEY)
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
