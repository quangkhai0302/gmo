import Login from "../views/Auth/Login.vue";
import Register from "../views/Auth/Register.vue";
import DashboardView from "../views/Dashboard/DashboardView.vue";
import PlaceholderView from "../views/Placeholder/PlaceholderView.vue";
import ScreenList from "../views/ScreenList/ScreenList.vue";
import StudentDetail from "../views/ScreenList/StudentDetail.vue";
import { tokenStorage } from "@/utils/tokenStorage";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        component: Login
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/dashboard',
        component: DashboardView
    },
    {
        path: '/students',
        component: ScreenList
    },
    {
        path: '/students/new',
        component: StudentDetail
    },
    {
        path: '/students/:id/edit',
        component: StudentDetail
    },
    {
        path: '/classes',
        component: PlaceholderView
    },
    {
        path: '/subjects',
        component: PlaceholderView
    },
    {
        path: '/reports',
        component: PlaceholderView
    },
    {
        path: '/settings',
        component: PlaceholderView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const AUTH_REQUIRED_PREFIXES = ['/dashboard', '/students', '/classes', '/subjects', '/reports', '/settings'];
const AUTH_PAGES = ['/', '/login', '/register'];

router.beforeEach((to) => {
    const hasToken = tokenStorage.hasAccessToken();
    const isTokenValid = tokenStorage.isAccessTokenValid();
    const isAuthRequiredRoute = AUTH_REQUIRED_PREFIXES.some(prefix => to.path.startsWith(prefix));

    if (AUTH_PAGES.includes(to.path)) {
        if (isTokenValid) {
            return { path: '/dashboard' };
        }

        if (hasToken) {
            tokenStorage.clearTokens();
            if (to.path === '/' || to.path === '/login') {
                return { path: '/login', query: { expired: '1' } };
            }
        }

        if (to.path === '/') {
            return { path: '/login' };
        }
        return true;
    }

    if (isAuthRequiredRoute && !isTokenValid) {
        if (hasToken) {
            tokenStorage.clearTokens();
            return { path: '/login', query: { expired: '1' } };
        }
        return { path: '/login' };
    }

    return true;
});

export default router
