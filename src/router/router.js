import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import MainPage from '@/pages/MainPage.vue';
import Auth from '@/pages/Auth.vue';

const routes = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage,
    },
    {
        path: '/auth',
        name: 'Auth',
        component: Auth,
    },
]

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    },
})

export default router;
