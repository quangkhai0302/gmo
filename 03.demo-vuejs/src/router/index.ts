import Login from "../views/Auth/Login.vue";
import Register from "../views/Auth/Register.vue";
import ScreenList from "../views/ScreenList/ScreenList.vue";
import StudentDetail from "../views/ScreenList/StudentDetail.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        redirect: '/login'
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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router