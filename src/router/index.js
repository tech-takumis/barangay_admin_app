import { createWebHistory, createRouter } from 'vue-router'
import { useUsers } from '@/stores/user'
import Welcome from '@/pages/Welcome.vue'

const APP_NAME = import.meta.env.VITE_APP_NAME

const routes = [
    {
        path: '/',
        name: 'welcome',
        component: Welcome,
        meta: {
            title: 'Welcome',
            metaTags: [
                {
                    name: 'Welcome',
                    content:
                        'An application / authentication starter kit frontend in Vue.js 3 for Laravel Breeze.',
                },
                {
                    property: 'og:Welcome',
                    content:
                        'An application / authentication starter kit frontend in Vue.js 3 for Laravel Breeze.',
                },
            ],
        },
    },
    {
        path: '/home',
        redirect: '/dashboard',
        component: import('@/pages/Dashboard.vue'),
        query: {
            verified: 'verified',
        },
        meta: {
            guard: 'auth',
        },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/pages/Dashboard.vue'),
        meta: {
            title: 'Dashboard',
            guard: 'auth',
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/auth/Login.vue'),
        query: {
            reset: 'reset',
        },
        meta: {
            title: 'Log in',
            guard: 'guest',
        },
    },
    // register a staff it must be authenticate so that only admin can add new staff 
    {
        path: '/staff/register',
        name: 'register',
        component: () => import('@/pages/auth/Register.vue'),
        meta: {
            title: 'Register',
            guard: 'auth',
        },
    },
    {
        path: '/staff',
        name: 'staff',
        component: () => import('@/pages/StaffPage.vue'),
        meta: {
            title: 'Staff',
            guard: 'auth',
        },
    },
    {
        path: '/certificate',
        name: 'certificate',
        component: () => import('@/pages/NewCertificatePage.vue'),
        meta: {
            title: 'Certificate',
            guard: 'auth',
        },
    },
    {
        path: '/certificates',
        name: 'all_certificates',
        component: () => import('@/pages/CertificatesPage.vue'),
        meta: {
            title: 'Certificates',
            guard: 'auth',
        },
    },
    {
        path: '/certificate/requests',
        name: 'certificate_requests',
        component: () => import('@/pages/CertificateRequestPage.vue'),
        meta: {
            title: 'Certificate Requests',
            guard: 'auth',
        },
    },
    {
        path: '/certificate-request/:id',
        name: 'CertificateRequestDetails',
        component: () => import('@/components/CertificateRequestDetails.vue'),
        meta: {
            title: 'Certificate Request',
            guard: 'auth',
        },
    },
    {
        path: '/edit-certificate/:id',
        name: 'EditCertificate',
        component: () => import('@/components/EditCertificateComponent.vue'),
        meta: {
            title: 'Edit certificate',
            guard: 'auth',
        },
    },
    {
        path: '/announcement',
        name: 'announcement',
        component: () => import('@/pages/AnnouncementPage.vue'),
        meta: {
            title: 'announcement',
            guard: 'auth',
        },
    },
    {
        path: '/activity/logs',
        name: 'activity_logs',
        component: () => import('@/pages/ActivityLogsPage.vue'),
        meta: {
            title: 'Activity Logs',
            guard: 'auth',
        },
    },
    {
        path: '/users/actions',
        name: 'userActions',
        component: () => import('@/pages/UserActionPage.vue'),
        meta: {
            title: 'User Actions',
            guard: 'auth',
        },
    },
    {
        path: '/password-reset/:token',
        name: 'password-reset',
        component: () => import('@/pages/auth/ResetPassword.vue'),
        query: {
            email: 'email',
        },
        meta: {
            title: 'Reset Password',
            guard: 'guest',
        },
    },
    {
        path: '/page-not-found',
        name: 'page-not-found',
        component: () => import('@/pages/errors/404.vue'),
        meta: {
            title: 'Page Not Found',
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/page-not-found',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation guard

router.beforeEach((to, from, next) => {
    const store = useUsers()

    const auth = store.authUser

    if (to.matched.some(route => route.meta.guard === 'guest') && auth)
        next({ name: 'dashboard' })
    else if (to.matched.some(route => route.meta.guard === 'auth') && !auth)
        next({ name: 'login' })
    else next()
})

// Page Title and Metadata

router.beforeEach((to, from, next) => {
    const nearestWithTitle = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.title)

    const nearestWithMeta = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.metaTags)

    if (nearestWithTitle) {
        document.title = nearestWithTitle.meta.title + ' - ' + APP_NAME
    } else {
        document.title = APP_NAME
    }

    Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(
        el => el.parentNode.removeChild(el),
    )

    if (!nearestWithMeta) return next()

    nearestWithMeta.meta.metaTags
        .map(tagDef => {
            const tag = document.createElement('meta')

            Object.keys(tagDef).forEach(key => {
                tag.setAttribute(key, tagDef[key])
            })

            tag.setAttribute('data-vue-router-controlled', '')

            return tag
        })

        .forEach(tag => document.head.appendChild(tag))

    next()
})

export default router
