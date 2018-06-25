import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/Login.vue'
import Index from '../pages/Index.vue'
import Dashboard from '../pages/Dashboard.vue'
import App from '../pages/App.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: Index,
            children: [
                {
                    path: "",
                    component: Dashboard
                },
                {
                    path: "/app",
                    component: App
                }
            ]
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: "*",
            redirect: "/"
        }
    ]
})
