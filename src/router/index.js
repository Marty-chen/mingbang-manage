import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: "/",
        redirect: '/home'
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import('../components/Login.vue')
    },
    {
        path: '/home',
        name: 'Home',
        redirect: '/PageSetup',
        component: () =>
            import('../views/Home'),
        children: [
            {
                path: '/users',
                component: () =>
                    import('../components/users/Users')
            },
            {
                path: '/PageSetup',
                component: () =>
                    import('../components/page/PageSetup')
            },
            {
                path: '/Slideshow',
                component: () =>
                    import('../components/page/Slideshow')
            },
            {
                path: '/categories',
                component: () =>
                    import('../components/goods/Cate.vue')
            },
            {
                path: '/goods',
                component: () =>
                    import('../components/goods/List.vue')
            },
            {
                path: '/goods/add',
                component: () =>
                    import('../components/goods/Add.vue')
            },
    
            {
                path: '/reports',
                component: () =>
                    import('../components/report/Report.vue')
            },
            {
                path: '/messge',
                component: () =>
                    import('../components/messge/messge.vue')
            }
        ],
    },
    {
        path: '/about',
        name: 'About',
        
        component: () =>
            import('../views/About.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    // base: process.env.BASE_URL,
    routes
})


//路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    else {
        const tokenStr = window.sessionStorage.getItem('token')
        if (!tokenStr) return next('/login')
        next()
    }

})
export default router